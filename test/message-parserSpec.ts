import {
  ACTIONS as constants,
  TOPIC,
} from '../../../src/constants'
import { parse } from '../src/message-parser'
import { MESSAGES } from '../src/messages'

describe('message parser', () => {
  for (const topic in MESSAGES) {
    for (const authAction in MESSAGES[topic]) {
      if (!MESSAGES[topic][authAction] || MESSAGES[topic][authAction].text === undefined) {
      // it (`parses ${TOPIC[topic]} messages ${authAction} correctly`, () => {
       //  pending('Missing message')
      // })
      } else if (MESSAGES[topic][authAction].text.parse === true) {
       it (`parses ${TOPIC[topic]} messages ${authAction} correctly`, () => {
        expect(parse(MESSAGES[topic][authAction].text.value)).toEqual([MESSAGES[topic][authAction].message])
      })
      }
    }
  }

})
