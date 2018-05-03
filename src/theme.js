import React from 'react'

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const Theme = props => (
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    {props.children}
  </MuiThemeProvider>
)

export default Theme
