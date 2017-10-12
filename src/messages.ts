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

function _ (message) {
  return message
    .replace(/\|/g, String.fromCharCode(31))
    .replace(/\+/g, String.fromCharCode(30))
}

export const CONNECTION_MESSAGES = {
  PING: {
    buildText: true,
    parseText: true,
    text: _('C|PI+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PING.BYTE
    }
  },
  PONG: {
    buildText: true,
    parseText: true,
    text: _('C|PO+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PONG.BYTE
    }
  },
  CHALLENGE: {
    buildText: true,
    parseText: true,
    text: _('C|CH+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CHALLENGE.BYTE
    }
  },
  CHALLENGE_RESPONSE: {
    buildText: true,
    parseText: true,
    text: _('C|CHR|url+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CHALLENGE_RESPONSE.BYTE,
      data: 'url',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  },
  ACCEPT: {
    buildText: true,
    parseText: true,
    text: _('C|A+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.ACCEPT.BYTE
    }
  },
  REJECTION: {
    buildText: true,
    parseText: true,
    text: _('C|REJ|reason+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.REJECTION.BYTE,
      data: 'reason',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  },
  REDIRECT: {
    buildText: true,
    parseText: true,
    text: _('C|RED|url+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.REDIRECT.BYTE,
      data: 'url',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  },
}

export const AUTH_MESSAGES = {
  REQUEST: {
    buildText: true,
    parseText: true,
    text: _('A|REQ|loginData+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.AUTH.BYTE,
      action: AA.REQUEST.BYTE,
      data: 'loginData',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  },
  AUTH_SUCCESFUL: {
    buildText: true,
    parseText: true,
    text: _('A|A|clientData+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.AUTH.BYTE,
      action: AA.AUTH_SUCCESFUL.BYTE,
      data: 'clientData',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  },
  INVALID_AUTH_DATA: {
    buildText: true,
    parseText: true,
    text: _('A|E|INVALID_AUTH_DATA|errorMessage+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.AUTH.BYTE,
      action: AA.INVALID_AUTH_DATA.BYTE,
      data: 'errorMessage',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  },
  TOO_MANY_AUTH_ATTEMPTS: {
    buildText: true,
    parseText: true,
    text: _('A|E|TOO_MANY_AUTH_ATTEMPTS+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.AUTH.BYTE,
      action: AA.TOO_MANY_AUTH_ATTEMPTS.BYTE
    }
  },
}

// SUBSCRIBEANDREAD
// SUBSCRIBEANDREAD_RESPONSE
// SUBSCRIBEANDHEAD
// SUBSCRIBEANDHEAD_RESPONSE

// WRITE_ACKNOWLEDGEMENT
// VERSION_EXISTS
// CACHE_RETRIEVAL_TIMEOUT
// STORAGE_RETRIEVAL_TIMEOUT
// ERROR

export const RECORD_MESSAGES = {
  HEAD: {
    buildText: true,
    parseText: true,
    text: _('R|HD|user/someId+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.HEAD.BYTE,
      name: 'user/someId'
    }
  },
  HEAD_RESPONSE: {
    buildText: true,
    parseText: false,
    text: _('R|HD|user/someId|12+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.HEAD_RESPONSE.BYTE,
      name: 'user/someId',
      data: '12'
    }
  },
  READ: {
    buildText: true,
    parseText: true,
    text: _('R|R|user/someId+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ.BYTE,
      name: 'user/someId'
    }
  },
  READ_RESPONSE: {
    buildText: true,
    parseText: false,
    text: _('R|R|user/someId|1|{"firstname":"Wolfram"}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ_RESPONSE.BYTE,
      name: 'user/someId',
      data: '{"firstname":"Wolfram"}',
      version: 1
    }
  },
  UPDATE: {
    buildText: true,
    parseText: true,
    text: _('R|U|user/someId|1|{"firstname":"Wolfram"}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"firstname":"Wolfram"}',
      isWriteAck: false
    }
  },
  UPDATE_WITH_WRITE_ACK: {
    buildText: true,
    parseText: true,
    text: _('R|U|user/someId|1|{"firstname":"Wolfram"}|{"writeSuccess":true}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"firstname":"Wolfram"}',
      isWriteAck: true
    }
  },
  PATCH: {
    buildText: true,
    parseText: true,
    text: _('R|P|user/someId|1|path|Sdata+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      data: 'Sdata',
      isWriteAck: false
    }
  },
  PATCH_WITH_WRITE_ACK: {
    buildText: true,
    parseText: true,
    text: _('R|P|user/someId|1|path|Sdata|{"writeSuccess":true}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      data: 'Sdata',
      isWriteAck: true
    }
  },
  ERASE: {
    buildText: true,
    parseText: false,
    text: _('R|P|user/someId|1|path|U+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.ERASE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      isWriteAck: false
    }
  },
  ERASE_WITH_WRITE_ACK: {
    buildText: true,
    parseText: false,
    text: _('R|P|user/someId|1|path|U{_}{"writeSuccess":true}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.ERASE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      isWriteAck: true
    }
  },
  CREATEANDUPDATE:{
    buildText: true,
    parseText: true,
    text: _('R|CU|user/someId|1|{"name":"bob"}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDUPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"name":"bob"}',
      isWriteAck: false
    }    
  },
  CREATEANDUPDATE_WITH_WRITE_ACK:{
    buildText: true,
    parseText: true,
    text: _('R|CU|user/someId|1|{"name":"bob"}|{"writeSuccess":true}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDUPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"name":"bob"}',
      isWriteAck: true
    }    
  },
  CREATEANDPATCH:{
    buildText: true,
    parseText: true,
    text: _('R|CU|user/someId|1|path|Sdata+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDPATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      version: 1,
      path: 'path',
      data: 'Sdata',
      isWriteAck: false
    }    
  },
  CREATEANDPATCH_WITH_WRITE_ACK:{
    buildText: true,
    parseText: true,
    text: _('R|CU|user/someId|1|path|Sdata|{"writeSuccess":true}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDPATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      version: 1,
      path: 'path',
      data: 'Sdata',
      isWriteAck: true
    }    
  },
  DELETE : {
    buildText: true,
    parseText: true,
    text: _('R|D|user/someId+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId'
    }
  },
  DELETE_ACK : {
    buildText: true,
    parseText: true,
    text: _('R|A|D|user/someId+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId'
    }
  },
  DELETED : {
    buildText: true,
    parseText: false,
    text: _('R|A|D|user/someId+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETED.BYTE,
      name: 'user/someId'
    }
  },
  SUBSCRIBECREATEANDREAD:{
    buildText: true,
    parseText: true,
    text: _('R|CR|user/someId+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIBECREATEANDREAD.BYTE,
      name: 'user/someId' 
    }    
  },
  UNSUBSCRIBE: {
    buildText: true,
    parseText: true,
    text: _('R|US|user/someId+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UNSUBSCRIBE.BYTE,
      name: 'user/someId'
    }
  },
  UNSUBSCRIBE_ACK: {
    buildText: true,
    parseText: true,
    text: _('R|A|US|user/someId+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UNSUBSCRIBE.BYTE,
      name: 'user/someId'
    }
  },
  LISTEN: {
    buildText: true,
    parseText: true,
    text: _('R|L|.*+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.LISTEN.BYTE,
      name: '.*'
    }
  },
  LISTEN_ACK: {
    buildText: true,
    parseText: true,
    text: _('R|A|L|.*+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.LISTEN.BYTE,
      name: '.*'
    }
  },
  UNLISTEN: {
    buildText: true,
    parseText: true,
    text: _('R|UL|.*+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UNLISTEN.BYTE,
      name: '.*'
    }
  },
  UNLISTEN_ACK: {
    buildText: true,
    parseText: true,
    text: _('R|A|UL|.*+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UNLISTEN.BYTE,
      name: '.*'
    }
  },
  SUBSCRIPTION_FOR_PATTERN_FOUND: {
    buildText: true,
    parseText: true,
    text: _('R|SP|.*|someSubscription+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  },
  SUBSCRIPTION_FOR_PATTERN_REMOVED: {
    buildText: true,
    parseText: true,
    text: _('R|SR|.*|someSubscription+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  },
  SUBSCRIPTION_HAS_PROVIDER: {
    buildText: true,
    parseText: true,
    text: _('R|SH|someSubscription|T+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_HAS_PROVIDER.BYTE,
      name: 'someSubscription'
    }
  },
  SUBSCRIPTION_HAS_NO_PROVIDER: {
    buildText: true,
    parseText: true,
    text: _('R|SH|someSubscription|F+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_HAS_NO_PROVIDER.BYTE,
      name: 'someSubscription'
    }
  },
  WRITE_ACKNOWLEDGEMENT: {
    buildText: true,
    parseText: true,
    text: _('R|WA|someSubscription|[-1]|N+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.WRITE_ACKNOWLEDGEMENT.BYTE,
      name: 'someSubscription'
    }
  },
  VERSION_EXISTS: {
    buildText: true,
    parseText: true,
    text: _('R|E|VERSION_EXISTS|recordName|1|{}|config+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.VERSION_EXISTS.BYTE,
      name: 'recordName'
    }
  },
  CACHE_RETRIEVAL_TIMEOUT: {
    buildText: true,
    parseText: true,
    text: _('R|E|CACHE_RETRIEVAL_TIMEOUT|recordName+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.CACHE_RETRIEVAL_TIMEOUT.BYTE,
      name: 'recordName'
    }
  },
  STORAGE_RETRIEVAL_TIMEOUT: {
    buildText: true,
    parseText: true,
    text: _('R|E|STORAGE_RETRIEVAL_TIMEOUT|recordName+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE,
      name: 'recordName'
    }
  }
}  

export const RPC_MESSAGES = {
  REQUEST_ERROR: {
    buildText: true,
    parseText: true,
    text: _('P|E|ERROR_MESSAGE|addValues|1234+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.REQUEST_ERROR.BYTE,
      name: 'addValues',
      correlationId: '1234'
    }
  },
  REQUEST: {
    buildText: true,
    parseText: true,
    text: _('P|REQ|addValues|1234|{"val1":1,"val2":2}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.REQUEST.BYTE,
      name: 'addValues',
      correlationId: '1234',
      data: '{"val1":1,"val2":2}'      
    }
  },
  ACCEPT: {
    buildText: true,
    parseText: true,
    text: _('P|A|REQ|addValues|1234|+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.ACCEPT.BYTE,
      name: 'addValues',
      correlationId: '1234'
    }
  },
  REJECT: {
    buildText: true,
    parseText: true,
    text: _('P|REJ|addValues|1234|+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.REJECT.BYTE,
      name: 'addValues',
      correlationId: '1234'   
    }
  },
  RESPONSE: {
    buildText: true,
    parseText: true,
    text: _('P|RES|addValues|1234|{"val1":1,"val2":2}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.RESPONSE.BYTE,
      name: 'addValues',
      correlationId: '1234',
      data: '{"val1":1,"val2":2}'
    }
  }, 
  PROVIDE: {
    buildText: true,
    parseText: true,
    text: _('P|S|addValues+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues'
    }
  },
  PROVIDE_ACK: {
    buildText: true,
    parseText: true,
    text: _('P|A|S|addValues+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues'
    }
  }, 
  UNPROVIDE: {
    buildText: true,
    parseText: true,
    text: _('P|US|addValues+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues'
    }
  },
  UNPROVIDE_ACK: {
    buildText: true,
    parseText: true,
    text: _('P|A|US|addValues+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues'
    }
  }
}

export const EVENT_MESSAGES = {
  SUBSRIBE: {
    buildText: true,
    parseText: true,
    text: _('E|S|someEvent+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.SUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  SUBSRIBE_ACK: {
    buildText: true,
    parseText: true,
    text: _('E|A|S|someEvent+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.SUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  UNSUBSRIBE: {
    buildText: true,
    parseText: true,
    text: _('E|US|someEvent+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.UNSUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  UNSUBSRIBE_ACK: {
    buildText: true,
    parseText: true,
    text: _('E|A|US|someEvent+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.UNSUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  EMIT: {
    buildText: true,
    parseText: true,
    text: _('E|EVT|someEvent|Sdata+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.EMIT.BYTE,
      name: 'someEvent',
      data: 'Sdata',
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM
    }
  },
  LISTEN: {
    buildText: true,
    parseText: true,
    text: _('E|L|.*+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.LISTEN.BYTE,
      name: '.*'
    }
  },
  LISTEN_ACK: {
    buildText: true,
    parseText: true,
    text: _('E|A|L|.*+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.LISTEN.BYTE,
      name: '.*'
    }
  },
  UNLISTEN: {
    buildText: true,
    parseText: true,
    text: _('E|UL|.*+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.UNLISTEN.BYTE,
      name: '.*'
    }
  },
  UNLISTEN_ACK: {
    buildText: true,
    parseText: true,
    text: _('E|A|UL|.*+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.UNLISTEN.BYTE,
      name: '.*'
    }
  },
  SUBSCRIPTION_FOR_PATTERN_FOUND: {
    buildText: true,
    parseText: true,
    text: _('E|SP|.*|someSubscription+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  },
  SUBSCRIPTION_FOR_PATTERN_REMOVED: {
    buildText: true,
    parseText: true,
    text: _('E|SR|.*|someSubscription+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  }
}

export const PRESENCE_MESSAGES = {
   SUBSRIBE: {
    buildText: true,
    parseText: true,
    text: _('U|S|["alan","john"]+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: UA.SUBSCRIBE.BYTE,
      data: '["alan","john"]'
    }
  },
  SUBSRIBE_ACK: {
    buildText: true,
    parseText: true,
    text: _('U|A|S|alan+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: 'alan'
    }
  },
  UNSUBSRIBE: {
    buildText: true,
    parseText: true,
    text: _('U|US|["alan","john"]+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: UA.UNSUBSCRIBE.BYTE,
      data: '["alan","john"]'
    }
  },
  UNSUBSRIBE_ACK: {
    buildText: true,
    parseText: true,
    text: _('U|A|US|alan+'),
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: 'alan'
    }
  },
  QUERY_ALL: {
    buildText: true,
    parseText: false,
    text: _('U|Q|Q+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL.BYTE,
      name: 'Q'
    }
  },
  QUERY_ALL_RESPONSE: {
    buildText: true,
    parseText: false,
    text: _('U|Q|["alan","sarah"]+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL_RESPONSE.BYTE,
      name: UA.QUERY_ALL_RESPONSE.BYTE,
      data: '["alan", "sarah"]'
    }
  },
  QUERY: {
    buildText: true,
    parseText: true,
    text: _('U|Q|1234|["alan"]+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY.BYTE,
      name: UA.QUERY.BYTE,
      correlationId: '1234',
      data: '["alan"]'
    }
  },
  QUERY_RESPONSE: {
    buildText: true,
    parseText: false,
    text: _('U|Q|1234|{"alan":true}+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_RESPONSE.BYTE,
      name: UA.QUERY_RESPONSE.BYTE,
      correlationId: '1234',
      data: '{ "alan": true }'
    }
  },
  PRESENCE_JOIN: {
    buildText: true,
    parseText: true,
    text: _('U|PNJ|username+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_JOIN.BYTE,
      name: 'username'
    }
  },
  PRESENCE_LEAVE: {
    buildText: true,
    parseText: true,
    text: _('U|PNL|username+'),
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_LEAVE.BYTE,
      name: 'username'
    }
  }
}

export const MESSAGES = {
  RECORD_MESSAGES,
  RPC_MESSAGES,
  EVENT_MESSAGES,
  AUTH_MESSAGES,
  CONNECTION_MESSAGES,
  PRESENCE_MESSAGES
}