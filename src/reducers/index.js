import { combineReducers } from 'redux'
import ReducerState from './reducer_state'
import ReducerData from './reducer_data'

const rootReducer = combineReducers({ state: ReducerState, data: ReducerData })

export default rootReducer
