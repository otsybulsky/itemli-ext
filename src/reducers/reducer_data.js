import { OrderedMap, Record } from 'immutable'
import { arrToMap, mapToArr } from '../helpers'

import { STORE_CURRENT_TABS, CHANGE_SELECT } from '../constants'

const TabRecord = Record({
  id: undefined,
  index: undefined,
  selected: undefined,
  title: undefined,
  url: undefined,
  favIconUrl: undefined
})

const ReducerState = Record(
  {
    tabs: new OrderedMap({}),
    selectedCount: 0
  },
  'itemli'
)

const defaultState = new ReducerState()

function selectedCount(tabs) {
  return tabs.reduce((selectedCount, tab) => {
    return selectedCount + tab.selected
  }, 0)
}

export default (state = defaultState, action) => {
  const { type, payload } = action
  let new_state = null
  switch (type) {
    case STORE_CURRENT_TABS:
      const { windowTabs } = payload
      new_state = state.set('tabs', arrToMap(windowTabs, TabRecord))
      return new_state.set('selectedCount', selectedCount(new_state.tabs))

    case CHANGE_SELECT:
      const { tab } = payload
      new_state = state.setIn(['tabs', tab.id, 'selected'], !tab.selected)
      return new_state.set('selectedCount', selectedCount(new_state.tabs))

    default:
      return state
  }
}
