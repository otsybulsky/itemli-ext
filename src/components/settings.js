import React, { Component } from 'react'
import { connect } from 'react-redux'
import { settingsEditCancel } from '../actions'

class Settings extends Component {
  onCancel() {
    this.props.settingsEditCancel()
  }

  render() {
    return (
      <div>
        <a className="waves-effect waves-light" onClick={() => this.onCancel()}>
          <i className="material-icons">close</i>
        </a>
        <h5>Settings</h5>
      </div>
    )
  }
}

export default connect(
  null,
  { settingsEditCancel }
)(Settings)
