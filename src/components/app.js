import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  checkServer,
  storeCurrentTabs,
  settingsEdit,
  settingsCheck
} from '../actions'
import { sendTabs } from '../actions/socket'

import { mapToArr } from '../helpers'

import Article from './article'
import { tabChangeSelectAll } from '../actions'
import confirm from './dialogs/confirm'
import Settings from './settings'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tagTitle: ''
    }
  }

  componentWillMount() {
    this.props.settingsCheck()

    const tab_pattern = 'http'
    chrome.tabs.query({ currentWindow: true }, tabs => {
      this.props.storeCurrentTabs(
        tabs
          .filter(tab => {
            if (tab.url && tab.url.substr(0, 4) === tab_pattern) {
              return true
            } else {
              return false
            }
          })
          .map(tab => {
            const { id, index, title, url, favIconUrl } = tab
            return { id, index, title, url, favIconUrl, selected: true }
          })
      )
    })
  }

  componentWillReceiveProps(nextProps) {
    const { retryConnectServer, checkServer, settings } = nextProps

    if (settings) {
      if (retryConnectServer) {
        checkServer(settings)
      }
    }

    if (nextProps.serverConnected && nextProps.serverNeedAuth) {
      this.activatePortal('signin')
    }
    if (nextProps.tabsSaved) {
      this.activatePortal('app', true)
    }
  }

  activatePortal(path, tabsSaved) {
    const { windowTabs, settings } = this.props
    const portalUrl = settings.currentApi
    const absolutePath = `${portalUrl}/${path}`

    const firstTab = windowTabs[0]

    const selectedTabs = windowTabs
      .map(tab => tab.toJS())
      .filter(tab => tab.selected)

    if (tabsSaved) {
      selectedTabs.map(item => {
        if (item.index > 0) {
          chrome.tabs.remove(item.id)
        }
      })
    }

    if (!firstTab || firstTab.url.indexOf(portalUrl) < 0) {
      chrome.tabs.create({
        url: `${absolutePath}`,
        index: 0
      })
      if (tabsSaved) {
        chrome.tabs.remove(firstTab.id)
      }
    } else {
      //console.log(firstTab.url, absolutePath)
      if (firstTab.url === absolutePath) {
        chrome.tabs.update(firstTab.id, { active: true })
      } else {
        chrome.tabs.update(firstTab.id, { url: absolutePath, active: true })
      }
    }

    window.close()
  }

  onDisplayTabs() {
    this.activatePortal('app')
  }

  sendToServer() {
    const { serverConnected, socketConnected, windowTabs } = this.props

    if (serverConnected && socketConnected) {
      this.props.sendTabs({
        tag: { title: this.state.tagTitle },
        tabs: windowTabs.map(tab => tab.toJS()).filter(tab => tab.selected)
      })
    }
  }

  onSelectAll() {
    const { windowTabs, tabChangeSelectAll } = this.props
    if (windowTabs.length > 0) {
      const flag = !windowTabs[0].selected
      tabChangeSelectAll({ checked: flag })
    }
  }

  onCloseSelected() {
    const { selectedCount } = this.props
    confirm(`Confirm close ${selectedCount} tabs`).then(
      () => {
        const { windowTabs } = this.props
        const selectedTabs = windowTabs
          .map(tab => tab.toJS())
          .filter(tab => tab.selected)
          .map(item => {
            chrome.tabs.remove(item.id)
          })
        window.close()
      },
      () => {
        //cancel
      }
    )
  }

  onShowSettings() {
    this.props.settingsEdit()
  }

  renderButtons() {
    const { serverConnected, socketConnected } = this.props
    if (serverConnected && socketConnected) {
      return (
        <div className="interface">
          <input
            className="input-field"
            placeholder="Enter tag name"
            value={this.state.tagTitle}
            onChange={event => this.onInputChange(event.target.value)}
          />

          <a className="btn right" onClick={() => this.onShowSettings()}>
            <i className="material-icons">settings</i>
          </a>

          <ul>
            <li>
              <a className="btn" onClick={() => this.onSelectAll()}>
                <i className="material-icons left">select_all</i>
                {this.props.selectedCount}
              </a>
            </li>
            <li>
              <a className="btn" onClick={() => this.onCloseSelected()}>
                <i className="material-icons left">clear_all</i>
                Close Selected
              </a>
            </li>
            <li>
              <a className="btn" onClick={this.onDisplayTabs.bind(this)}>
                <i className="material-icons left">input</i>
                Show itemli
              </a>
            </li>
            <li>
              <a className="btn" onClick={this.sendToServer.bind(this)}>
                <i className="material-icons left">send</i>
                Save selected
              </a>
            </li>
          </ul>
        </div>
      )
    } else {
      const { settings } = this.props

      if (settings) {
        return (
          <div>
            <a className="btn" onClick={() => this.onShowSettings()}>
              <i className="material-icons left">settings</i>
              `Connecting to server {settings.currentApi}... `
            </a>
          </div>
        )
      } else {
        return <div>`Read settings... `</div>
      }
    }
  }

  renderContent() {
    return (
      <div className="content">
        <ul className="collection">{this.renderTabs()}</ul>
      </div>
    )
  }

  renderTabs() {
    if (!this.props.windowTabs) return <div />

    return this.props.windowTabs.map(tab => {
      return <Article key={tab.id} tab={tab.toJS()} />
    })
  }
  render() {
    const { showSettings } = this.props
    if (!showSettings) {
      return (
        <div>
          {this.renderButtons()}
          <div className="collection">{this.renderContent()}</div>
        </div>
      )
    } else {
      return (
        <div>
          <Settings />
        </div>
      )
    }
  }
  onInputChange(tagTitle) {
    this.setState({ tagTitle })
  }
}

function mapStateToProps(store) {
  return {
    windowTabs: mapToArr(store.data.tabs),
    selectedCount: store.data.selectedCount,
    serverConnected: store.state.serverConnected,
    serverNeedAuth: store.state.serverNeedAuth,
    socketConnected: store.state.socketConnected,
    retryConnectServer: store.state.retryConnectServer,
    tabsSaved: store.state.tabsSaved,
    showSettings: store.state.showSettings,
    settings: store.state.settings
  }
}

export default connect(
  mapStateToProps,
  {
    checkServer,
    storeCurrentTabs,
    sendTabs,
    tabChangeSelectAll,
    settingsEdit,
    settingsCheck
  }
)(App)
