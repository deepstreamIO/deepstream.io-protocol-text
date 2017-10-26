/* tslint:disable:no-bitwise */

import {
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
  TOPIC_BYTE_TO_TEXT as TBT,
  TOPIC_TEXT_TO_BYTE,
} from './constants'

import {
  Message
} from '../../../src/constants'

function _ (message) {
  return message
    .replace(/\|/g, String.fromCharCode(31))
    .replace(/\+/g, String.fromCharCode(30))
}

interface MessageSpec {
  text: {
    value: string
    build: boolean
    parse: boolean
  }
  message: Message
  urp: {
    value: Buffer
    args: Array<String>
    payload: string | null
  }
}

function m (data): MessageSpec {
  data.message = Object.assign({
    isAck: false,
    isError: false,
  }, data.message)
  data.text = Object.assign({
    build: true,
    parse: true,
  }, data.text)
  return data
}

function binMsg (
  topicByte: number,
  actionByte: number,
  meta: string | object,
  payload: string | object,
  fin: boolean = true,
): Buffer {
  if (typeof meta === 'object') {
    meta = JSON.stringify(meta)
  }
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload)
  }
  const metaLen = Buffer.byteLength(meta)
  const payloadLen = Buffer.byteLength(payload)
  return Buffer.concat([
    Buffer.from([
      (fin ? 0x80 : 0x00) | topicByte,
      actionByte,
      metaLen >> 16,
      metaLen >> 8,
      metaLen,
      payloadLen >> 16,
      payloadLen >> 8,
      payloadLen,
    ]),
    Buffer.from(meta, 'utf8'),
    Buffer.from(payload, 'utf8'),
  ])
}

function extendWithGenericMessages (topic, actions, messages) {
  Object.assign(messages, {
    ERROR: null,
    INVALID_MESSAGE_DATA: null,
  })
}

function extendWithPermissionErrorMessages (topic, actions, messages: {[key: string]: MessageSpec | null}) {
  Object.assign(messages, {
    MESSAGE_PERMISSION_ERROR: m({
      text: {
        parse: false,
        value: _(`${TBT[topic]}|E|MESSAGE_PERMISSION_ERROR|username+`),
      },
      message: {
        isAck: false,
        isError: true,
        topic,
        action: actions.MESSAGE_PERMISSION_ERROR.BYTE,
        name: 'username',
      },
      urp: {
        value: binMsg(
          topic,
          actions.MESSAGE_PERMISSION_ERROR.BYTE,
          { n: 'username' },
          ''
        ),
        args: ['name'],
        payload: null,
      }
    }),
    MESSAGE_DENIED: m({
      text: {
        parse: false,
        value: _(`${TBT[topic]}|E|MESSAGE_DENIED|username+`),
      },
      message: {
        isAck: false,
        isError: true,
        topic,
        action: actions.MESSAGE_DENIED.BYTE,
        name: 'username',
      },
      urp: {
        value: binMsg(
          topic,
          actions.MESSAGE_DENIED.BYTE,
          { n: 'username' },
          ''
        ),
        args: ['name'],
        payload: null,
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
        name: 'subscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.SUBSCRIBE.BYTE,
          { n: 'subscription' },
          ''
        ),
        args: ['name'],
        payload: null,
        description: 'Sent to subscribe to a given name',
        source: 'client'
      }
    }),
    SUBSCRIBE_ACK: m({
      text: { value: _(`${TBT[topic]}|A|S|subscription+`) },
      message: {
        isAck: true,
        topic,
        action: actions.SUBSCRIBE.BYTE,
        name: 'subscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.SUBSCRIBE_ACK.BYTE,
          { n: 'subscription' },
          ''
        ),
        args: ['name'],
        payload: null,
        description: 'Sent when a \'SUBSCRIBE\' message is permissioned and the subscription registered,',
        source: 'server'
      }
    }),
    UNSUBSCRIBE: m({
      text: { value: _(`${TBT[topic]}|US|subscription+`) },
      message: {
        topic,
        action: actions.UNSUBSCRIBE.BYTE,
        name: 'subscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.UNSUBSCRIBE.BYTE,
          { n: 'subscription' },
          ''
        ),
        args: ['name'],
        payload: null,
        description: 'Sent to unsubscribe to a given name',
        source: 'client'
      }
    }),
    UNSUBSCRIBE_ACK: m({
      text: { value: _(`${TBT[topic]}|A|US|subscription+`) },
      message: {
        isAck: true,
        topic,
        action: actions.UNSUBSCRIBE.BYTE,
        name: 'subscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.UNSUBSCRIBE_ACK.BYTE,
          { n: 'subscription' },
          ''
        ),
        args: ['name'],
        payload: null,
        description: 'Sent when an \'UNSUBSCRIBE\' message is permissioned and the subscription deregistered,',
        source: 'server'
      }
    }),
    MULTIPLE_SUBSCRIPTIONS: m({
      text: { parse: false, value: _(`${TBT[topic]}|E|MULTIPLE_SUBSCRIPTIONS|username+`) },
      message: {
        isAck: false,
        isError: true,
        topic,
        action: actions.MULTIPLE_SUBSCRIPTIONS.BYTE,
        name: 'username',
      },
      urp: {
        value: binMsg(
          topic,
          actions.MULTIPLE_SUBSCRIPTIONS.BYTE,
          { n: 'username' },
          ''
        ),
        args: ['name'],
        payload: null,
        description: 'Sent in response to a \'SUBSCRIBE\' message if the subscription already exists',
        source: 'server'
      }
    }),
    NOT_SUBSCRIBED: m({
      text: { parse: false, value: _(`${TBT[topic]}|E|NOT_SUBSCRIBED|username+`) },
      message: {
        isAck: false,
        isError: true,
        topic,
        action: actions.NOT_SUBSCRIBED.BYTE,
        name: 'username',
      },
      urp: {
        value: binMsg(
          topic,
          actions.NOT_SUBSCRIBED.BYTE,
          { n: 'username' },
          ''
        ),
        args: ['name'],
        payload: null,
        description: 'Sent in response to an \'UNSUBSCRIBE\' message if the subscription does not already exist',
        source: 'server'
      }
    }),
  })
}

function extendWithListenMessages (topic, actions, messages) {
  Object.assign(messages, {
    LISTEN: m({
      text: { value: _(`${TBT[topic]}|L|.*+`) },
      message: {
        topic,
        action: actions.LISTEN.BYTE,
        name: '.*',
      },
      urp: {
        value: binMsg(
          topic,
          actions.LISTEN.BYTE,
          { n: '.*' },
          ''
        ),
        args: ['name'],
        payload: null,
      }
    }),
    LISTEN_ACK: m({
      text: { value: _(`${TBT[topic]}|A|L|.*+`) },
      message: {
        isAck: true,
        topic,
        action: actions.LISTEN.BYTE,
        name: '.*',
      },
      urp: {
        value: binMsg(
          topic,
          actions.LISTEN_ACK.BYTE,
          { n: '.*' },
          ''
        ),
        args: ['name'],
        payload: null,
      }
    }),
    UNLISTEN: m({
      text: { value: _(`${TBT[topic]}|UL|.*+`) },
      message: {
        topic,
        action: actions.UNLISTEN.BYTE,
        name: '.*',
      },
      urp: {
        value: binMsg(
          topic,
          actions.UNLISTEN.BYTE,
          { n: '.*' },
          ''
        ),
        args: ['name'],
        payload: null,
      }
    }),
    UNLISTEN_ACK: m({
      text: { value: _(`${TBT[topic]}|A|UL|.*+`) },
      message: {
        isAck: true,
        topic,
        action: actions.UNLISTEN.BYTE,
        name: '.*',
      },
      urp: {
        value: binMsg(
          topic,
          actions.UNLISTEN_ACK.BYTE,
          { n: '.*' },
          ''
        ),
        args: ['name'],
        payload: null,
      }
    }),
    SUBSCRIPTION_FOR_PATTERN_FOUND: m({
      text: { value: _(`${TBT[topic]}|SP|.*|someSubscription+`) },
      message: {
        topic,
        action: actions.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE,
        name: '.*',
        subscription: 'someSubscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.SUBSCRIPTION_FOR_PATTERN_FOUND.BYTE,
          { n: '.*', s: 'someSubscription' },
          ''
        ),
        args: ['name', 'subscription'],
        payload: null,
      }
    }),
    SUBSCRIPTION_FOR_PATTERN_REMOVED: m({
      text: { value: _(`${TBT[topic]}|SR|.*|someSubscription+`) },
      message: {
        topic,
        action: actions.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
        name: '.*',
        subscription: 'someSubscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.SUBSCRIPTION_FOR_PATTERN_REMOVED.BYTE,
          { n: '.*', s: 'someSubscription' },
          ''
        ),
        args: ['name', 'subscription'],
        payload: null,
      }
    }),
    LISTEN_ACCEPT: m({
      text: { value: _(`${TBT[topic]}|LA|.*|someSubscription+`) },
      message: {
        topic,
        action: actions.LISTEN_ACCEPT.BYTE,
        name: '.*',
        subscription: 'someSubscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.LISTEN_ACCEPT.BYTE,
          { n: '.*', s: 'someSubscription' },
          ''
        ),
        args: ['name', 'subscription'],
        payload: null,
      }
    }),
    LISTEN_REJECT: m({
      text: { value: _(`${TBT[topic]}|LR|.*|someSubscription+`) },
      message: {
        topic,
        action: actions.LISTEN_REJECT.BYTE,
        name: '.*',
        subscription: 'someSubscription',
      },
      urp: {
        value: binMsg(
          topic,
          actions.LISTEN_REJECT.BYTE,
          { n: '.*', s: 'someSubscription' },
          ''
        ),
        args: ['name', 'subscription'],
        payload: null,
      }
    }),
  })
}

export const PARSER_MESSAGES: { [key: string]: MessageSpec } = {
  UNKNOWN_TOPIC: m({
    text: { value: _('X|E|UNKNOWN_TOPIC|topic+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.UNKNOWN_TOPIC.BYTE,
      reason: 'topic',
      isError: true
    },
    urp: {
      value: binMsg(TOPIC.PARSER.BYTE, XA.UNKNOWN_TOPIC.BYTE, { r: 'topic' }, ''),
      args: ['reason'],
      payload: null,
    }
  }),
  UNKNOWN_ACTION: m({
    text: { value: _('X|E|UNKNOWN_ACTION|action+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.UNKNOWN_ACTION.BYTE,
      reason: 'action',
      isError: true
    },
    urp: {
      value: binMsg(TOPIC.PARSER.BYTE, XA.UNKNOWN_ACTION.BYTE, { r: 'action' }, ''),
      args: ['reason'],
      payload: null,
    }
  }),
  INVALID_MESSAGE: m({
    text: { parse: false, value: _('X|E|INVALID_MESSAGE|too long+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.INVALID_MESSAGE.BYTE,
      reason: 'too long',
      isError: true
    },
    urp: {
      value: binMsg(TOPIC.PARSER.BYTE, XA.INVALID_MESSAGE.BYTE, { r: 'too long' }, ''),
      args: ['reason'],
      payload: null,
    }
  }),
  MESSAGE_PARSE_ERROR: m({
    text: { parse: false, value: _('X|E|MESSAGE_PARSE_ERROR+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.MESSAGE_PARSE_ERROR.BYTE,
      isError: true
    },
    urp: {
      value: binMsg(TOPIC.PARSER.BYTE, XA.MESSAGE_PARSE_ERROR.BYTE, '', ''),
      args: [],
      payload: null,
    }
  }),
  MAXIMUM_MESSAGE_SIZE_EXCEEDED: m({
    text: { parse: false, value: _('X|E|MAXIMUM_MESSAGE_SIZE_EXCEEDED+') },
    message: {
      topic: TOPIC.PARSER.BYTE,
      action: XA.MAXIMUM_MESSAGE_SIZE_EXCEEDED.BYTE,
      isError: true
    },
    urp: {
      value: binMsg(TOPIC.PARSER.BYTE, XA.MAXIMUM_MESSAGE_SIZE_EXCEEDED.BYTE, '', ''),
      args: [],
      payload: null,
    }
  })
}

export const CONNECTION_MESSAGES: {[key: string]: MessageSpec | null} = {
  PING: m({
    text: { value: _('C|PI+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PING.BYTE
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.PING.BYTE, '', '') ,
      args: [],
      payload: null,
      description: 'Sent periodically to ensure a live connection',
      source: 'server'
    },
  }),
  PONG: m({
    text: { parse: false, value: _('C|PO+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.PONG.BYTE
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.PONG.BYTE, '', ''),
      args: [],
      payload: null,
      description: 'Sent immediately in response to a \'Ping\' message',
      source: 'client'
    }
  }),
  CHALLENGE: m({
    text: { value: _('C|CH+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CHALLENGE.BYTE,
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.CHALLENGE.BYTE, '', ''),
      args: [],
      payload: null,
      description: 'Sent as soon as a connection is established',
      source: 'server'
    }
  }),
  CHALLENGE_RESPONSE: m({
    text: { value: _('C|CHR|ws://url.io+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CHALLENGE_RESPONSE.BYTE,
      url: 'ws://url.io',
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.CHALLENGE_RESPONSE.BYTE, { u: 'ws://url.io' }, ''),
      args: ['url'],
      payload: null,
      description: 'Sent when a \'Connection Challenge\' is received',
      source: 'client'
    }
  }),
  ACCEPT: m({
    text: { value: _('C|A+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.ACCEPT.BYTE,
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.ACCEPT.BYTE, '', ''),
      args: [],
      payload: null,
      description: 'Sent in response to a \'Challenge Response\' if the requested URL is valid',
      source: 'server'
    }
  }),
  REJECT: m({
    text: { value: _('C|REJ|reason+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.REJECT.BYTE,
      reason: 'reason',
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.REJECT.BYTE, { r: 'reason' }, ''),
      args: ['reason'],
      payload: null,
      description: 'Sent in response to a \'Challenge Response\' if the requested URL is invalid',
      source: 'server'
    }
  }),
  REDIRECT: m({
    text: { value: _('C|RED|ws://url.io+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.REDIRECT.BYTE,
      url: 'ws://url.io',
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.REDIRECT.BYTE, { u: 'ws://url.io' }, ''),
      args: ['url'],
      payload: null,
      description: 'Sent to redirect a client to a different url',
      source: 'server'
    }
  }),
  ERROR: null,
  CONNECTION_AUTHENTICATION_TIMEOUT: m({
    text: { parse: false, value: _('C|E|CONNECTION_AUTHENTICATION_TIMEOUT+') },
    message: {
      topic: TOPIC.CONNECTION.BYTE,
      action: CA.CONNECTION_AUTHENTICATION_TIMEOUT.BYTE,
    },
    urp: {
      value: binMsg(TOPIC.CONNECTION.BYTE, CA.CONNECTION_AUTHENTICATION_TIMEOUT.BYTE, '', ''),
      args: [],
      payload: null,
      description: 'Sent if a connection has not authenticated successfully within the configured AUTHENTICATION_TIMEOUT',
      source: 'server'
    }
  })
}

export const AUTH_MESSAGES: {[key: string]: MessageSpec | null} = {
  REQUEST: m({
    text: { value: _('A|REQ|{"username":"ricardo"}+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.REQUEST.BYTE,
      parsedData: { username: 'ricardo' },
    },
    urp: {
      value: binMsg(TOPIC.AUTH.BYTE, AA.REQUEST.BYTE, '', { username: 'ricardo' }),
      args: [],
      payload: 'authData',
      description: 'Sent to authenticate a client with optional credentials',
      source: 'client'
    }
  }),
  AUTH_SUCCESSFUL: m({
    text: { value: _('A|A|O{"id":"foobar"}+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.AUTH_SUCCESSFUL.BYTE,
      parsedData: { id: 'foobar' },
    },
    urp: {
      value: binMsg(TOPIC.AUTH.BYTE, AA.AUTH_SUCCESSFUL.BYTE, '', { id: 'foobar' }),
      args: [],
      payload: 'clientData',
      description: 'Sent if authentication was successful',
      source: 'server'
    }
  }),
  AUTH_UNSUCCESSFUL: m({
    text: { value: _('A|E|INVALID_AUTH_DATA|errorMessage+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.AUTH_UNSUCCESSFUL.BYTE,
      reason: 'errorMessage',
    },
    urp: {
      value: binMsg(TOPIC.AUTH.BYTE, AA.AUTH_UNSUCCESSFUL.BYTE, { r: 'errorMessage' }, ''),
      args: ['reason'],
      payload: null,
      description: 'Sent if authentication was unsuccessful',
      source: 'server'
    }
  }),
  TOO_MANY_AUTH_ATTEMPTS: m({
    text: { value: _('A|E|TOO_MANY_AUTH_ATTEMPTS+') },
    message: {
      topic: TOPIC.AUTH.BYTE,
      action: AA.TOO_MANY_AUTH_ATTEMPTS.BYTE,
    },
    urp: {
      value: binMsg(TOPIC.AUTH.BYTE, AA.TOO_MANY_AUTH_ATTEMPTS.BYTE, '', ''),
      args: [],
      payload: null,
      description: 'Sent if the number of unsuccessful authentication attempts exceeds a configured maximum. Followed by a connection close.',
      source: 'server'
    }
  }),
  MESSAGE_PERMISSION_ERROR: null,
  MESSAGE_DENIED: null,
  ERROR: null,
  INVALID_MESSAGE_DATA: m({
    text: {
      parse: false,
      value: _('A|E|INVALID_AUTH_DATA|[invalid+'),
    },
    message: {
      isAck: false,
      isError: true,
      topic: TOPIC.AUTH.BYTE,
      action: AA.INVALID_MESSAGE_DATA.BYTE,
      reason: '[invalid',
    },
    urp: {
      value: binMsg(TOPIC.AUTH.BYTE, AA.INVALID_MESSAGE_DATA.BYTE, { r: '[invalid' }, ''),
      args: ['reason'],
      payload: null,
      description: 'Sent if the provided authentication data is invalid.',
      source: 'server'
    }
  }),
}

export const RECORD_MESSAGES: {[key: string]: MessageSpec | null} = {
  HEAD: m({
    text: { value: _('R|HD|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.HEAD.BYTE,
      name: 'user/someId',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.HEAD.BYTE, { n: 'user/someId' }, ''),
      args: ['name'],
      payload: null,
      description: 'Sent to request the current version of a given record',
      source: 'client'
    }
  }),
  HEAD_RESPONSE: m({
    text: { parse: false, value: _('R|HD|user/someId|12+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.HEAD_RESPONSE.BYTE,
      name: 'user/someId',
      version: 12,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.HEAD_RESPONSE.BYTE, { n: 'user/someId', v: 12 }, ''),
      args: ['name', 'version'],
      payload: null,
      description: 'Sent in response to a \'HEAD\' message with the current version of a record',
      source: 'server'
    }
  }),
  READ: m({
    text: { value: _('R|R|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ.BYTE,
      name: 'user/someId',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.READ.BYTE, { n: 'user/someId' }, ''),
      args: ['name'],
      payload: null,
      description: 'Sent to request the content of a given record',
      source: 'client'
    }
  }),
  READ_RESPONSE: m({
    text: { parse: false, value: _('R|R|user/someId|1|{"firstname":"Wolfram"}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ_RESPONSE.BYTE,
      name: 'user/someId',
      parsedData: {firstname: 'Wolfram'},
      version: 1,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.READ_RESPONSE.BYTE, { n: 'user/someId', v: 1 }, { firstname: 'Wolfram' }),
      args: ['name', 'version'],
      payload: 'recordData',
      description: 'Sent in response to a \'READ\' message with the current version and content of a record',
      source: 'server'
    }
  }),
  UPDATE: m({
    text: { parse: false, value: _('R|U|user/someId|1|{"firstname":"Wolfram"}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      name: 'user/someId',
      version: 1,
      parsedData: { firstname: 'Wolfram' },
      isWriteAck: false,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.UPDATE.BYTE, { n: 'user/someId', v: 1 }, { firstname: 'Wolfram' }),
      args: ['name', 'version'],
      payload: 'recordData',
    }
  }),
  UPDATE_WITH_WRITE_ACK: m({
    text: { value: _('R|U|user/someId|1|{"firstname":"Wolfram"}|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      name: 'user/someId',
      version: 1,
      parsedData: { firstname: 'Wolfram' },
      isWriteAck: true,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.UPDATE_WITH_WRITE_ACK.BYTE, { n: 'user/someId', v: 1 }, { firstname: 'Wolfram' }),
      args: ['name', 'version'],
      payload: 'recordData',
    }
  }),
  PATCH: m({
    text: { value: _('R|P|user/someId|1|path|Sdata+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      name: 'user/someId',
      path: 'path',
      version: 1,
      parsedData: 'data',
      isWriteAck: false,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.PATCH.BYTE, { n: 'user/someId', v: 1, p: 'path' }, '"data"'),
      args: ['name', 'version', 'path'],
      payload: 'patchData',
    }
  }),
  PATCH_WITH_WRITE_ACK: m({
    text: { value: _('R|P|user/someId|1|path|Sdata|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      name: 'user/someId',
      path: 'path',
      version: 1,
      parsedData: 'data',
      isWriteAck: true,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.PATCH_WITH_WRITE_ACK.BYTE, { n: 'user/someId', v: 1, p: 'path' }, '"data"'),
      args: ['name', 'version', 'path'],
      payload: 'patchData',
    }
  }),
  ERASE: m({
    text: { parse: false, value: _('R|P|user/someId|1|path|U+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.ERASE.BYTE,
      name: 'user/someId',
      path: 'path',
      version: 1,
      isWriteAck: false,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.ERASE.BYTE, { n: 'user/someId', v: 1, p: 'path' }, ''),
      args: ['name', 'version', 'path'],
      payload: null,
    }
  }),
  ERASE_WITH_WRITE_ACK: m({
    text: { parse: false, value: _('R|P|user/someId|1|path|U|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.ERASE.BYTE,
      name: 'user/someId',
      path: 'path',
      version: 1,
      isWriteAck: true,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.ERASE_WITH_WRITE_ACK.BYTE, { n: 'user/someId', v: 1, p: 'path' }, ''),
      args: ['name', 'version', 'path'],
      payload: null,
    }
  }),
  CREATEANDUPDATE: m({
    text: { value: _('R|CU|user/someId|1|{"name":"bob"}|{}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDUPDATE.BYTE,
      name: 'user/someId',
      version: 1,
      parsedData: { name: 'bob' },
      isWriteAck: false,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.CREATEANDUPDATE.BYTE, { n: 'user/someId', v: 1 }, { name: 'bob' }),
      args: ['name', 'version'],
      payload: 'recordData',
    }
  }),
  CREATEANDUPDATE_WITH_WRITE_ACK: m({
    text: { value: _('R|CU|user/someId|1|{"name":"bob"}|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDUPDATE.BYTE,
      name: 'user/someId',
      version: 1,
      parsedData: { name: 'bob' },
      isWriteAck: true,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.CREATEANDUPDATE_WITH_WRITE_ACK.BYTE, { n: 'user/someId', v: 1 }, { name: 'bob' }),
      args: ['name', 'version'],
      payload: 'recordData',
    }
  }),
  CREATEANDPATCH: m({
    text: { value: _('R|CU|user/someId|1|path|Sdata|{}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDPATCH.BYTE,
      name: 'user/someId',
      version: 1,
      path: 'path',
      parsedData: 'data',
      isWriteAck: false,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.CREATEANDPATCH.BYTE, { n: 'user/someId', v: 1, p: 'path' }, '"data"'),
      args: ['name', 'version', 'path'],
      payload: 'patchData',
    }
  }),
  CREATEANDPATCH_WITH_WRITE_ACK: m({
    text: { value: _('R|CU|user/someId|1|path|Sdata|{"writeSuccess":true}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CREATEANDPATCH.BYTE,
      name: 'user/someId',
      version: 1,
      path: 'path',
      parsedData: 'data',
      isWriteAck: true,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.CREATEANDPATCH_WITH_WRITE_ACK.BYTE, { n: 'user/someId', v: 1, p: 'path' }, '"data"'),
      args: ['name', 'version', 'path'],
      payload: 'patchData',
    }
  }),
  DELETE : m({
    text: { value: _('R|D|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.DELETE.BYTE, { n: 'user/someId' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  DELETE_ACK : m({
    text: { value: _('R|A|D|user/someId+') },
    message: {
      isAck: true,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.DELETE_ACK.BYTE, { n: 'user/someId' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  DELETED : m({
    text: { parse: false, value: _('R|A|D|user/someId+') },
    message: {
      isAck: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETED.BYTE,
      name: 'user/someId',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.DELETED.BYTE, { n: 'user/someId' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  SUBSCRIBECREATEANDREAD: m({
    text: { value: _('R|CR|user/someId+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIBECREATEANDREAD.BYTE,
      name: 'user/someId',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.SUBSCRIBECREATEANDREAD.BYTE, { n: 'user/someId' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  SUBSCRIPTION_HAS_PROVIDER: m({
    text: { value: _('R|SH|someSubscription|T+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_HAS_PROVIDER.BYTE,
      name: 'someSubscription',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.SUBSCRIPTION_HAS_PROVIDER.BYTE, { n: 'someSubscription' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  SUBSCRIPTION_HAS_NO_PROVIDER: m({
    text: { value: _('R|SH|someSubscription|F+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIPTION_HAS_NO_PROVIDER.BYTE,
      name: 'someSubscription',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.SUBSCRIPTION_HAS_NO_PROVIDER.BYTE, { n: 'someSubscription' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  WRITE_ACKNOWLEDGEMENT: m({
    text: { parse: false, value: _('R|WA|someSubscription|[-1]|L+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.WRITE_ACKNOWLEDGEMENT.BYTE,
      name: 'someSubscription',
      parsedData: [ [-1], null ],
    },
    // FIXME: versions and errors should be in meta, not payload
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.WRITE_ACKNOWLEDGEMENT.BYTE, { n: 'someSubscription' }, [[-1], null]),
      args: ['name'],
      payload: '[errorVersionsArray, errorData]',
    }
  }),
  VERSION_EXISTS: m({
    text: { value: _('R|E|VERSION_EXISTS|recordName|1|{}+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.VERSION_EXISTS.BYTE,
      name: 'recordName',
      parsedData: {},
      version: 1,
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.VERSION_EXISTS.BYTE, { n: 'recordName', v: 1 }, {}),
      args: ['name', 'version'],
      payload: null,
    }
  }),
  CACHE_RETRIEVAL_TIMEOUT: m({
    text: { value: _('R|E|CACHE_RETRIEVAL_TIMEOUT|recordName+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.CACHE_RETRIEVAL_TIMEOUT.BYTE,
      name: 'recordName',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.CACHE_RETRIEVAL_TIMEOUT.BYTE, { n: 'recordName' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  STORAGE_RETRIEVAL_TIMEOUT: m({
    text: { value: _('R|E|STORAGE_RETRIEVAL_TIMEOUT|recordName+') },
    message: {
      topic: TOPIC.RECORD.BYTE,
      action: RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE,
      name: 'recordName',
    },
    urp: {
      value: binMsg(TOPIC.RECORD.BYTE, RA.STORAGE_RETRIEVAL_TIMEOUT.BYTE, { n: 'recordName' }, ''),
      args: ['name'],
      payload: null,
    }
  }),
  RECORD_LOAD_ERROR: null,
  RECORD_CREATE_ERROR: null,
  RECORD_UPDATE_ERROR: null,
  RECORD_DELETE_ERROR: null,
  RECORD_READ_ERROR: null,
  RECORD_NOT_FOUND: null,
  INVALID_VERSION: null,
  INVALID_PATCH_ON_HOTPATH: null,
  CREATE: null,
  SUBSCRIBEANDHEAD: null,
  SUBSCRIBEANDREAD: null,
  SUBSCRIBECREATEANDUPDATE: null,
  HAS: null,
  HAS_RESPONSE: null,
}
extendWithGenericMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)
extendWithSubscriptionMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)
extendWithListenMessages(TOPIC.RECORD.BYTE, RA, RECORD_MESSAGES)

export const RPC_MESSAGES: { [key: string]: MessageSpec | null } = {
  REQUEST_ERROR: m({
    text: { value: _('P|E|ERROR_MESSAGE|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.REQUEST_ERROR.BYTE,
      name: 'addValues',
      correlationId: '1234',
      reason: 'ERROR_MESSAGE',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.REQUEST_ERROR.BYTE,
        { n: 'addValues', c: '1234', r: 'ERROR_MESSAGE' },
        ''
      ),
      args: ['name', 'correlationId', 'reason'],
      payload: null
    }
  }),
  REQUEST: m({
    text: { value: _('P|REQ|addValues|1234|O{"val1":1,"val2":2}+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.REQUEST.BYTE,
      name: 'addValues',
      correlationId: '1234',
      parsedData: { val1: 1, val2: 2 },
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.REQUEST.BYTE,
        { n: 'addValues', c: '1234' },
        { val1: 1, val2: 2 }
      ),
      args: ['name', 'correlationId'],
      payload: 'rpcData'
    }
  }),
  ACCEPT: m({
    text: { value: _('P|A|REQ|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.ACCEPT.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.ACCEPT.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  REJECT: m({
    text: { value: _('P|REJ|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.REJECT.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.REJECT.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  RESPONSE: m({
    text: { value: _('P|RES|addValues|1234|O{"val1":1,"val2":2}+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.RESPONSE.BYTE,
      name: 'addValues',
      correlationId: '1234',
      parsedData: { val1: 1, val2: 2 },
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.RESPONSE.BYTE,
        { n: 'addValues', c: '1234' },
        { val1: 1, val2: 2 }
      ),
      args: ['name', 'correlationId'],
      payload: 'rpcData'
    }
  }),
  PROVIDE: m({
    text: { value: _('P|S|addValues+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.PROVIDE.BYTE,
        { n: 'addValues' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  PROVIDE_ACK: m({
    text: { value: _('P|A|S|addValues+') },
    message: {
      isAck: true,
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.PROVIDE_ACK.BYTE,
        { n: 'addValues' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  UNPROVIDE: m({
    text: { value: _('P|US|addValues+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.UNPROVIDE.BYTE,
        { n: 'addValues' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  UNPROVIDE_ACK: m({
    text: { value: _('P|A|US|addValues+') },
    message: {
      isAck: true,
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.UNPROVIDE_ACK.BYTE,
        { n: 'addValues' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  MULTIPLE_PROVIDERS: null,
  NOT_PROVIDED: null,
  MULTIPLE_RESPONSE: m({
    text: { parse: false, value: _('P|E|MULTIPLE_RESPONSE|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.MULTIPLE_RESPONSE.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.MULTIPLE_RESPONSE.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  RESPONSE_TIMEOUT: m({
    text: { parse: false, value: _('P|E|RESPONSE_TIMEOUT|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.RESPONSE_TIMEOUT.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.RESPONSE_TIMEOUT.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  INVALID_RPC_CORRELATION_ID: m({
    text: { parse: false, value: _('P|E|INVALID_RPC_CORRELATION_ID|addValues|/=/=/=/+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.INVALID_RPC_CORRELATION_ID.BYTE,
      name: 'addValues',
      correlationId: '/=/=/=/',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.INVALID_RPC_CORRELATION_ID.BYTE,
        { n: 'addValues', c: '/=/=/=/' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  MULTIPLE_ACCEPT: m({
    text: { parse: false, value: _('P|E|MULTIPLE_ACCEPT|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.MULTIPLE_ACCEPT.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.MULTIPLE_ACCEPT.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  ACCEPT_TIMEOUT: m({
    text: { parse: false, value: _('P|E|ACCEPT_TIMEOUT|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.ACCEPT_TIMEOUT.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.ACCEPT_TIMEOUT.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
  NO_RPC_PROVIDER: m({
    text: { parse: false, value: _('P|E|NO_RPC_PROVIDER|addValues|1234+') },
    message: {
      topic: TOPIC.RPC.BYTE,
      action: PA.NO_RPC_PROVIDER.BYTE,
      name: 'addValues',
      correlationId: '1234',
    },
    urp: {
      value: binMsg(
        TOPIC.RPC.BYTE,
        PA.NO_RPC_PROVIDER.BYTE,
        { n: 'addValues', c: '1234' },
        ''
      ),
      args: ['name', 'correlationId'],
      payload: null
    }
  }),
}
extendWithGenericMessages(TOPIC.RPC.BYTE, PA, RPC_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.RPC.BYTE, PA, RPC_MESSAGES)

export const EVENT_MESSAGES: { [key: string]: MessageSpec } = {
  EMIT: m({
    text: { value: _('E|EVT|someEvent|Sdata+') },
    message: {
      topic: TOPIC.EVENT.BYTE,
      action: EA.EMIT.BYTE,
      name: 'someEvent',
      parsedData: 'data',
    },
    urp: {
      value: binMsg(TOPIC.EVENT.BYTE, EA.EMIT.BYTE, { n: 'someEvent' }, '"data"'),
      args: ['name'],
      payload: 'eventData',
      description: 'Sent to emit an event',
      source: 'client+server'
    }
  })
}
extendWithGenericMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)
extendWithSubscriptionMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)
extendWithListenMessages(TOPIC.EVENT.BYTE, EA, EVENT_MESSAGES)

export const PRESENCE_MESSAGES: {[key: string]: MessageSpec | null} = {
  SUBSCRIBE: m({
    text: { value: _('U|S|1234|["alan","john"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      correlationId: '1234',
      parsedData: ['alan', 'john'],
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.SUBSCRIBE.BYTE,
        { c: '1234' },
        ['alan', 'john']
      ),
      args: ['correlationId'],
      payload: 'userList'
    }
  }),
  SUBSCRIBE_ACK: m({
    text: { parse: false, value: _('U|A|S|alan+') },
    message: {
      isAck: true,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: 'alan',
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.SUBSCRIBE_ACK.BYTE,
        { n: 'alan' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  UNSUBSCRIBE: m({
    text: { value: _('U|US|1234|["alan","john"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      correlationId: '1234',
      parsedData: ['alan', 'john'],
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.UNSUBSCRIBE.BYTE,
        { c: '1234' },
        ['alan', 'john']
      ),
      args: ['correlationId'],
      payload: 'userList'
    }
  }),
  UNSUBSCRIBE_ACK: m({
    text: { parse: false, value: _('U|A|US|alan+') },
    message: {
      isAck: true,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: 'alan',
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.UNSUBSCRIBE_ACK.BYTE,
        { n: 'alan' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  MULTIPLE_SUBSCRIPTIONS: null,
  NOT_SUBSCRIBED: null,
  QUERY_ALL: m({
    text: { value: _('U|Q|Q+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL.BYTE,
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.QUERY_ALL.BYTE,
        '',
        ''
      ),
      args: [],
      payload: null
    }
  }),
  QUERY_ALL_RESPONSE: m({
    text: { parse: false, value: _('U|Q|alan|sarah+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL_RESPONSE.BYTE,
      parsedData: ['alan', 'sarah'],
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.QUERY_ALL_RESPONSE.BYTE,
        '',
        ['alan', 'sarah']
      ),
      args: [''],
      payload: 'userList'
    }
  }),
  QUERY: m({
    text: { value: _('U|Q|1234|["alan"]+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY.BYTE,
      correlationId: '1234',
      parsedData: ['alan'],
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.QUERY.BYTE,
        { c: '1234' },
        ['alan']
      ),
      args: ['correlationId'],
      payload: 'userList'
    }
  }),
  QUERY_RESPONSE: m({
    text: { parse: false, value: _('U|Q|1234|{"alan":true}+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_RESPONSE.BYTE,
      correlationId: '1234',
      parsedData: { alan: true },
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.QUERY_RESPONSE.BYTE,
        { c: '1234' },
        { alan: true }
      ),
      args: ['correlationId'],
      payload: 'userMap'
    }
  }),
  PRESENCE_JOIN: m({
    text: { parse: false, value: _('U|PNJ|username+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_JOIN.BYTE,
      name: 'username',
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.PRESENCE_JOIN.BYTE,
        { n: 'username' },
        ''
      ),
      args: ['name'],
      payload: null
    }
  }),
  PRESENCE_LEAVE: m({
    text: { parse: false, value: _('U|PNL|username+') },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_LEAVE.BYTE,
      name: 'username',
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.PRESENCE_LEAVE.BYTE,
        { n: 'username' },
        ''
      ),
      args: ['name'],
      payload: 'userList'
    }
  }),
  INVALID_PRESENCE_USERS: m({
    text: {
      parse: false,
      value: _('U|E|INVALID_PRESENCE_USERS|reason+'),
    },
    message: {
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.INVALID_PRESENCE_USERS.BYTE,
      reason: 'reason',
    },
    urp: {
      value: binMsg(
        TOPIC.PRESENCE.BYTE,
        UA.INVALID_PRESENCE_USERS.BYTE,
        { r: 'reason' },
        ''
      ),
      args: ['reason'],
      payload: null
    }
  }),
}
extendWithGenericMessages(TOPIC.PRESENCE.BYTE, UA, PRESENCE_MESSAGES)
extendWithPermissionErrorMessages(TOPIC.PRESENCE.BYTE, UA, PRESENCE_MESSAGES)

export const MESSAGES: {[key: number]: {[key: string]: MessageSpec | null}} = {
  [TOPIC.PARSER.BYTE]: PARSER_MESSAGES,
  [TOPIC.RECORD.BYTE]: RECORD_MESSAGES,
  [TOPIC.RPC.BYTE]: RPC_MESSAGES,
  [TOPIC.EVENT.BYTE]: EVENT_MESSAGES,
  [TOPIC.AUTH.BYTE]: AUTH_MESSAGES,
  [TOPIC.CONNECTION.BYTE]: CONNECTION_MESSAGES,
  [TOPIC.PRESENCE.BYTE]: PRESENCE_MESSAGES,
}
