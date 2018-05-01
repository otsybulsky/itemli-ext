import React, { Component } from 'react'

class Article extends Component {
  render() {
    const { tab } = this.props
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
  }
}

export default Article
