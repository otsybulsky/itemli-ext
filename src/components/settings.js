import React, { Component } from 'react'
import { connect } from 'react-redux'
import { settingsEditCancel, settingsEditSave } from '../actions'

import { Row, Col, Icon, Button, Input } from 'react-materialize'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buildVersion: null,
      currentApi: ''
    }
  }

  onCancel() {
    this.props.settingsEditCancel()
  }

  onSave() {
    const { settingsEditSave, settings } = this.props
    const { currentApi } = this.state

    settingsEditSave({
      settings: settings,
      changes: { currentApi }
    })
  }

  onApiChange(currentApi) {
    let mm = currentApi
    if (mm.indexOf('https://') < 0) {
      mm = `https://${mm}`
    }
    this.setState({ currentApi: mm })
  }

  componentDidMount() {
    const { currentApi, buildVersion } = this.props.settings
    this.setState({ currentApi, buildVersion })
  }

  render() {
    const { currentApi, buildVersion } = this.state
    return (
      <div>
        <a className="waves-effect waves-light" onClick={() => this.onCancel()}>
          <i className="material-icons">close</i>
        </a>
        <h5>Settings</h5>
        <Row>
          <Input
            s={12}
            label="API address"
            placeholder="enter api address https://..."
            value={currentApi}
            onChange={ev => this.onApiChange(ev.target.value)}
          />
        </Row>
        <Row>
          <Col s={4}>
            <h6>ver. {buildVersion}</h6>
          </Col>
          <Button className="right" waves="light" onClick={() => this.onSave()}>
            apply<Icon left>save</Icon>
          </Button>
        </Row>
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
  { settingsEditCancel, settingsEditSave }
)(Settings)
