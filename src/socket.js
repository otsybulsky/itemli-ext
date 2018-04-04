import { BACKEND_SOCKET } from './constants'
import { Socket } from 'phoenix'

let socket = new Socket(BACKEND_SOCKET, { params: { token: window.userToken } })
socket.connect()
// test commit with git console
