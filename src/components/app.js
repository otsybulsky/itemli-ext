import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkServer, storeCurrentTabs } from '../actions'
import { BACKEND_URL } from '../constants'

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

  onDisplayTabs() {
    const managerUrl = `${BACKEND_URL}/app`
    const firstTab = this.props.windowTabs[0]

    if (firstTab.url !== managerUrl) {
      chrome.tabs.create({
        url: managerUrl,
        index: 0
      })
    } else {
      chrome.tabs.update(firstTab.id, { active: true })
    }
    window.close()
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
  return { windowTabs: store.state.windowTabs }
}

export default connect(mapStateToProps, { checkServer, storeCurrentTabs })(App)
