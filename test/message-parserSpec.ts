import { MESSAGES } from '../src/messages'

import { parse } from '../src/message-parser'

xdescribe('message parser', () => {
  for (let topic in MESSAGES) {
    for (let authAction in MESSAGES[topic]) {
      it (`parses ${topic} messages ${authAction} correctly`, () => {
        expect(parse(MESSAGES[topic][authAction].text)).toEqual([MESSAGES[topic][authAction].message])
      })
    }
  }
})
