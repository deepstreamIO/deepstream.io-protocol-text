import {
  TOPIC,
  CONNECTION_ACTIONS as CA,
  AUTH_ACTIONS as AA,
  EVENT_ACTIONS as EA,
  RECORD_ACTIONS as RA,
  RPC_ACTIONS as PA,
  PRESENCE_ACTIONS as UA,
  MESSAGE_PART_SEPERATOR,
  MESSAGE_SEPERATOR,
  DEEPSTREAM_TYPES as TYPES,
  PAYLOAD_ENCODING,
  TOPIC_TEXT_TO_BYTE,
  ACTIONS_TEXT_TO_BYTE
} from './constants'

/**
 * This method tries to parse a value, and returns
 * an object containing the value or error.
 *
 * This is an optimization to avoid doing try/catch
 * inline since it incurs a massive performance hit
 * in most versions of node.
 */
function parseJSON(text, reviver?): any {
  try {
    return {
      value: JSON.parse(text, reviver)
    }
  } catch (err) {
    return {
      error: err
    }
  }
}

const writeConfig = JSON.stringify({ writeSuccess: true })

export const parse = (rawMessage) => {
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

    let dataEncoding

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

    const A = ACTIONS_TEXT_TO_BYTE[topic]
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
        console.log('unknown action', parts[index - 1], rawMessages[i])
        continue
      }
    }

    /************************
    ***  RECORD
    *************************/
    if (topic === TOPIC.RECORD.BYTE) {
      console.log(parts)
      name = parts[index++]
      if (isError) {
        isError = false
        if (rawAction === 'VERSION_EXISTS') {
          action = RA.VERSION_EXISTS.BYTE
          version = parts[index++] * 1
          data = parts[index++]
          isWriteAck = parts.length - index > 1
        } else if (rawAction === 'CACHE_RETRIEVAL_TIMEOUT') {
          action = RA.CACHE_RETRIEVAL_TIMEOUT.BYTE
        } else if (rawAction === 'STORAGE_RETRIEVAL_TIMEOUT') {
          action = RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE
        }
      } else if (
        action === RA.SUBSCRIBECREATEANDREAD.BYTE ||
        action === RA.CREATEANDUPDATE.BYTE ||
        action === RA.UPDATE.BYTE ||
        action === RA.PATCH.BYTE
      ) {
        if (
          action === RA.UPDATE.BYTE ||
          action === RA.PATCH.BYTE ||
          action === RA.CREATEANDUPDATE.BYTE
        ) {
          isWriteAck = false
          version = parts[index++] * 1
        }
        if (parts[parts.length - 1] === writeConfig) {
          parts.pop()
          isWriteAck = true
        }
        if (
          (action === RA.CREATEANDUPDATE.BYTE && (parts.length - index === 1)) ||
          action === RA.UPDATE.BYTE
        ) {
          dataEncoding = PAYLOAD_ENCODING.JSON
        }
        else if (
          (action === RA.CREATEANDUPDATE.BYTE && parts.length - index > 1) ||
          action === RA.PATCH.BYTE
        ) {
          if (
            action === RA.CREATEANDUPDATE.BYTE && 
            parts.length - index > 1 &&
            parts[parts.length - 1] !== '{}'
          ) {
            action = RA.CREATEANDPATCH.BYTE
          } else {
            dataEncoding = PAYLOAD_ENCODING.JSON
          }
          if (action === RA.PATCH.BYTE || action === RA.CREATEANDPATCH.BYTE) {
            dataEncoding = PAYLOAD_ENCODING.DEEPSTREAM
            path = parts[index++]    
          }
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
      }
    /************************
    ***  EVENT
    *************************/
    } else if (topic === TOPIC.EVENT.BYTE) {
      name = parts[index++]
      if (
        action === EA.LISTEN_ACCEPT.BYTE ||
        action === EA.LISTEN_REJECT.BYTE ||
        action === EA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE ||
        action === EA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE
      ) {
        subscription = parts[index++]
      }
      else if (action === EA.EMIT.BYTE) {
        data = parts[index++]
        dataEncoding = PAYLOAD_ENCODING.DEEPSTREAM
      }
    /************************
    ***  RPC
    *************************/
    } else if (topic === TOPIC.RPC.BYTE) {
      name = parts[index++]
      if (isAck && action === PA.REQUEST.BYTE) {
        isAck = false
        action = PA.ACCEPT.BYTE
      }
      if (isError) {
        isError = false
        action = PA.REQUEST_ERROR.BYTE
        data = rawAction
      }
      if (action !== PA.PROVIDE.BYTE && action !== PA.UNPROVIDE.BYTE) {
        correlationId = parts[index++]
      }
      if (action === PA.RESPONSE.BYTE || action === PA.REQUEST.BYTE) {
        data = parts[index++]
        dataEncoding = PAYLOAD_ENCODING.DEEPSTREAM
      }
    }
    /************************
    ***  Presence
    *************************/
    else if (topic === TOPIC.PRESENCE.BYTE) {
      if (action === UA.QUERY.BYTE) {
        correlationId = parts[index++]
      }
      if (isAck || action === UA.QUERY.BYTE || action === UA.PRESENCE_JOIN.BYTE || action === UA.PRESENCE_LEAVE.BYTE) {
        name = parts[index++].toString()
      } else {
        name = action.toString()
      }
      if (!isAck && (action === UA.QUERY.BYTE || action === UA.SUBSCRIBE.BYTE || action === UA.UNSUBSCRIBE.BYTE)) {
        data = parts[index++]
      }
      /************************
      ***  Connection
      *************************/
    } else if (topic === TOPIC.CONNECTION.BYTE) {
      if (isAck) {
        action = CA.ACCEPT.BYTE
        isAck = false
      }
      else if (action === CA.CHALLENGE_RESPONSE.BYTE || action === CA.REDIRECT.BYTE || action === CA.REJECTION.BYTE) {
        data = parts[index++]
        dataEncoding = PAYLOAD_ENCODING.JSON
      }
      /************************
      ***  Authentication
      *************************/
    } else if (topic === TOPIC.AUTH.BYTE) {
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
        dataEncoding = PAYLOAD_ENCODING.JSON
      }
      else if (
        action === AA.REQUEST.BYTE ||
        action === AA.AUTH_UNSUCCESSFUL.BYTE
      ) {
        data = parts[index++]
        dataEncoding = PAYLOAD_ENCODING.JSON
      }
    }

    parsedMessages.push(JSON.parse(JSON.stringify({
      isAck,
      isError,
      topic,
      action,
      name,
      data,
      dataEncoding,

      // rpc / presence query
      correlationId,

      // subscription by listening
      subscription,

      // record
      path,
      version,
      // parsedData: null,
      isWriteAck
    })))
  }
  return parsedMessages
}

export const parseData = (message) => {
  if (message.parsedData || !message.data) {
    return true
  }

  if (message.dataEncoding === PAYLOAD_ENCODING.JSON) {
    const res = parseJSON(message.data)
    if (res.error) {
      return res.error
    }
    message.parsedData = res.value
    return true
  } else if (message.dataEncoding === PAYLOAD_ENCODING.DEEPSTREAM) {
    const parsedData = convertTyped(message.data)
    if (parsedData instanceof Error) {
      return parsedData
    }
    message.parsedData = parsedData
    return true
  } else if (typeof message.dataEncoding === 'undefined') {
    message.parsedData = message.data
    return true
  }

  return new Error('unknown data encoding')
}

/**
 * Deserializes values created by MessageBuilder.typed to
 * their original format
 */
export const convertTyped = (value: string): any => {
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
