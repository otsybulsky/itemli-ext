import {
  TEST,
  STORE_CURRENT_TABS,
  CHECK_SERVER_START,
  CHECK_SERVER_END,
  BACKEND_URL,
  BACKEND_SOCKET
} from '../constants'

import axios from 'axios'
import { Socket } from 'phoenix'
let socket = null

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

function createSocket(userToken) {
  console.log('TOKEN', userToken)
  let socket = new Socket(BACKEND_SOCKET, { params: { token: userToken } })
  socket.connect()
}

function endCheckServer(data) {
  const { status, params } = data
  if (status === 'ok') {
    createSocket(params)
  }

  return {
    type: CHECK_SERVER_END,
    payload: { data: data }
  }
}

export function checkServer() {
  return dispatch => {
    dispatch(startCheckServer())

    axios
      .get(`${BACKEND_URL}/api/check`, { withCredentials: true })
      .then(response => {
        dispatch(endCheckServer(response.data))
      })
      .catch(error => {
        dispatch(
          endCheckServer({ status: 'error', params: error }) //JSON.stringify(error) })
        )
      })
  }
}
