import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkServer, storeCurrentTabs, tabChangeSelect } from '../actions'
import { sendTabs } from '../actions/socket'
import { BACKEND_URL } from '../constants'

import Article from './article'

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

    const firstTab = this.props.windowTabs[0]

    // if (tabsSaved) {
    //   this.props.windowTabs.map(item => {
    //     if (item.index > 0) {
    //       chrome.tabs.remove(item.id)
    //     }
    //   })
    // }

    if (firstTab.url.indexOf(portalUrl) < 0) {
      chrome.tabs.create({
        url: `${absolutePath}`,
        index: 0
      })
      // if (tabsSaved) {
      //   chrome.tabs.remove(firstTab.id)
      // }
    } else {
      console.log(firstTab.url, absolutePath)
      if (firstTab.url === absolutePath) {
        chrome.tabs.update(firstTab.id, { active: true })
      } else {
        chrome.tabs.update(firstTab.id, { url: absolutePath, active: true })
      }
    }

    //window.close()
  }

  onDisplayTabs() {
    this.activatePortal('app')
  }

  sendToServer() {
    const { serverConnected, socketConnected } = this.props
    if (serverConnected && socketConnected) {
      this.props.sendTabs({
        tag_title: this.state.tagTitle,
        tabs: this.props.windowTabs
      })
    }
  }

  renderButtons() {
    const { serverConnected, socketConnected } = this.props
    if (serverConnected && socketConnected) {
      return (
        <div>
          <button className="btn">
            <i class="material-icons">select_all</i>
          </button>

          <button className="btn" onClick={this.onDisplayTabs.bind(this)}>
            <i class="material-icons left">input</i>
            Show itemli
          </button>

          <button className="btn" onClick={this.sendToServer.bind(this)}>
            <i class="material-icons left">send</i>
            Save selected
          </button>
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
      return <ul className="collection">{this.renderTabs()}</ul>
    } else {
      return null
    }
  }

  renderTabs() {
    if (!this.props.windowTabs) return <div />

    return this.props.windowTabs.map(tab => {
      return (
        <a
          className="collection-item"
          key={tab.id}
          target="_blank"
          href={tab.url}
        >
          <label>
            <input
              key={tab.id}
              type="checkbox"
              checked={tab.selected ? 'checked' : ''}
            />
            <span>&nbsp;</span>
          </label>
          <h6>{tab.title}</h6>
        </a>
      )
    })
  }
  render() {
    return (
      <div>
        {this.renderButtons()}
        <input
          className="input-field"
          placeholder="Enter tag name"
          value={this.state.tagTitle}
          onChange={event => this.onInputChange(event.target.value)}
        />
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
    windowTabs: store.state.windowTabs,
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
  tabChangeSelect,
  sendTabs
})(App)
