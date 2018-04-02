import { TEST, STORE_CURRENT_TABS } from '../constants'

const INIT_STATE = {
  serverConnected: null,
  windowTabs: []
}

export default function(state = INIT_STATE, { type, payload }) {
  switch (type) {
    case STORE_CURRENT_TABS:
      return { ...state, windowTabs: payload.windowTabs }
    default:
      return state
  }
}
