import { BACKEND_SOCKET } from './constants'
import { Socket } from 'phoenix'

let socket = new Socket(BACKEND_SOCKET)
socket.connect()
