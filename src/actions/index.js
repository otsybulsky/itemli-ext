import { TEST, STORE_CURRENT_TABS } from '../constants'

export function testEvent() {
  return {
    type: TEST,
    payload: 'test'
  }
}

export function storeCurrentTabs(params) {
  return {
    type: STORE_CURRENT_TABS,
    payload: { windowTabs: params }
  }
}
