import { createConfirmation } from 'react-confirm'
import ConfirmDialog from './confirm-dialog'

// create confirm function
const confirm = createConfirmation(ConfirmDialog)

// This is optional. But I recommend to define your confirm function easy to call.
export default function(confirmation, options = {}) {
  // You can pass whatever you want to the component. These arguments will be your Component's props
  console.log('...confirm')
  return confirm({ confirmation, options })
}
