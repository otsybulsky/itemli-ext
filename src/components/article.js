import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tabChangeSelect } from '../actions'

class Article extends Component {
  onSelectTab(event) {
    const { tab, tabChangeSelect } = this.props
    tabChangeSelect({ tab })
    event.stopPropagation()
  }

  onClickTab(event) {
    const { tab } = this.props
    chrome.tabs.update(tab.id, { active: true })
    event.stopPropagation()
  }

  render() {
    const { tab } = this.props
    return (
      <a className="collection-item" key={tab.id}>
        <label>
          <input
            key={tab.id}
            type="checkbox"
            onClick={ev => this.onSelectTab(ev)}
            checked={tab.selected ? 'checked' : ''}
          />
          <span>&nbsp;</span>
        </label>
        <h6 onClick={ev => this.onClickTab(ev)}>{tab.title}</h6>
      </a>
    )
  }
}

export default connect(null, { tabChangeSelect })(Article)
