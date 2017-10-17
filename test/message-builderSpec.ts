import { MESSAGES } from '../src/messages'
import { getMessage } from '../src/message-builder'
import { 
  TOPIC,
  ACTIONS as constants
} from '../../../src/constants'

fdescribe('message builder', () => {
  for (let topic in MESSAGES) {
    for (let authAction in MESSAGES[topic]) {
      if (!MESSAGES[topic][authAction] || Object.keys(MESSAGES[topic][authAction]).length === 0) {
        it (`builds ${TOPIC[topic]} messages ${authAction} correctly`, () => {
          pending('Missing message')
        })
      } else if (MESSAGES[topic][authAction].text.build === true) {
        it (`builds ${TOPIC[topic]} messages ${authAction} correctly`, () => {
          expect(
            getMessage(
              MESSAGES[topic][authAction].message, 
              authAction.indexOf('_ACK') > -1
            )
          ).toEqual(MESSAGES[topic][authAction].text.value)
        })
      }
    }
  }
})
