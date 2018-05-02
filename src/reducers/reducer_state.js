import {
  TEST,
  CHECK_SERVER_START,
  CHECK_SERVER_END,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  SEND_TABS_OK
} from '../constants'

const INIT_STATE = {
  serverConnected: null,
  serverNeedAuth: null,
  lastError: null,
  socketConnected: null,
  retryConnectServer: null,
  tabsSaved: null
}

export default function(state = INIT_STATE, { type, payload }) {
  switch (type) {
    case SEND_TABS_OK:
      return {
        ...state,
        tabsSaved: true
      }
    case CHECK_SERVER_START:
      return { ...state, retryConnectServer: null }
    case CHECK_SERVER_END:
      const { status, params } = payload.data
      switch (status) {
        case 'ok':
          return {
            ...state,
            serverConnected: true,
            serverNeedAuth: false,
            retryConnectServer: false
          }
        case 'need_auth':
          return {
            ...state,
            serverConnected: true,
            serverNeedAuth: true,
            retryConnectServer: false
          }
        case 'error':
          return {
            ...state,
            serverConnected: false,
            serverNeedAuth: null,
            lastError: params,
            retryConnectServer: true
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
