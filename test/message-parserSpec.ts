import {
  ACTIONS as constants,
  TOPIC,
} from '../../../src/constants'
import { parse, parseData } from '../src/message-parser'
import { MESSAGES } from '../src/messages'

describe('message parser', () => {
  for (const topic in MESSAGES) {
    for (const action in MESSAGES[topic]) {
      const spec = MESSAGES[topic][action]
      if (!spec || spec.text === undefined) {
        // it (`parses ${TOPIC[topic]} messages ${action} correctly`, () => {
        //  pending('Missing message')
        // })
      } else if (spec.text.parse === true) {
        it (`parses ${TOPIC[topic]} messages ${action} correctly`, () => {
          const result = parse(spec.text.value)[0]
          expect(parseData(result)).toEqual(true)
          delete result.data
          expect(result).toEqual(spec.message)
        })
      }
    }
  }

})
