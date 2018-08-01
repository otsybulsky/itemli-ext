import {
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  SEND_TABS,
  SEND_TABS_OK
} from '../constants'
import { Socket } from 'phoenix'

let socket = null
let channel = null

export function createSocket(socketApi, userToken, channelId) {
  return dispatch => {
    socket = new Socket(socketApi, {
      params: { token: userToken }
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

    channel.onError(err => {
      dispatch({
        type: SOCKET_ERROR,
        payload: err
      })
    })
  }
}

export function sendTabs(params) {
  return dispatch => {
    dispatch({ type: SEND_TABS, payload: params })

    if (channel) {
      channel
        .push('tabs:add', params)
        .receive('ok', resp => {
          dispatch({ type: SEND_TABS_OK, payload: params })
        })
        .receive('error', err => {})
    }
  }
}
