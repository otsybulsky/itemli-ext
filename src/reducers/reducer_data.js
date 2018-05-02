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
  switch (type) {
    case STORE_CURRENT_TABS:
      const { windowTabs } = payload

      return state
        .set('tabs', arrToMap(windowTabs, TabRecord))
        .set('selectedCount', selectedCount(windowTabs))

    case CHANGE_SELECT:
      const { tab } = payload
      return state

    default:
      return state
  }
}
