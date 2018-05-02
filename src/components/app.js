import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkServer, storeCurrentTabs } from '../actions'
import { sendTabs } from '../actions/socket'
import { BACKEND_URL } from '../constants'
import { mapToArr } from '../helpers'

import Article from './article'
import { tabChangeSelectAll } from '../actions'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tagTitle: 'new tag'
    }
  }

  componentWillMount() {
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

  componentDidMount() {
    this.props.checkServer()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.serverConnected && nextProps.serverNeedAuth) {
      this.activatePortal('signin')
    }
    if (nextProps.tabsSaved) {
      this.activatePortal('app', true)
    }
  }

  activatePortal(path, tabsSaved) {
    const portalUrl = `${BACKEND_URL}`
    const absolutePath = `${BACKEND_URL}/${path}`

    const { windowTabs } = this.props

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
        tag_title: this.state.tagTitle,
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
    const { windowTabs } = this.props
    const selectedTabs = windowTabs
      .map(tab => tab.toJS())
      .filter(tab => tab.selected)
      .map(item => {
        chrome.tabs.remove(item.id)
      })
    window.close()
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

          <ul>
            <li>
              <a className="btn" onClick={() => this.onSelectAll()}>
                <i class="material-icons left">select_all</i>
                {this.props.selectedCount}
              </a>
            </li>
            <li>
              <a className="btn" onClick={() => this.onCloseSelected()}>
                <i class="material-icons left">clear_all</i>
                Close Selected
              </a>
            </li>
            <li>
              <a className="btn" onClick={this.onDisplayTabs.bind(this)}>
                <i class="material-icons left">input</i>
                Show itemli
              </a>
            </li>
            <li>
              <a className="btn" onClick={this.sendToServer.bind(this)}>
                <i class="material-icons left">send</i>
                Save selected
              </a>
            </li>
          </ul>
        </div>
      )
    } else {
      if (this.props.retryConnectServer) {
        this.props.checkServer()
      }
      return (
        <div>
          <h5>Connecting to server ...</h5>
        </div>
      )
    }
  }

  renderContent() {
    const { serverConnected, socketConnected } = this.props
    if (serverConnected && socketConnected) {
      return (
        <div className="content">
          <ul className="collection">{this.renderTabs()}</ul>
        </div>
      )
    } else {
      return null
    }
  }

  renderTabs() {
    if (!this.props.windowTabs) return <div />

    return this.props.windowTabs.map(tab => {
      return <Article tab={tab.toJS()} />
    })
  }
  render() {
    return (
      <div>
        {this.renderButtons()}
        <div className="collection">{this.renderContent()}</div>
      </div>
    )
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
    tabsSaved: store.state.tabsSaved
  }
}

export default connect(mapStateToProps, {
  checkServer,
  storeCurrentTabs,
  sendTabs,
  tabChangeSelectAll
})(App)
