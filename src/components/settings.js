import React, { Component } from 'react'
import { connect } from 'react-redux'
import { settingsEditCancel } from '../actions'
import TextField from 'material-ui'

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
        <form>
          <TextField id="name" label="Name" margin="normal" />
        </form>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    settings: store.state.settings
  }
}

export default connect(
  mapStateToProps,
  { settingsEditCancel }
)(Settings)
