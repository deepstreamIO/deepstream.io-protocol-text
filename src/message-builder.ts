import { 
  TOPIC, 
  CONNECTION_ACTIONS as CA, 
  AUTH_ACTIONS as AA,
  EVENT_ACTIONS as EA,
  RECORD_ACTIONS as RA,
  RPC_ACTIONS as PA,
  PRESENCE_ACTIONS as UA,
  MESSAGE_PART_SEPERATOR as SEP ,
  DEEPSTREAM_TYPES as TYPES
} from './constants'

const writeConfig = JSON.stringify({ writeSuccess: true })

const BUILDERS = {
  [TOPIC.CONNECTION.BYTE]: {
    [CA.ERROR.BYTE]: (msg, event) => ``,
    [CA.CHALLENGE.BYTE]: msg => ``,
    [CA.CHALLENGE_RESPONSE.BYTE]: msg => ``,
    [CA.ACCEPT.BYTE]: msg => ``,
    [CA.REJECTION.BYTE]: msg => ``,
    [CA.PING.BYTE]: msg => ``,
    [CA.PONG.BYTE]: msg => ``
  },
  [TOPIC.AUTH.BYTE]: {
    [AA.ERROR.BYTE]: (msg, event) => ``,
    [AA.REQUEST.BYTE]: msg => ``,
    [AA.AUTH_SUCCESFUL.BYTE]: msg => ``,
    [AA.INVALID_AUTH_DATA.BYTE]: msg => ``,
    [AA.TOO_MANY_AUTH_ATTEMPTS.BYTE]: msg => ``,
  },
  [TOPIC.EVENT.BYTE]: {
    [EA.ERROR.BYTE]: (msg, event) => ``,
    [EA.SUBSCRIBE.BYTE]: msg => ``,
    [EA.SUBSCRIBE_ACK.BYTE]: msg => ``,
    [EA.EMIT.BYTE]: msg => ``,
    [EA.LISTEN.BYTE]: msg => ``,
    [EA.LISTEN_ACK.BYTE]: msg => ``,
    [EA.UNLISTEN.BYTE]: msg => ``,
    [EA.UNLISTEN_ACK.BYTE]: msg => ``,
    [EA.LISTEN_ACCEPT.BYTE]: msg => ``,
    [EA.LISTEN_REJECT.BYTE]: msg => ``,
    [EA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE]: msg => ``,
    [EA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE]: msg => ``,
  },
  [TOPIC.RECORD.BYTE]: {
    [RA.ERROR.BYTE]: (msg, event) => ``,
    [RA.SUBSCRIBE.BYTE]: msg => ``,
    [RA.SUBSCRIBE_ACK.BYTE]: msg => ``,
    [RA.ERASE_WITH_WRITE_ACK.BYTE]: msg => `R|P|msg.name|msg.version|msg.path|U`,
  },
  [TOPIC.RPC.BYTE]: {
    [PA.ERROR.BYTE]: (msg, event) => ``,
    [PA.PROVIDE.BYTE]: msg => ``,
    [PA.PROVIDE_ACK.BYTE]: msg => ``,
    [PA.UNPROVIDE.BYTE]: msg => ``,
    [PA.UNPROVIDE_ACK.BYTE]: msg => ``,
    [PA.REQUEST.BYTE]: msg => ``,
    [PA.ACCEPT.BYTE]: msg => ``,
  },
  [TOPIC.PRESENCE.BYTE]: {
    [UA.ERROR.BYTE]: (msg, event) => ``,
    [UA.SUBSCRIBE.BYTE]: msg => ``,
    [UA.SUBSCRIBE_ACK.BYTE]: msg => ``,
    [UA.UNSUBSCRIBE.BYTE]: msg => ``,
    [UA.UNSUBSCRIBE_ACK.BYTE]: msg => ``,
    [UA.QUERY.BYTE]: msg => ``,
    [UA.PRESENCE_JOIN.BYTE]: msg => ``,
    [UA.PRESENCE_JOIN.BYTE]: msg => ``
  },
}

/**
 * Creates a deepstream message string, based on the
 * provided parameters
 *
 * @param   {String} topic  One of CONSTANTS.TOPIC
 * @param   {String} action One of CONSTANTS.ACTIONS
 * @param   {Array} data An array of strings or JSON-serializable objects
 *
 * @returns {String} deepstream message string
 */
export const getMessage = (message, isAck):string => {
  return ''
}

/**
 * Creates a deepstream error message string based on the provided
 * arguments
 */
export const getErrorMessage = function (message, event, errorMessage) {
  return ''
}

/**
 * Converts a serializable value into its string-representation and adds
 * a flag that provides instructions on how to deserialize it.
 *
 * Please see messageParser.convertTyped for the counterpart of this method
 */
export const typed = function (value): string {
  const type = typeof value

  if (type === 'string') {
    return TYPES.STRING + value
  }

  if (value === null) {
    return TYPES.NULL
  }

  if (type === 'object') {
    return TYPES.OBJECT + JSON.stringify(value)
  }

  if (type === 'number') {
    return TYPES.NUMBER + value.toString()
  }

  if (value === true) {
    return TYPES.TRUE
  }

  if (value === false) {
    return TYPES.FALSE
  }

  if (value === undefined) {
    return TYPES.UNDEFINED
  }

  throw new Error(`Can't serialize type ${value}`)
}
