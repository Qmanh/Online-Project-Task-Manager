//cau hinh socket io
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constant'
export const socket = io(API_ROOT)