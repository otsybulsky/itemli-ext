import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import reducers from './reducers'

import App from './components/app'

const createStoreWithMiddleware = applyMiddleware(logger)(createStore)

export const store = createStoreWithMiddleware(reducers)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('.container')
)

window.store = store //for develop ONLY
