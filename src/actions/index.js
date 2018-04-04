import {
  TEST,
  STORE_CURRENT_TABS,
  CHECK_SERVER_START,
  CHECK_SERVER_END,
  BACKEND_URL,
  BACKEND_SOCKET,
  SOCKET_CONNECTED,
  SEND_TABS
} from '../constants'

import axios from 'axios'
import { Socket } from 'phoenix'

let socket = null
let channel = null

export function testEvent() {
  return {
    type: TEST,
    payload: 'test'
  }
}

export function sendTabs(params) {
  return dispatch => {
    dispatch({ type: SEND_TABS, payload: params })
    if (channel) {
      channel.push('tabs:add', { content: params[0] }).receive('ok', resp => {
        console.log(resp)
      })
    }
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

function createSocket(userToken, channelId) {
  return dispatch => {
    let socket = new Socket(BACKEND_SOCKET, { params: { token: userToken } })
    socket.connect()

    channel = socket.channel(`room:${channelId}`, {})
    channel
      .join()
      .receive('ok', resp => {
        dispatch({ type: SOCKET_CONNECTED })
      })
      .receive('error', resp => {
        console.log('Unable to join channel room', resp)
      })

    //channel.on(`comments:${topicId}:new`, renderComment)
  }
}

function endCheckServer(data) {
  return dispatch => {
    const { status, params: { token, channelId } } = data
    if (status === 'ok') {
      dispatch(createSocket(token, channelId))
    }

    dispatch({
      type: CHECK_SERVER_END,
      payload: { data: data }
    })
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
