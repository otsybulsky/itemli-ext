import { TEST, STORE_CURRENT_TABS, CHECK_SERVER_START } from '../constants'
import axios from 'axios'

const BACKEND_URL = 'http://localhost:4000'

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

    axios
      .get(`${BACKEND_URL}/api/check`, { withCredentials: true })
      .then(response => {
        console.log('AXIOS response', response.data)
      })
      .catch(error => {
        console.log('AXIOS error', JSON.stringify(error))
      })
  }
}
