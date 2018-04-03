import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkServer, storeCurrentTabs } from '../actions'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      //console.log(tabs)
      const _tabs = tabs.map(tab => {
        const { id, index, title, url, favIconUrl } = tab
        return { id, index, title, url, favIconUrl }
      })
      this.props.storeCurrentTabs(_tabs)
    })
  }

  componentDidMount() {
    this.props.checkServer()
  }

  renderTabs() {
    if (!this.props.windowTabs) return <div />
    return this.props.windowTabs.map(tab => {
      return (
        <li className="collection-item">
          <a target="_blank" href={tab.url}>
            {tab.title}
          </a>
        </li>
      )
    })
  }

  onDisplayTabs() {
    const managerUrl = 'http://localhost:4000/app'
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
        <Nested />
      </div>
    )
  }
}

function mapStateToProps(store) {
  return { windowTabs: store.state.windowTabs }
}

export default connect(mapStateToProps, { checkServer, storeCurrentTabs })(App)
