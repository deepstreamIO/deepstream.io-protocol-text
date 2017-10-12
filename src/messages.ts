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
  ACTIONS_TEXT_TO_BYTE,
  MESSAGE_PART_SEPERATOR as _
} from './constants'

export const CONNECTION_MESSAGES = {
}

export const AUTH_MESSAGES = {
}

export const RECORD_MESSAGES = {
  READ: {
    text: `R${_}R${_}user/someId`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.READ.BYTE,
      name: 'user/someId'
    }
  },
  UPDATE: {
    text: `R${_}U${_}user/someId${_}1${_}{"firstname":"Wolfram"}`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UPDATE.BYTE,
      dataEncoding: PAYLOAD_ENCODING.JSON,
      name: 'user/someId',
      version: 1,
      data: '{"firstname":"Wolfram"}'
    }
  },
  PATCH: {
    text: `R${_}P${_}user/someId${_}1${_}path${_}Sdata`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.PATCH.BYTE,
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM,
      name: 'user/someId',
      version: 1,
      data: 'Sdata'
    }
  },
  LISTEN: {
    text: `R${_}L${_}.*`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.LISTEN.BYTE,
      name: '.*'
    }
  },
  DELETE : {
    text: `R${_}D${_}user/someId`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.DELETE.BYTE,
      name: 'user/someId'
    }
  },
  SUBSCRIBECREATEANDREAD:{
    text: `R${_}CR${_}user/someId`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.SUBSCRIBECREATEANDREAD.BYTE,
      name: 'user/someId' 
    }    
  },
  UNSUBSCRIBE: {
    text: `R${_}US${_}user/someId`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RECORD.BYTE,
      action: RA.UNSUBSCRIBE.BYTE,
      name: 'user/someId'
    }
  }
}  

export const RPC_MESSAGES = {
  REQUEST_ERROR: {
    text: `P${_}E${_}ERROR_MESSAGE${_}addValues${_}1234`,
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
    text: `P${_}REQ${_}addValues${_}1234${_}{"val1":1,"val2":2}`,
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
    text: `P${_}A${_}REQ${_}addValues${_}1234${_}`,
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
    text: `P${_}REJ${_}addValues${_}1234${_}`,
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
    text: `P${_}RES${_}addValues${_}1234${_}{"val1":1,"val2":2}`,
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
    text: `P${_}S${_}addValues`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues'
    }
  },
  PROVIDE_ACK: {
    text: `P${_}A${_}S${_}addValues`,
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.PROVIDE.BYTE,
      name: 'addValues'
    }
  }, 
  UNPROVIDE: {
    text: `P${_}US${_}addValues`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.RPC.BYTE,
      action: PA.UNPROVIDE.BYTE,
      name: 'addValues'
    }
  },
  UNPROVIDE_ACK: {
    text: `P${_}A${_}US${_}addValues`,
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
    text: `E${_}S${_}someEvent`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.SUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  SUBSRIBE_ACK: {
    text: `E${_}A${_}S${_}someEvent`,
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.SUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  UNSUBSRIBE: {
    text: `E${_}US${_}someEvent`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.UNSUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  UNSUBSRIBE_ACK: {
    text: `E${_}A${_}US${_}someEvent`,
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.UNSUBSCRIBE.BYTE,
      name: 'someEvent'
    }
  },
  EMIT: {
    text: `E${_}EVT${_}someEvent${_}Sdata`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.EVENT.BYTE,
      action: EA.EMIT.BYTE,
      name: 'someEvent',
      data: 'Sdata',
      dataEncoding: PAYLOAD_ENCODING.DEEPSTREAM
    }
  }
}

export const PRESENCE_MESSAGES = {
   SUBSRIBE: {
    text: `U${_}S${_}S`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: 'S'
    }
  },
  SUBSRIBE_ACK: {
    text: `U${_}A${_}S${_}S`,
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.SUBSCRIBE.BYTE,
      name: 'S'
    }
  },
  UNSUBSRIBE: {
    text: `U${_}US${_}US`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: 'US'
    }
  },
  UNSUBSRIBE_ACK: {
    text: `U${_}A${_}US${_}US`,
    message: {
      isAck: true,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.UNSUBSCRIBE.BYTE,
      name: 'US'
    }
  },
  QUERY_ALL: {
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL.BYTE,
      name: 'Q'
    }
  },
  QUERY_ALL_RESPONSE: {
    text: `U${_}Q${_}["alan","sarah"]`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL_RESPONSE.BYTE,
      data: '["alan", "sarah"]'
    }
  },
  QUERY: {
    text: `U${_}Q${_}1234${_}["alan"]`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.QUERY_ALL_RESPONSE.BYTE,
      data: '["alan"]'
    }
  },
  // QUERY_RESPONSE: {
  //   text: `U${_}Q${_}1234${_}["alan"]`,
  //   message: {
  //     isAck: false,
  //     isError: false,
  //     topic: TOPIC.PRESENCE.BYTE,
  //     action: UA.QUERY_ALL_RESPONSE.BYTE,
  //     data: '["alan"]'
  //   }
  // },
  PRESENCE_JOIN: {
    text: `U${_}PNJ${_}username`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_JOIN.BYTE,
      data: 'username'
    }
  },
  PRESENCE_LEAVE: {
    text: `U${_}PNL${_}username`,
    message: {
      isAck: false,
      isError: false,
      topic: TOPIC.PRESENCE.BYTE,
      action: UA.PRESENCE_LEAVE.BYTE,
      data: 'username'
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