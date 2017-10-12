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
    if (!topic) {
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
    let action = A[parts[index++]]

    if (!action) {
      if (!isError || topic !== TOPIC.RPC.BYTE) {
        console.log('unknown action', parts[index - 1], rawMessages[i])
        // invalid action
        continue
      } else {
        isError = false
        action = PA.REQUEST_ERROR.BYTE
      }
    }

    //   let index = 2
    //   const message = {
    //     isAck: false,
    //     isError: false,
    //     topic: parts[0],
    //     action: parts[1],
    //     name: null,
    //     data: [],
    //     dataEncoding: C.ENCODING_TYPES.DEEPSTREAM,
    //     raw: null,

    //     // rpc / presence query
    //     correlationId: null,

    //     // subscription by listening
    //     subscription: null,

    //     // record
    //     path: null,
    //     version: null,
    //     parsedData: null,
    //     isWriteAck: null
    //   }

    if (topic === TOPIC.RECORD.BYTE) {
      name = parts[index++]
      if (
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
          version = parts[index++] * 1
        }
        if (
          (action === RA.CREATEANDUPDATE.BYTE &&
            (parts.length - index === 2)) ||
          action === RA.UPDATE.BYTE
        ) {
          dataEncoding = PAYLOAD_ENCODING.JSON
        }
        if (
          action === RA.PATCH.BYTE ||
          (
            action === RA.CREATEANDUPDATE.BYTE &&
            parts.length - index > 2
          )
        ) {
          dataEncoding = PAYLOAD_ENCODING.DEEPSTREAM
          path = parts[index++]
        }
        if (parts.length - index === 2) {
          isWriteAck = parts[parts.length - 1] === writeConfig
          data = parts[parts.length - 2]
        } else {
          data = parts[index++]
        }
      }
    } else if (topic === TOPIC.EVENT.BYTE) {
      name = parts[index++]
      if (
        action === EA.LISTEN ||
        action === EA.UNLISTEN ||
        action === EA.LISTEN_ACCEPT ||
        action === EA.LISTEN_REJECT
      ) {
        subscription = parts[index++]
      }
      else if (action === EA.EMIT.BYTE) {
        data = parts[index++]
        dataEncoding = PAYLOAD_ENCODING.DEEPSTREAM
      }
    } else if (topic === TOPIC.RPC.BYTE) {
      name = parts[index++]
      if (isAck && action === PA.REQUEST.BYTE) {
        isAck = false
        action = PA.ACCEPT.BYTE
      }
      if (action !== PA.PROVIDE.BYTE && action !== PA.UNPROVIDE.BYTE) {
        correlationId = parts[index++]
      }
      if (action === PA.RESPONSE.BYTE || action === PA.REQUEST.BYTE) {
        data = parts[index++]
      }
    } else if (topic === TOPIC.PRESENCE.BYTE) {
      name = action
      correlationId = parts[index++]
      data = parts[index++]
    } else if (topic === TOPIC.CONNECTION.BYTE) {
      //     message.data = parts[index++]
    } else if (topic === TOPIC.AUTH.BYTE) {
      //     message.dataEncoding = C.ENCODING_TYPES.JSON
      //     message.data = parts[index++]
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
      // subscription: null,

      // record
      // path: null,
      version,
      // parsedData: null,
      // isWriteAck: null
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
