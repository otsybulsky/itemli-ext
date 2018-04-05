import {
  TEST,
  STORE_CURRENT_TABS,
  CHECK_SERVER_END,
  SOCKET_CONNECTED,
  SOCKET_ERROR
} from '../constants'

const INIT_STATE = {
  serverConnected: null,
  serverNeedAuth: null,
  lastError: null,
  socketConnected: null,

  windowTabs: []
}

export default function(state = INIT_STATE, { type, payload }) {
  switch (type) {
    case STORE_CURRENT_TABS:
      return { ...state, windowTabs: payload.windowTabs }
    case CHECK_SERVER_END:
      const { status, params } = payload.data
      console.log(payload.data)
      switch (status) {
        case 'ok':
          return { ...state, serverConnected: true, serverNeedAuth: false }
        case 'need_auth':
          return { ...state, serverConnected: true, serverNeedAuth: true }
        case 'error':
          return {
            ...state,
            serverConnected: false,
            serverNeedAuth: null,
            lastError: params
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
