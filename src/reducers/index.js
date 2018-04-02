import { combineReducers } from 'redux'
import ReducerState from './reducer_state'

const rootReducer = combineReducers({ state: ReducerState })

export default rootReducer
