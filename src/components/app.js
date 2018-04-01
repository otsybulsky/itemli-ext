import React, { Component } from 'react'

import Nested from './nested-component'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { tabs: [] }
  }

  componentDidMount() {
    this.setState({ tabs: [] })

    browser.tabs.query({ currentWindow: true }).then(tabs => {
      tabs.map(tab => {
        const { index, title, url, favIconUrl } = tab
        const item = { index, title, url, favIconUrl }
        this.setState({ tabs: [...this.state.tabs, item] })
      })
    })
  }

  renderTabs() {
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

  render() {
    return (
      <div className="container">
        <h5>Itemli extension</h5>
        <ul className="collection">{this.renderTabs()}</ul>
        <Nested />
      </div>
    )
  }
}

export default App
