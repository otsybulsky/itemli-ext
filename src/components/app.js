import React, { Component } from 'react'
import { connect } from 'react-redux'
import { testEvent } from '../actions'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { tabs: [], renderTabs: null }
  }

  componentWillMount() {
    const _tabs = []

    chrome.tabs.query({ currentWindow: true }, tabs => {
      tabs.map(tab => {
        const { index, title, url, favIconUrl } = tab
        const item = { index, title, url, favIconUrl }
        _tabs.push(item)
      })
    })

    this.setState({ tabs: _tabs })
  }

  renderTabs() {
    if (!this.state.renderTabs) return <div />
    return this.state.tabs.map(tab => {
      return (
        <li className="collection-item">
          <a target="_blank" href={tab.url}>
            {tab.title}
          </a>
        </li>
      )
    })
  }

  onTest() {
    this.setState({ renderTabs: true })
    console.log('send test from App onTest')
    this.props.testEvent()
  }

  render() {
    console.log('RENDER App', this.state, this.props)
    return (
      <div>
        <h5>Itemli extension</h5>
        <button className="btn indigo" onClick={this.onTest.bind(this)}>
          <i class="material-icons left">input</i>
          Get tabs list
        </button>
        <ul className="collection">{this.renderTabs()}</ul>
        <Nested />
      </div>
    )
  }
}

function mapStateToProps(store) {
  return { appState: store.state }
}

export default connect(mapStateToProps, { testEvent })(App)
