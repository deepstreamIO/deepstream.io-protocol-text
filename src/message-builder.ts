import { 
  TOPIC, 
  TOPIC_BYTE_TO_TEXT as TBT,
  ACTIONS_BYTE_TO_TEXT as ABT,
  ACTIONS_BYTE_TO_PAYLOAD as ABP,
  CONNECTION_ACTIONS as CA, 
  AUTH_ACTIONS as AA,
  EVENT_ACTIONS as EA,
  RECORD_ACTIONS as RA,
  RPC_ACTIONS as PA,
  PRESENCE_ACTIONS as UA,
  MESSAGE_PART_SEPERATOR as y,
  MESSAGE_SEPERATOR as x,
  DEEPSTREAM_TYPES as TYPES,
  PAYLOAD_ENCODING
} from './constants'

const WA = y + JSON.stringify({ writeSuccess: true })
const A = 'A' + y

const genericError = (msg, event, eventMessage) => `${TBT[msg.topic]}${y}E${y}${event}${y}${eventMessage}${x}`
const messageDenied = (msg, event) => `${TBT[msg.topic]}${y}E${y}MESSAGE_DENIED${y}${msg.name}${y}${ABT[msg.topic][msg.action]}${msg.correlationId ? y + msg.correlationId : '' }${x}`
const notSubscribed = (msg, event) => `${TBT[msg.topic]}${y}E${y}NOT_SUBSCRIBED${y}${msg.name}${x}`
const invalidAuth = msg => `A${y}E${y}INVALID_AUTH_DATA${y}${msg.data ? msg.data : 'U' }${x}`
const recordUpdate = (msg) => `R${y}U${y}${msg.name}${y}${msg.version}${y}${msg.data}${msg.isWriteAck ? WA : '' }${x}`
const recordPatch = (msg) => `R${y}P${y}${msg.name}${y}${msg.version}${y}${msg.path}${y}${msg.data}${msg.isWriteAck ? WA : '' }${x}`
const subscriptionForPatternFound = (msg) => `${TBT[msg.topic]}${y}SP${y}${msg.name}${y}${msg.subscription}${x}`
const subscriptionForPatternRemoved = (msg) => `${TBT[msg.topic]}${y}SR${y}${msg.name}${y}${msg.subscription}${x}`
const listen = (msg, event, isAck) => `${TBT[msg.topic]}${y}${isAck? A : '' }L${y}${msg.name}${x}`
const unlisten = (msg, event, isAck) => `${TBT[msg.topic]}${y}${isAck? A : '' }UL${y}${msg.name}${x}`
const listenAccept = msg => `${TBT[msg.topic]}${y}LA${y}${msg.name}${y}${msg.subscription}${x}`
const listenReject = msg => `${TBT[msg.topic]}${y}LR${y}${msg.name}${y}${msg.subscription}${x}`

const BUILDERS = {
  [TOPIC.CONNECTION.BYTE]: {
    [CA.ERROR.BYTE]: genericError,
    [CA.CHALLENGE.BYTE]: msg => `C${y}CH${x}`,
    [CA.CHALLENGE_RESPONSE.BYTE]: msg => `C${y}CHR${y}${msg.data}${x}`,
    [CA.ACCEPT.BYTE]: msg => `C${y}A${x}`,
    [CA.REJECTION.BYTE]: msg => `C${y}REJ${y}${msg.data}${x}`,
    [CA.REDIRECT.BYTE]: msg => `C${y}RED${y}${msg.data}${x}`,
    [CA.PING.BYTE]: msg => `C${y}PI${x}`,
    [CA.PONG.BYTE]: msg => `C${y}PO${x}`,
    [CA.CONNECTION_AUTHENTICATION_TIMEOUT.BYTE]: msg => `C${y}E${y}CONNECTION_AUTHENTICATION_TIMEOUT${x}`
  },
  [TOPIC.AUTH.BYTE]: {
    [AA.ERROR.BYTE]: genericError,
    [AA.REQUEST.BYTE]: msg => `A${y}REQ${y}${msg.data}${x}`,
    [AA.AUTH_SUCCESSFUL.BYTE]: msg => `A${y}A${msg.data ? y + msg.data : ''}${x}`,
    [AA.AUTH_UNSUCCESSFUL.BYTE]: invalidAuth,
    [AA.INVALID_MESSAGE_DATA.BYTE]: invalidAuth,
    [AA.TOO_MANY_AUTH_ATTEMPTS.BYTE]: msg => `A${y}E${y}TOO_MANY_AUTH_ATTEMPTS${x}`,
  },
  [TOPIC.EVENT.BYTE]: {
    [EA.ERROR.BYTE]: genericError,
    [EA.SUBSCRIBE.BYTE]: (msg, event, isAck) => `E${y}${isAck? A : '' }S${y}${msg.name}${x}`,
    [EA.UNSUBSCRIBE.BYTE]: (msg, event, isAck) => `E${y}${isAck? A : '' }US${y}${msg.name}${x}`,
    [EA.EMIT.BYTE]: msg => `E${y}EVT${y}${msg.name}${y}${msg.data ? msg.data : 'U'}${x}`,
    [EA.LISTEN.BYTE]: listen,
    [EA.UNLISTEN.BYTE]: unlisten,
    [EA.LISTEN_ACCEPT.BYTE]: listenAccept,
    [EA.LISTEN_REJECT.BYTE]: listenReject,
    [EA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE]: subscriptionForPatternFound,
    [EA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE]: subscriptionForPatternRemoved,
    [EA.MESSAGE_DENIED.BYTE]: messageDenied,
    [EA.NOT_SUBSCRIBED.BYTE]: notSubscribed
  },
  [TOPIC.RECORD.BYTE]: {
    [RA.ERROR.BYTE]: genericError,
    [RA.HEAD.BYTE]: (msg, event) => `R${y}HD${y}${msg.name}${x}`,
    [RA.HEAD_RESPONSE.BYTE]: (msg, event) => `R${y}HD${y}${msg.name}${y}${msg.data}${x}`,
    [RA.READ.BYTE]: (msg, event) => `R${y}R${y}${msg.name}${x}`,
    [RA.READ_RESPONSE.BYTE]: (msg, event) => `R${y}R${y}${msg.name}${y}${msg.version}${y}${msg.data}${x}`,
    [RA.UPDATE.BYTE]: recordUpdate,
    [RA.UPDATE_WITH_WRITE_ACK.BYTE]: recordUpdate,
    [RA.PATCH.BYTE]: recordPatch,
    [RA.PATCH_WITH_WRITE_ACK.BYTE]: recordPatch,
    [RA.ERASE.BYTE]: (msg, event) => `R${y}P${y}${msg.name}${y}${msg.version}${y}${msg.path}${y}U${msg.isWriteAck ? WA : '' }${x}`,
    [RA.ERASE_WITH_WRITE_ACK.BYTE]: (msg, event) => `R${y}P${y}${msg.name}${y}${msg.version}${y}${msg.path}${y}U${msg.isWriteAck ? WA : '' }${x}`,
    [RA.CREATEANDUPDATE.BYTE]: (msg, event) => `R${y}CU${y}${msg.name}${y}${msg.version}${y}${msg.data}${msg.isWriteAck ? WA : '' }${x}`,
    [RA.CREATEANDUPDATE_WITH_WRITE_ACK.BYTE]: (msg, event) => `R${y}CU${y}${msg.name}${y}${msg.version}${y}${msg.data}${msg.isWriteAck ? WA : '' }${x}`,
    [RA.CREATEANDPATCH.BYTE]: (msg, event) => `R${y}CU${y}${msg.name}${y}${msg.version}${y}${msg.path}${y}${msg.data}${msg.isWriteAck ? WA : '' }${x}`,
    [RA.CREATEANDPATCH_WITH_WRITE_ACK.BYTE]: (msg, event) => `R${y}CU${y}${msg.name}${y}${msg.version}${y}${msg.path}${y}${msg.data}${msg.isWriteAck ? WA : '' }${x}`,
    [RA.DELETE.BYTE]: (msg, event, isAck) => `R${y}${isAck? A : '' }D${y}${msg.name}${x}`,
    [RA.DELETED.BYTE]: (msg, event) => `R${y}A${y}D${y}${msg.name}${x}`,
    [RA.SUBSCRIBECREATEANDREAD.BYTE]: (msg, event) => `R${y}CR${y}${msg.name}${x}`,
    [RA.UNSUBSCRIBE.BYTE]: (msg, event, isAck) => `R${y}${isAck? A : '' }US${y}${msg.name}${x}`,
    [RA.WRITE_ACKNOWLEDGEMENT.BYTE]: (msg, event, isAck) => `R${y}WA${y}${msg.name}${y}${JSON.stringify(msg.parsedData[0])}${y}${typed(msg.parsedData[1])}${x}`,
    
    [RA.LISTEN.BYTE]: listen,
    [RA.UNLISTEN.BYTE]: unlisten,
    [RA.LISTEN_ACCEPT.BYTE]: listenAccept,
    [RA.LISTEN_REJECT.BYTE]: listenReject,
    [RA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE]: subscriptionForPatternFound,
    [RA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE]: subscriptionForPatternRemoved,
    [RA.SUBSCRIPTION_HAS_PROVIDER.BYTE]: msg => `R${y}SH${y}${msg.name}${y}T${x}`,
    [RA.SUBSCRIPTION_HAS_NO_PROVIDER.BYTE]: msg => `R${y}SH${y}${msg.name}${y}F${x}`,
    
    [RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE]: msg => `R${y}E${y}STORAGE_RETRIEVAL_TIMEOUT${y}${msg.name}${x}`,
    [RA.CACHE_RETRIEVAL_TIMEOUT.BYTE]: msg => `R${y}E${y}CACHE_RETRIEVAL_TIMEOUT${y}${msg.name}${x}`,
    [RA.VERSION_EXISTS.BYTE]: msg => `R${y}E${y}VERSION_EXISTS${y}${msg.name}${y}${msg.version}${y}${msg.data}${msg.isWriteAck? WA : ''}${x}`,
    [RA.RECORD_NOT_FOUND.BYTE]: msg => `R${y}E${y}SN${y}${msg.name}${y}RECORD_NOT_FOUND${x}`,
    
    [RA.MESSAGE_DENIED.BYTE]: messageDenied,
    [RA.NOT_SUBSCRIBED.BYTE]: notSubscribed,
    
    [RA.HAS.BYTE]: msg => `R${y}H${y}${msg.name}${x}`,
    [RA.HAS_RESPONSE.BYTE]: msg => `R${y}H${y}${msg.name}${y}${msg.parsedData ? 'T' : 'F' }${x}`,
  },
  [TOPIC.RPC.BYTE]: {
    [PA.ERROR.BYTE]: genericError,
    [PA.PROVIDE.BYTE]: (msg, event, isAck) => `P${y}${isAck? A : '' }S${y}${msg.name}${x}`,
    [PA.UNPROVIDE.BYTE]: (msg, event, isAck) => `P${y}${isAck? A : '' }US${y}${msg.name}${x}`,
    [PA.REQUEST.BYTE]: msg => `P${y}REQ${y}${msg.name}${y}${msg.correlationId}${y}${msg.data}${x}`,
    [PA.RESPONSE.BYTE]: msg => `P${y}RES${y}${msg.name}${y}${msg.correlationId}${y}${msg.data}${x}`,
    [PA.REQUEST_ERROR.BYTE]: msg => `P${y}E${y}${msg.data}${y}${msg.name}${y}${msg.correlationId}${x}`,
    [PA.REJECT.BYTE]: msg => `P${y}REJ${y}${msg.name}${y}${msg.correlationId}${x}`,
    [PA.ACCEPT.BYTE]: msg => `P${y}A${y}REQ${y}${msg.name}${y}${msg.correlationId}${x}`,
    [PA.NO_RPC_PROVIDER.BYTE]: msg => `P${y}E${y}NO_RPC_PROVIDER${y}${msg.name}${y}${msg.correlationId}${x}`,
    [PA.INVALID_RPC_CORRELATION_ID.BYTE]: msg => `P${y}E${y}REQ${y}${msg.name}${y}${msg.correlationId}${x}`,
    [PA.RESPONSE_TIMEOUT.BYTE]: msg => `P${y}E${y}RESPONSE_TIMEOUT${y}${msg.name}${y}${msg.correlationId}${x}`,
    [PA.MULTIPLE_RESPONSE.BYTE]: msg => `P${y}E${y}MULTIPLE_RESPONSE${y}${msg.name}${y}${msg.correlationId}${x}`,

    [PA.MESSAGE_DENIED.BYTE]: messageDenied,
    [PA.NOT_SUBSCRIBED.BYTE]: notSubscribed
  },
  [TOPIC.PRESENCE.BYTE]: {
    [UA.ERROR.BYTE]: genericError,
    [UA.SUBSCRIBE.BYTE]: (msg, event, isAck) => `U${y}${isAck? A : '' }S${y}${msg.data ? msg.data : msg.name }${x}`,
    [UA.UNSUBSCRIBE.BYTE]: (msg, event, isAck)  => `U${y}${isAck? A : '' }US${y}${msg.data ? msg.data : msg.name }${x}`,
    [UA.QUERY.BYTE]: msg => `U${y}Q${y}${msg.correlationId}${y}${msg.data}${x}`,
    [UA.QUERY_RESPONSE.BYTE]: msg => `U${y}Q${y}${msg.correlationId}${y}${msg.data}${x}`,
    [UA.QUERY_ALL.BYTE]: msg => `U${y}Q${y}Q${x}`,
    [UA.QUERY_ALL_RESPONSE.BYTE]: msg => `U${y}Q${msg.parsedData.length > 0 ? y + msg.parsedData.join(y) : '' }${x}`,
    [UA.PRESENCE_JOIN.BYTE]: msg => `U${y}PNJ${y}${msg.name}${x}`,
    [UA.PRESENCE_LEAVE.BYTE]: msg => `U${y}PNL${y}${msg.name}${x}`,

    [UA.MESSAGE_DENIED.BYTE]: messageDenied,
    [UA.NOT_SUBSCRIBED.BYTE]: notSubscribed
  },
}

/**
 * Creates a deepstream message string, based on the
 * provided parameters
 */
export const getMessage = (message, isAck):string => {
  if (!BUILDERS[message.topic] || !BUILDERS[message.topic][message.action]) {
    console.log(message, isAck)
  }
  const builder = BUILDERS[message.topic][message.action]
  if (!builder) {
    console.error('missing builder for', message)
    return ''
  } else {
    if (message.parsedData && message.data === undefined) {
      if (
        message.dataEncoding === PAYLOAD_ENCODING.JSON ||
        ABP[message.topic][message.action] === PAYLOAD_ENCODING.JSON
      ) {
        message.data = JSON.stringify(message.parsedData)
      } else {
        message.data = typed(message.parsedData)
      }
    }
    return builder(message, null, isAck)
  }
}

/**
 * Creates a deepstream error message string based on the provided
 * arguments
 */
export const getErrorMessage = function (message, errorAction, errorMessage) {
  if (!BUILDERS[message.topic] || !BUILDERS[message.topic][errorAction]) {
    console.log(message, errorAction, errorMessage)
  }
  const builder = BUILDERS[message.topic][errorAction]
  if (message.parsedData && message.data === undefined) {
    if (message.dataEncoding === PAYLOAD_ENCODING.JSON) {
      message.data = JSON.stringify(message.parsedData)
    } else if (message.dataEncoding === PAYLOAD_ENCODING.DEEPSTREAM) {
      message.data = typed(message.parsedData)
    }
  }
  return builder(message, errorAction, errorMessage)
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
