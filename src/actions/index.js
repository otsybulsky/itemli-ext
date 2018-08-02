import {
  TEST,
  STORE_CURRENT_TABS,
  CHECK_SERVER_START,
  CHECK_SERVER_END,
  BACKEND_URL,
  CHANGE_SELECT,
  CHANGE_SELECT_ALL,
  SETTINGS_EDIT,
  SETTINGS_EDIT_CANCEL,
  SETTINGS_CHECK
} from '../constants'

import { createSocket } from './socket'

import axios from 'axios'

export function testEvent() {
  return {
    type: TEST,
    payload: 'test'
  }
}

export function settingsCheck(params) {
  const buildVersion = 1 // number current actual version of settings

  let settings = JSON.parse(localStorage.getItem('settings'))
  let saveSettings = false

  if (!settings) {
    const mainApi = (settings = {
      buildVersion: 0,
      currentApi: 'https://localhost:4000'
    })
    saveSettings = true
  }

  // if (settings.buildVersion !== buildVersion) {
  //   if (settings.buildVersion < 1) {
  //     settings.buildVersion = 1
  //   }
  //   saveSettings = true
  // }

  if (saveSettings) {
    localStorage.setItem('settings', JSON.stringify(settings))
  }

  settings.socketApi = `wss${settings.currentApi.replace(
    /https|http/,
    ''
  )}/socket`

  return {
    type: SETTINGS_CHECK,
    payload: settings
  }
}

export function settingsEdit(params) {
  return {
    type: SETTINGS_EDIT
  }
}

export function settingsEditCancel(params) {
  return {
    type: SETTINGS_EDIT_CANCEL
  }
}

export function tabChangeSelectAll(params) {
  return {
    type: CHANGE_SELECT_ALL,
    payload: params
  }
}

export function tabChangeSelect(params) {
  return {
    type: CHANGE_SELECT,
    payload: params
  }
}

export function storeCurrentTabs(params) {
  return {
    type: STORE_CURRENT_TABS,
    payload: { windowTabs: params }
  }
}

function startCheckServer(params) {
  return {
    type: CHECK_SERVER_START,
    payload: params
  }
}

function endCheckServer(data, socketApi) {
  return dispatch => {
    const { status, params } = data
    if (status === 'ok') {
      dispatch(createSocket(socketApi, params.token, params.channelId))
    }

    dispatch({
      type: CHECK_SERVER_END,
      payload: { data: data }
    })
  }
}

export function checkServer(settings) {
  return dispatch => {
    dispatch(startCheckServer(settings))

    axios
      .get(`${settings.currentApi}/api/check`, { withCredentials: true })
      .then(response => {
        dispatch(endCheckServer(response.data, settings.socketApi))
      })
      .catch(error => {
        dispatch(endCheckServer({ status: 'error', params: error }))
      })
  }
}
