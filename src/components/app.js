import React, { Component } from 'react'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { tabs: [] }
  }

  componentDidMount() {
    this.setState({ tabs: [], renderTabs: null })
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
    this.setState({ tabs: [] })

    chrome.tabs.query({ currentWindow: true }, tabs => {
      tabs.map(tab => {
        const { index, title, url, favIconUrl } = tab
        const item = { index, title, url, favIconUrl }
        this.setState({ tabs: [...this.state.tabs, item] })
      })
      this.setState({ renderTabs: true })
    })
  }

  render() {
    return (
      <div className="container">
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

export default App
