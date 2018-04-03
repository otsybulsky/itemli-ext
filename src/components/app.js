import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkServer, storeCurrentTabs } from '../actions'
import { BACKEND_URL } from '../constants'

import '../socket'

import Nested from './nested-component'

class App extends Component {
  componentWillMount() {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      this.props.storeCurrentTabs(
        tabs.map(tab => {
          const { id, index, title, url, favIconUrl } = tab
          return { id, index, title, url, favIconUrl }
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
  }

  renderTabs() {
    if (!this.props.windowTabs) return <div />

    return this.props.windowTabs.map(tab => {
      return (
        <li className="collection-item" key={tab.id}>
          <a target="_blank" href={tab.url}>
            {tab.title}
          </a>
        </li>
      )
    })
  }

  activatePortal(path) {
    const portalUrl = `${BACKEND_URL}`
    const absolutePath = `${BACKEND_URL}/${path}`

    const firstTab = this.props.windowTabs[0]

    if (firstTab.url.indexOf(portalUrl) < 0) {
      chrome.tabs.create({
        url: `${absolutePath}`,
        index: 0
      })
    } else {
      if (firstTab === absolutePath) {
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

  render() {
    return (
      <div>
        <h5>Itemli extension</h5>
        <button className="btn indigo" onClick={this.onDisplayTabs.bind(this)}>
          <i class="material-icons left">input</i>
          Display tabs list
        </button>
        <ul className="collection">{this.renderTabs()}</ul>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    windowTabs: store.state.windowTabs,
    serverConnected: store.state.serverConnected,
    serverNeedAuth: store.state.serverNeedAuth
  }
}

export default connect(mapStateToProps, { checkServer, storeCurrentTabs })(App)
