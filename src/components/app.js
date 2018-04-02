import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkServer, storeCurrentTabs } from '../actions'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { renderTabs: null }
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
    this.props.storeCurrentTabs(_tabs)
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
    this.setState({ renderTabs: true })
  }

  render() {
    console.log('RENDER App', 'state', this.state, 'props', this.props)
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
