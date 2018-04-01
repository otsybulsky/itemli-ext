import React from 'react'
import ReactDOM from 'react-dom'

import Nested from './nested-component'

class Popup extends React.Component {
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
        <li>
          <a target="_blank" href={tab.url}>
            {tab.title}
          </a>
        </li>
      )
    })
  }

  render() {
    console.log('Render Popup')
    return (
      <div>
        <h1>React Component</h1>
        <p>This is an example of a popup UI in React!</p>
        <ul>{this.renderTabs()}</ul>
        <Nested />
      </div>
    )
  }
}

ReactDOM.render(<Popup />, document.getElementById('app'))
