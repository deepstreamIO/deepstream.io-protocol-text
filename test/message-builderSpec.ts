import {
  ACTIONS as constants,
  TOPIC,
} from '../../../src/constants'
import { getMessage } from '../src/message-builder'
import { MESSAGES } from '../src/messages'

describe('message builder', () => {
  for (const topic in MESSAGES) {
    for (const authAction in MESSAGES[topic]) {
      const spec = MESSAGES[topic][authAction]
      if (!spec || Object.keys(spec).length === 0) {
        // it (`builds ${TOPIC[topic]} messages ${authAction} correctly`, () => {
        //   pending('Missing message')
        // })
      } else if (spec.text.build === true) {
        it (`builds ${TOPIC[topic]} messages ${authAction} correctly`, () => {
          const specCopy = JSON.parse(JSON.stringify(spec.message))
          const result = getMessage(specCopy, authAction.indexOf('_ACK') > -1)
          expect(result).toEqual(spec.text.value)
        })
      }
    }
  }
})
