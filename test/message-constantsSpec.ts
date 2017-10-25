import {
  ACTIONS as constants,
  TOPIC,
} from '../../../src/constants'
import {
  ACTIONS as protocol,
  ACTIONS_BYTE_TO_KEY as ATB,
} from '../src/constants'
import { MESSAGES } from '../src/messages'

describe('protocol', () => {
  for (const topic in constants) {
    for (const action in constants[topic]) {
      if (isNaN(Number(action))) {
        it (`contains message for ${TOPIC[topic]} with action ${action} in protocol`, () => {
          expect(MESSAGES[topic][action]).toBeDefined()
        })
      } else {
        it (`contains topic ${TOPIC[topic]} with action ${constants[topic][action]} in protocol`, () => {
          expect(ATB[topic][action]).toBeDefined()
        })
      }
    }
  }
})
