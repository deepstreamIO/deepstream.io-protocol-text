import { 
  TOPIC, 
  PARSER_ACTIONS as XA, 
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
  TOPIC_BYTE_TO_TEXT as TBT,
  TOPIC_TEXT_TO_BYTE,
  ACTIONS_TEXT_TO_BYTE
} from './constants'

function _ (message) {
  return message
    .replace(/\|/g, String.fromCharCode(31))
    .replace(/\+/g, String.fromCharCode(30))
}

function m (data) {
  data.message = Object.assign({
    isAck: false,
    isError: false
  }, data.message)
  data.text = Object.assign({
    build: true,
    parse: true
  }, data.text)
  return data
}

function extendWithGenericMessages (topic, actions, messages) {
  Object.assign(messages, {
    ERROR: m({
      text: { 
        parse: false, 
        value: _(`${TBT[topic]}|E|RANDOM_ERROR+`) 
      },
      message: {
        isAck: false,
        isError: true,
        topic: topic,
        action: UA.ERROR.BYTE,
        data: 'RANDOM_ERROR'
      }
    }),
    INVALID_MESSAGE_DATA: m({
      text: { 
        parse: false, 
        value: _(`${TBT[topic]}|E|INVALID_MESSAGE_DATA|name|[invalid+`) 
      },
      message: {
        isAck: false,
        isError: true,
        topic: topic,
        action: UA.INVALID_MESSAGE_DATA.BYTE,
        name: 'name',
        data: '[invalid'
      }
    }),
  })
}

function extendWithPermissionErrorMessages (topic, actions, messages) {
  Object.assign(messages, {
    MESSAGE_PERMISSION_ERROR: m({
      text: { 
        parse: false, 
        value: _(`${TBT[topic]}|E|MESSAGE_PERMISSION_ERROR|username+`) 
      },
      message: {
        isAck: false,
        isError: true,
        topic: topic,
        action: UA.MESSAGE_PERMISSION_ERROR.BYTE,
        name: 'username'
      }
    }),
    MESSAGE_DENIED: m({
      text: {
        parse: false,
        value: _(`${TBT[topic]}|E|MESSAGE_DENIED|username+`)
      },
      message: {
        isAck: false,
        isError: true,
        topic: topic,
        action: UA.MESSAGE_DENIED.BYTE,
        name: 'username'
      }
    }),
  })
}

function extendWithSubscriptionMessages (topic, actions, messages) {
    Object.assign(messages, {
  SUBSCRIBE: m({
    text: { value: _(`${TBT[topic]}|S|subscription+`) },
    message: {
      topic,
      action: actions.SUBSCRIBE.BYTE,
      name: 'subscription'
    }
  }),
  SUBSCRIBE_ACK: m({
    text: { value: _(`${TBT[topic]}|A|S|subscription+`) },
    message: {
      isAck: true,
      topic,
      action: actions.SUBSCRIBE.BYTE,
      name: 'subscription'
    }
  }),
  UNSUBSCRIBE: m({
    text: { value: _(`${TBT[topic]}|US|subscription+`) },
    message: {
      topic,
      action: actions.UNSUBSCRIBE.BYTE,
      name: 'subscription'
    }
  }),
  UNSUBSCRIBE_ACK: m({
    text: { value: _(`${TBT[topic]}|A|US|subscription+`) },
    message: {
      isAck: true,
      topic,
      action: actions.UNSUBSCRIBE.BYTE,
      name: 'subscription'
    }
  }),
    MULTIPLE_SUBSCRIPTIONS: m({
      text: { parse: false, value: _(`${TBT[topic]}|E|MULTIPLE_SUBSCRIPTIONS|username+`) },
      message: {
        isAck: false,
        isError: true,
        topic: topic,
        action: UA.MULTIPLE_SUBSCRIPTIONS.BYTE,
        name: 'username'
      }
    }),
    NOT_SUBSCRIBED: m({
      text: { parse: false, value: _(`${TBT[topic]}|E|NOT_SUBSCRIBED|username+`) },
      message: {
        isAck: false,
        isError: true,
        topic: topic,
        action: UA.NOT_SUBSCRIBED.BYTE,
        name: 'username'
      }
    })
  })
}

function extendWithListenMessages (topic, actions, messages) {
  Object.assign(messages, {
    LISTEN: m({
    text: { value: _(`${TBT[topic]}|L|.*+`) },
    message: {
      topic,
      action: actions.LISTEN.BYTE,
      name: '.*'
    }
  }),
  LISTEN_ACK: m({
    text: { value: _(`${TBT[topic]}|A|L|.*+`) },
    message: {
      isAck: true,
      topic,
      action: actions.LISTEN.BYTE,
      name: '.*'
    }
  }),
  UNLISTEN: m({
    text: { value: _(`${TBT[topic]}|UL|.*+`) },
    message: {
      topic,
      action: actions.UNLISTEN.BYTE,
      name: '.*'
    }
  }),
  UNLISTEN_ACK: m({
    text: { value: _(`${TBT[topic]}|A|UL|.*+`) },
    message: {
      isAck: true,
      topic,
      action: actions.UNLISTEN.BYTE,
      name: '.*'
    }
  }),
  SUBSCRIPTION_FOR_PATTERN_FOUND: m({
    text: { value: _(`${TBT[topic]}|SP|.*|someSubscription+`) },
    message: {
      topic,
      action: actions.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  }),
  SUBSCRIPTION_FOR_PATTERN_REMOVED: m({
    text: { value: _(`${TBT[topic]}|SR|.*|someSubscription+`) },
    message: {
      topic,
      action: actions.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  }),
  LISTEN_ACCEPT: m({
    text: { value: _(`${TBT[topic]}|SR|.*|someSubscription+`) },
    message: {
      topic,
      action: actions.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  }),
    LISTEN_REJECT: m({
    text: { value: _(`${TBT[topic]}|SR|.*|someSubscription+`) },
    message: {
      topic,
      action: actions.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
      name: '.*',
      subscription: 'someSubscription'
    }
  })
  })
}

export const PARSER_MESSAGES = {
  UNKNOWN_TOPIC: {
    text: { value: _('X|F|UNKNOWN_TOPIC|topic+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.UNKNOWN_TOPIC.BYTE,
      data: 'topic'
    }
  },
  UNKNOWN_ACTION: {
    text: { value: _('X|E|UNKNOWN_ACTION|action+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.UNKNOWN_TOPIC.BYTE,
      data: 'action'
    }
  },
  INVALID_MESSAGE: {
    text: { parse: false, value: _('X|E|INVALID_MESSAGE|action+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.INVALID_MESSAGE.BYTE,
      data: 'action'
    }
  },
  MESSAGE_PARSE_ERROR: {
    text: { parse: false, value: _('X|E|MESSAGE_PARSE_ERROR+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.MESSAGE_PARSE_ERROR.BYTE
    }
  },
  MAXIMUM_MESSAGE_SIZE_EXCEEDED: {
    text: { parse: false, value: _('X|E|MAXIMUM_MESSAGE_SIZE_EXCEEDED+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.MAXIMUM_MESSAGE_SIZE_EXCEEDED.BYTE
    }
  }
}

export const CONNECTION_MESSAGES = {
  ERROR: m({
    text: { value: _('C|PI+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PING.BYTE
    }
  }),
  PING: m({
    text: { value: _('C|PI+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PING.BYTE
    }
  }),
  PONG: m({
    text: { value: _('C|PO+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PONG.BYTE
    }
  }),
  CHALLENGE: m({
    text: { value: _('C|CH+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CHALLENGE.BYTE
    }
  }),
  CHALLENGE_RESPONSE: m({
    text: { value: _('C|CHR|url+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CHALLENGE_RESPONSE.BYTE,
      data: 'url',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  }),
  ACCEPT: m({
    text: { value: _('C|A+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.ACCEPT.BYTE
    }
  }),
  REJECTION: m({
    text: { value: _('C|REJ|reason+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.REJECTION.BYTE,
      data: 'reason',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  }),
  REDIRECT: m({
    text: { value: _('C|RED|url+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.REDIRECT.BYTE,
      data: 'url',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  }),
  CONNECTION_AUTHENTICATION_TIMEOUT: {

  }
}

export const AUTH_MESSAGES = {
  REQUEST: m({
    text: { value: _('A|REQ|loginData+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.REQUEST.BYTE,
      data: 'loginData',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  }),
  AUTH_SUCCESSFUL: m({
    text: { value: _('A|A|clientData+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.AUTH_SUCCESSFUL.BYTE,
      data: 'clientData',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  }),
  AUTH_UNSUCCESSFUL: m({
    text: { value: _('A|E|INVALID_AUTH_DATA|errorMessage+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.AUTH_UNSUCCESSFUL.BYTE,
      data: 'errorMessage',
      dataEncoding: PAYLOAD_ENCODING.JSON
    }
  }),
  TOO_MANY_AUTH_ATTEMPTS: m({
    text: { value: _('A|E|TOO_MANY_AUTH_ATTEMPTS+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.TOO_MANY_AUTH_ATTEMPTS.BYTE
    }
  }),
  MESSAGE_PERMISSION_ERROR: {},
  MESSAGE_DENIED: {}
}
extendWithGenericMessages(TOPIC.AUTH.BYTE, AA, AUTH_MESSAGES)

export const RECORD_MESSAGES = {
  HEAD: m({
    text: { value: _('R|HD|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.HEAD.BYTE,
      name: 'user/someId'
    }
  }),
  HEAD_RESPONSE: m({
    text: { parse: false, value: _('R|HD|user/someId|12+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.HEAD_RESPONSE.BYTE,
      name: 'user/someId',
      data: '12'
    }
  }),
  READ: m({
    text: { value: _('R|R|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ.BYTE,
      name: 'user/someId'
    }
  }),
  READ_RESPONSE: m({
    text: { parse: false, value: _('R|R|user/someId|1|{"firstname":"Wolfram"}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ_RESPONSE.BYTE,
      name: 'user/someId',
      data: '{"firstname":"Wolfram"}',
      version: 1
    }
  }),
  UPDATE: m({
    text: { parse: false, value: _('R|U|user/someId|1|{"firstname":"Wolfram"}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"firstname":"Wolfram"}',
      isWriteAck: false
    }
  }),
  UPDATE_WITH_WRITE_ACK: m({
    text: { value: _('R|U|user/someId|1|{"firstname":"Wolfram"}|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"firstname":"Wolfram"}',
      isWriteAck: true
    }
  }),
  PATCH: m({
    text: { value: _('R|P|user/someId|1|path|Sdata+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      data: 'Sdata',
      isWriteAck: false
    }
  }),
  PATCH_WITH_WRITE_ACK: m({
    text: { value: _('R|P|user/someId|1|path|Sdata|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      data: 'Sdata',
      isWriteAck: true
    }
  }),
  ERASE: m({
    text: { parse: false, value: _('R|P|user/someId|1|path|U+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.ERASE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      isWriteAck: false
    }
  }),
  ERASE_WITH_WRITE_ACK: m({
    text: { parse: false, value: _('R|P|user/someId|1|path|U|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.ERASE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      path: 'path',
      version: 1,
      isWriteAck: true
    }
  }),
  CREATEANDUPDATE:m({
    text: { value: _('R|CU|user/someId|1|{"name":"bob"}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDUPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"name":"bob"}',
      isWriteAck: false
    }    
  }),
  CREATEANDUPDATE_WITH_WRITE_ACK:m({
    text: { value: _('R|CU|user/someId|1|{"name":"bob"}|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDUPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"name":"bob"}',
      isWriteAck: true
    }    
  }),
  CREATEANDPATCH:m({
    text: { value: _('R|CU|user/someId|1|path|Sdata+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDPATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      version: 1,
      path: 'path',
      data: 'Sdata',
      isWriteAck: false
    }    
  }),
  CREATEANDPATCH_WITH_WRITE_ACK:m({
    text: { value: _('R|CU|user/someId|1|path|Sdata|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDPATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      version: 1,
      path: 'path',
      data: 'Sdata',
      isWriteAck: true
    }    
  }),
  DELETE : m({
    text: { value: _('R|D|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId'
    }
  }),
  DELETE_ACK : m({
    text: { value: _('R|A|D|user/someId+') },
    message: {
      isAck: true,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId'
    }
  }),
  DELETED : m({
    text: { parse: false, value: _('R|A|D|user/someId+') },
    message: {
      isAck: true,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETED.BYTE,
      name: 'user/someId'
    }
  }),
  SUBSCRIBECREATEANDREAD:m({
    text: { value: _('R|CR|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIBECREATEANDREAD.BYTE,
      name: 'user/someId' 
    }    
  }),
  SUBSCRIPTION_HAS_PROVIDER: m({
    text: { value: _('R|SH|someSubscription|T+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_HAS_PROVIDER.BYTE,
      name: 'someSubscription'
    }
  }),
  SUBSCRIPTION_HAS_NO_PROVIDER: m({
    text: { value: _('R|SH|someSubscription|F+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_HAS_NO_PROVIDER.BYTE,
      name: 'someSubscription'
    }
  }),
  WRITE_ACKNOWLEDGEMENT: m({
    text: { parse: false, value: _('R|WA|someSubscription|[-1]|L+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.WRITE_ACKNOWLEDGEMENT.BYTE,
      name: 'someSubscription',
      parsedData: [ [-1], null ]
    }
  }),
  VERSION_EXISTS: m({
    text: { value: _('R|E|VERSION_EXISTS|recordName|1|{}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.VERSION_EXISTS.BYTE,
      name: 'recordName',
      data: '{}',
      version: 1,
      isWriteAck: false
    }
  }),
  CACHE_RETRIEVAL_TIMEOUT: m({
    text: { value: _('R|E|CACHE_RETRIEVAL_TIMEOUT|recordName+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CACHE_RETRIEVAL_TIMEOUT.BYTE,
      name: 'recordName'
    }
  }),
  STORAGE_RETRIEVAL_TIMEOUT: m({
    text: { value: _('R|E|STORAGE_RETRIEVAL_TIMEOUT|recordName+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE,
      name: 'recordName'
    }
  }),
  RECORD_LOAD_ERROR: {},
  RECORD_CREATE_ERROR: {},
  RECORD_UPDATE_ERROR: {},
  RECORD_DELETE_ERROR: {},
  RECORD_READ_ERROR: {},
  RECORD_NOT_FOUND: {},
  INVALID_VERSION: {},  
  INVALID_PATCH_ON_HOTPATH: {},
  CREATE: {},
  SUBSCRIBEANDHEAD: {},
  SUBSCRIBEANDREAD: {},
  SUBSCRIBECREATEANDUPDATE: {},
  HAS: {},
  HAS_RESPONSE: {}
}  
extendWithGenericMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)
extendWithSubscriptionMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)
extendWithListenMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)

export const RPC_MESSAGES = {
  REQUEST_ERROR: m({
    text: { value: _('P|E|ERROR_MESSAGE|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.REQUEST_ERROR.BYTE,
      name: 'addValues',
      correlationId: '1234',
      data: 'ERROR_MESSAGE'
    }
  }),
  REQUEST: m({
    text: { value: _('P|REQ|addValues|1234|{"val1":1,"val2":2}+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.REQUEST.BYTE,
      name: 'addValues',
      correlationId: '1234',
      data: '{"val1":1,"val2":2}'      
    }
  }),
  ACCEPT: m({
    text: { value: _('P|A|REQ|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.ACCEPT.BYTE,
      name: 'addValues',
      correlationId: '1234'
    }
  }),
  REJECT: m({
    text: { value: _('P|REJ|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.REJECT.BYTE,
      name: 'addValues',
      correlationId: '1234'   
    }
  }),
  RESPONSE: m({
    text: { value: _('P|RES|addValues|1234|{"val1":1,"val2":2}+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.RESPONSE.BYTE,
      name: 'addValues',
      correlationId: '1234',
      data: '{"val1":1,"val2":2}'
    }
  }), 
  PROVIDE: m({
    text: { value: _('P|S|addValues+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues'
    }
  }),
  PROVIDE_ACK: m({
    text: { value: _('P|A|S|addValues+') },
    message: {
      isAck: true,
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues'
    }
  }), 
  UNPROVIDE: m({
    text: { value: _('P|US|addValues+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues'
    }
  }),
  UNPROVIDE_ACK: m({
    text: { value: _('P|A|US|addValues+') },
    message: {
      isAck: true,
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues'
    }
  }),
  MULTIPLE_PROVIDERS: {},
  NOT_PROVIDED: {},
  MULTIPLE_RESPONSE: m({
    text: { parse: false, value: _('P|E|MULTIPLE_RESPONSE|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.MULTIPLE_RESPONSE.BYTE,
      name: 'addValues',
      correlationId: 1234
    }
  }),
  RESPONSE_TIMEOUT: m({
    text: { parse: false, value: _('P|E|RESPONSE_TIMEOUT|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.RESPONSE_TIMEOUT.BYTE,
      name: 'addValues',
      correlationId: 1234
    }
  }),
  INVALID_RPC_CORRELATION_ID: m({
    text: { parse: false, value: _('P|E|INVALID_RPC_CORRELATION_ID|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.INVALID_RPC_CORRELATION_ID.BYTE,
      name: 'addValues',
      correlationId: 1234
    }
  }),
  MULTIPLE_ACCEPT: m({
    text: { parse: false, value: _('P|E|MULTIPLE_ACCEPT|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.MULTIPLE_ACCEPT.BYTE,
      name: 'addValues',
      correlationId: 1234
    }
  }),
  ACCEPT_TIMEOUT: m({
    text: { parse: false, value: _('P|E|MULTIPLE_ACCEPT|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.ACCEPT_TIMEOUT.BYTE,
      name: 'addValues',
      correlationId: 1234
    }
  }),
  NO_RPC_PROVIDER: m({
    text: { parse: false, value: _('P|E|NO_RPC_PROVIDER|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.NO_RPC_PROVIDER.BYTE,
      name: 'addValues',
      correlationId: 1234
    }
  })
}
extendWithGenericMessages(TOPIC.RPC.BYTE, PA, RPC_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.RPC.BYTE, PA, RPC_MESSAGES)

export const EVENT_MESSAGES = {

  EMIT: m({
    text: { value: _('E|EVT|someEvent|Sdata+') },
    message: {
      topic: TOPIC.EVENT.BYTE,
      action: EA.EMIT.BYTE,
      name: 'someEvent',
      data: 'Sdata',
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM
    }
  })
}
extendWithGenericMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)
extendWithSubscriptionMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)
extendWithListenMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)

export const PRESENCE_MESSAGES = {
   SUBSCRIBE: m({
    text: { value: _('U|S|["alan","john"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: UA.SUBSCRIBE.BYTE.toString(),
      data: '["alan","john"]'
    }
  }),
  SUBSCRIBE_ACK: m({
    text: { value: _('U|A|S|alan+') },
    message: {
      isAck: true,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: 'alan'
    }
  }),
  UNSUBSCRIBE: m({
    text: { value: _('U|US|["alan","john"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: UA.UNSUBSCRIBE.BYTE.toString(),
      data: '["alan","john"]'
    }
  }),
  UNSUBSCRIBE_ACK: m({
    text: { value: _('U|A|US|alan+') },
    message: {
      isAck: true,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: 'alan'
    }
  }),
  MULTIPLE_SUBSCRIPTIONS: {},
  NOT_SUBSCRIBED: {},
  QUERY_ALL: m({
    text: { parse: false, value: _('U|Q|Q+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL.BYTE,
      name: UA.QUERY_ALL.BYTE.toString()
    }
  }),
  QUERY_ALL_RESPONSE: m({
    text: { parse: false, value: _('U|Q|["alan","sarah"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL_RESPONSE.BYTE,
      name: UA.QUERY_ALL_RESPONSE.BYTE,
      data: '["alan","sarah"]'
    }
  }),
  QUERY: m({
    text: { value: _('U|Q|1234|["alan"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY.BYTE,
      name: UA.QUERY.BYTE,
      correlationId: '1234',
      data: '["alan"]'
    }
  }),
  QUERY_RESPONSE: m({
    text: { parse: false, value: _('U|Q|1234|{"alan":true}+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_RESPONSE.BYTE,
      name: UA.QUERY_RESPONSE.BYTE,
      correlationId: '1234',
      data: '{"alan":true}'
    }
  }),
  PRESENCE_JOIN: m({
    text: { value: _('U|PNJ|username+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_JOIN.BYTE,
      name: 'username'
    }
  }),
  PRESENCE_LEAVE: m({
    text: { value: _('U|PNL|username+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_LEAVE.BYTE,
      name: 'username'
    }
  }),
  INVALID_PRESENCE_USERS: m({
    text: { 
      parse: false,
      value: _('U|E|INVALID_PRESENCE_USERS|username+') 
    },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.INVALID_PRESENCE_USERS.BYTE,
      name: 'username'
    }
  })
}
extendWithGenericMessages(TOPIC.PRESENCE.BYTE, UA, PRESENCE_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.PRESENCE.BYTE, UA, PRESENCE_MESSAGES)

export const MESSAGES = {
  [TOPIC.PARSER.BYTE]: PARSER_MESSAGES,
  [TOPIC.RECORD.BYTE]: RECORD_MESSAGES,
  [TOPIC.RPC.BYTE]: RPC_MESSAGES,
  [TOPIC.EVENT.BYTE]: EVENT_MESSAGES,
  [TOPIC.AUTH.BYTE]: AUTH_MESSAGES,
  [TOPIC.CONNECTION.BYTE]: CONNECTION_MESSAGES,
  [TOPIC.PRESENCE.BYTE]: PRESENCE_MESSAGES
}