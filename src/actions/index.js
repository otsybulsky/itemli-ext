import { TEST } from '../constants'

export function testEvent() {
  return {
    type: TEST,
    payload: 'test'
  }
}
