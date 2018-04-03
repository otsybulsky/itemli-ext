import { TEST, STORE_CURRENT_TABS, CHECK_SERVER_END } from '../constants'

const INIT_STATE = {
  serverConnected: null,
  serverNeedAuth: null,
  lastError: null,

  windowTabs: []
}

export default function(state = INIT_STATE, { type, payload }) {
  switch (type) {
    case STORE_CURRENT_TABS:
      return { ...state, windowTabs: payload.windowTabs }
    case CHECK_SERVER_END:
      console.log(payload)
      const { status, params } = payload.data
      switch (status) {
        case 'ok':
          window.userToken = params
          return { ...state, serverConnected: true, serverNeedAuth: false }
        case 'need_auth':
          window.userToken = null
          return { ...state, serverConnected: true, serverNeedAuth: true }
        case 'error':
          window.userToken = null
          return {
            ...state,
            serverConnected: false,
            serverNeedAuth: null,
            lastError: params
          }
        default:
          return state
      }

    default:
      return state
  }
}
