import {
  TEST,
  STORE_CURRENT_TABS,
  CHECK_SERVER_START,
  CHECK_SERVER_END,
  SOCKET_CONNECTED,
  SOCKET_ERROR
} from '../constants'

const INIT_STATE = {
  serverConnected: null,
  serverNeedAuth: null,
  lastError: null,
  socketConnected: null,
  retryConnect: null,

  windowTabs: []
}

export default function(state = INIT_STATE, { type, payload }) {
  switch (type) {
    case STORE_CURRENT_TABS:
      return { ...state, windowTabs: payload.windowTabs }
    case CHECK_SERVER_START:
      return { ...state, retryConnect: null }
    case CHECK_SERVER_END:
      const { status, params } = payload.data
      console.log(payload.data)
      switch (status) {
        case 'ok':
          return {
            ...state,
            serverConnected: true,
            serverNeedAuth: false,
            retryConnect: false
          }
        case 'need_auth':
          return {
            ...state,
            serverConnected: true,
            serverNeedAuth: true,
            retryConnect: false
          }
        case 'error':
          return {
            ...state,
            serverConnected: false,
            serverNeedAuth: null,
            lastError: params,
            retryConnect: true
          }

        default:
          return state
      }
    case SOCKET_CONNECTED:
      return { ...state, socketConnected: true, serverConnected: true }
    case SOCKET_ERROR:
      return { ...state, socketConnected: false, lastError: payload }

    default:
      return state
  }
}
