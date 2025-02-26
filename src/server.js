import cors from 'cors'
import { env } from '~/config/environment'
import express from 'express'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from '~/routes/v1'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { corsOptions } from './config/cors'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'


const START_SERVER = () => {
  const app = express()
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())
  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  //cau hinh socket
  //Tao server moi boc app cua express de lam real-time, bao gom express app va da config socket.io
  const server = http.createServer(app)
  //Khoi tao io voi server va cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    //production
    server.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`3.Production: ${env.AUTHOR} running at ${process.env.PORT}`)
    })
  } else {
    //local dev
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(`3.Local Dev: ${env.AUTHOR} running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }
  exitHook(() => {
    console.log('4.Server is shutting down....')
    CLOSE_DB()
    console.log('5.Disconnected from MongoDB....')
  })
}

//IIFE
(async () => {
  try {
    console.log('1.Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected to MongoDB!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
