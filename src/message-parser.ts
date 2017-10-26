import {
  ACTIONS_BYTE_TO_PAYLOAD as ABP,
  ACTIONS_BYTES,
  ACTIONS_TEXT_TO_BYTE,
  AUTH_ACTIONS as AA,
  CONNECTION_ACTIONS as CA,
  DEEPSTREAM_TYPES as TYPES,
  EVENT_ACTIONS as EA,
  MESSAGE_PART_SEPERATOR,
  MESSAGE_SEPERATOR,
  PARSER_ACTIONS as XA,
  PAYLOAD_ENCODING,
  PRESENCE_ACTIONS as UA,
  RECORD_ACTIONS as RA,
  RPC_ACTIONS as PA,
  TOPIC,
  TOPIC_TEXT_TO_BYTE,
} from './constants'

/**
 * This method tries to parse a value, and returns
 * an object containing the value or error.
 *
 * This is an optimization to avoid doing try/catch
 * inline since it incurs a massive performance hit
 * in most versions of node.
 */
function parseJSON (text, reviver?): any {
  try {
    return {
      value: JSON.parse(text, reviver),
    }
  } catch (err) {
    return {
      error: err,
    }
  }
}

const writeConfig = JSON.stringify({ writeSuccess: true })

export function parse (rawMessage: string): Array<Message> {
  const parsedMessages: Array<any> = []
  const rawMessages = rawMessage.split(MESSAGE_SEPERATOR)

  for (let i = 0; i < rawMessages.length; i++) {
    if (rawMessages[i].length < 3) {
      continue
    }

    const parts = rawMessages[i].split(MESSAGE_PART_SEPERATOR)

    const topic = TOPIC_TEXT_TO_BYTE[parts[0]]
    if (topic === undefined) {
      console.log('unknown topic', rawMessages[i])
      // invalid topic
      continue
    }

    let index = 1

    let name
    let data

    let version
    let path
    let isWriteAck

    let url
    let reason

    let subscription
    let correlationId

    let isAck = false
    let isError = false

    if (parts[index] === 'A') {
      isAck = true
      index++
    }

    if (parts[index] === 'E') {
      isError = true
      index++
    }

    let A
    if (topic === TOPIC.PARSER.BYTE) {
      A = ACTIONS_BYTES[topic]
    } else {
      A = ACTIONS_TEXT_TO_BYTE[topic]
    }
    const rawAction = parts[index++]
    let action = A[rawAction]

    if (action === undefined) {
      if (
        (isError && topic === TOPIC.RPC.BYTE) ||
        (topic === TOPIC.CONNECTION.BYTE && isAck) ||
        (topic === TOPIC.AUTH.BYTE && (isError || isAck)) ||
        (isError && topic === TOPIC.RECORD.BYTE)
      ) {
        // ignore
      } else {
        console.log('unknown action', rawAction, rawMessages[i], ACTIONS_TEXT_TO_BYTE)
        continue
      }
    }
    if (topic === TOPIC.RECORD.BYTE) {
    /************************
    ***  RECORD
    *************************/
      name = parts[index++]
      if (isError) {
        isError = false
        if (rawAction === 'VERSION_EXISTS') {
          action = RA.VERSION_EXISTS.BYTE
          version = Number(parts[index++])
          data = parts[index++]
          if (parts.length - index > 1) {
            isWriteAck = true
          }
        } else if (rawAction === 'CACHE_RETRIEVAL_TIMEOUT') {
          action = RA.CACHE_RETRIEVAL_TIMEOUT.BYTE
        } else if (rawAction === 'STORAGE_RETRIEVAL_TIMEOUT') {
          action = RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE
        }
      } else if (
        action === RA.CREATEANDUPDATE.BYTE ||
        action === RA.UPDATE.BYTE ||
        action === RA.PATCH.BYTE
      ) {
        isWriteAck = (parts[parts.length - 1] === writeConfig)
        version = Number(parts[index++])

        if (action === RA.CREATEANDUPDATE.BYTE && parts.length === 7) {
          action = RA.CREATEANDPATCH.BYTE
        }

        if (action === RA.CREATEANDPATCH.BYTE || action === RA.PATCH.BYTE) {
          path = parts[index++]
        }

        if (parts.length - index === 2) {
          data = parts[parts.length - 2]
        } else {
          data = parts[index++]
        }
      } else if (
        action === RA.LISTEN_ACCEPT.BYTE ||
        action === RA.LISTEN_REJECT.BYTE ||
        action === RA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE ||
        action === RA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE
      ) {
        subscription = parts[index++]
      } else if (action === RA.SUBSCRIPTION_HAS_PROVIDER.BYTE) {
        if (parts[index++] === 'F') {
          action = RA.SUBSCRIPTION_HAS_NO_PROVIDER.BYTE
        }
      } else if (action === RA.READ_RESPONSE || action === RA.HEAD_RESPONSE) {
        version = Number(parts[index++])
      }
    } else if (topic === TOPIC.EVENT.BYTE) {
    /************************
    ***  EVENT
    *************************/
      name = parts[index++]
      if (
        action === EA.LISTEN_ACCEPT.BYTE ||
        action === EA.LISTEN_REJECT.BYTE ||
        action === EA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE ||
        action === EA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE
      ) {
        subscription = parts[index++]
      } else if (action === EA.EMIT.BYTE) {
        data = parts[index++]
      }
    } else if (topic === TOPIC.RPC.BYTE) {
    /************************
    ***  RPC
    *************************/
      name = parts[index++]
      if (isAck && action === PA.REQUEST.BYTE) {
        isAck = false
        action = PA.ACCEPT.BYTE
      }
      if (isError) {
        isError = false
        action = PA.REQUEST_ERROR.BYTE
        reason = rawAction
      }
      if (action !== PA.PROVIDE.BYTE && action !== PA.UNPROVIDE.BYTE) {
        correlationId = parts[index++]
      }
      if (action === PA.RESPONSE.BYTE || action === PA.REQUEST.BYTE) {
        data = parts[index++]
      }
    } else if (topic === TOPIC.PRESENCE.BYTE) {
    /************************
    ***  Presence
    *************************/
      if (action === UA.QUERY.BYTE) {
        if (parts.length === 3) {
          action = UA.QUERY_ALL.BYTE
        } else {
          correlationId = parts[index++]
          data = parts[index++]
        }
      } else if (action === UA.SUBSCRIBE.BYTE || action === UA.UNSUBSCRIBE.BYTE) {
        if (parts.length === 4 && !isAck) {
          correlationId = parts[index++]
        }
        data = parts[index++]
      }
    } else if (topic === TOPIC.CONNECTION.BYTE) {
      /************************
      ***  Connection
      *************************/
      if (action === CA.PONG.BYTE) {
        continue
      }
      if (isAck) {
        action = CA.ACCEPT.BYTE
        isAck = false
      } else if (action === CA.CHALLENGE_RESPONSE.BYTE || action === CA.REDIRECT.BYTE) {
        url = parts[index++]
      } else if (action === CA.REJECT.BYTE) {
        reason = parts[index++]
      }
    } else if (topic === TOPIC.AUTH.BYTE) {
      /************************
      ***  Authentication
      *************************/
      if (isAck) {
        action = AA.AUTH_SUCCESSFUL.BYTE
      } else if (isError) {
        if (rawAction === 'INVALID_AUTH_DATA') {
          isError = false
          action = AA.AUTH_UNSUCCESSFUL.BYTE
        } else if (rawAction === 'TOO_MANY_AUTH_ATTEMPTS') {
          isError = false
          action = AA.TOO_MANY_AUTH_ATTEMPTS.BYTE
        }
      }
      if (action === AA.AUTH_SUCCESSFUL.BYTE) {
        isAck = false
        data = rawAction
      } else if (action === AA.REQUEST.BYTE) {
        data = parts[index++]
      } else if (action === AA.AUTH_UNSUCCESSFUL.BYTE) {
        reason = parts[index++]
      }
    } else if (topic === TOPIC.PARSER.BYTE) {
      /************************
      ********  Parser  *******
      *************************/
      isError = true
      if (action === XA.UNKNOWN_TOPIC.BYTE || action === XA.UNKNOWN_ACTION.BYTE) {
        reason = parts[index++]
      }
    }

    parsedMessages.push(JSON.parse(JSON.stringify({
      isAck,
      isError,
      topic,
      action,
      name,
      data,

      // authentication
      reason,
      url,

      // rpc / presence query
      correlationId,

      // subscription by listening
      subscription,

      // record
      path,
      version,
      // parsedData: null,
      isWriteAck,
    })))
  }
  return parsedMessages
}

export function parseData (message: Message): true | Error {
  if (message.parsedData || !message.data) {
    return true
  }

  if (typeof message.data !== 'string') {
    throw new Error('tried to parse binary data with string parser')
  }

  if (ABP[message.topic][message.action] === PAYLOAD_ENCODING.DEEPSTREAM) {
    const parsedData = convertTyped(message.data)
    if (parsedData instanceof Error) {
      return parsedData
    }
    message.parsedData = parsedData
    return true
  } else {
    const res = parseJSON(message.data)
    if (res.error) {
      return res.error
    }
    message.parsedData = res.value
    return true
  }
}

/**
 * Deserializes values created by MessageBuilder.typed to
 * their original format
 */
export function convertTyped (value: string): any {
  const type = value.charAt(0)

  if (type === TYPES.STRING) {
    return value.substr(1)
  }

  if (type === TYPES.OBJECT) {
    const result = parseJSON(value.substr(1))
    if (result.value) {
      return result.value
    }
    return result.error
  }

  if (type === TYPES.NUMBER) {
    return parseFloat(value.substr(1))
  }

  if (type === TYPES.NULL) {
    return null
  }

  if (type === TYPES.TRUE) {
    return true
  }

  if (type === TYPES.FALSE) {
    return false
  }

  if (type === TYPES.UNDEFINED) {
    return undefined
  }

  return new Error('Unknown type')
}
