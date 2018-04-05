import {
  BACKEND_SOCKET,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  SEND_TABS
} from '../constants'
import { Socket } from 'phoenix'

let socket = null
let channel = null

export function createSocket(userToken, channelId) {
  return dispatch => {
    let socket = new Socket(BACKEND_SOCKET, {
      params: { token: userToken }
    })

    socket.onError(err => {
      dispatch({
        type: SOCKET_ERROR,
        payload: err
      })
    })

    socket.connect()

    //-------------------------------------------------------------

    channel = socket.channel(`room:${channelId}`, {})
    channel
      .join()
      .receive('ok', resp => {
        dispatch({ type: SOCKET_CONNECTED })
      })
      .receive('error', resp => {
        dispatch({
          type: SOCKET_ERROR,
          payload: resp
        })
      })
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
