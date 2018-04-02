import { TEST, STORE_CURRENT_TABS, CHECK_SERVER_START } from '../constants'

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

function startCheckServer() {
  return {
    type: CHECK_SERVER_START,
    payload: null
  }
}

export function checkServer() {
  return dispatch => {
    dispatch(startCheckServer())
    dispatch(testEvent())
  }
}
