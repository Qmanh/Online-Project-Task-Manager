import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoutes'
import { columnRoute } from '~/routes/v1/columnRoutes'
import { cardRoute } from '~/routes/v1/cardRoutes'
import { userRoute } from './userRoutes'
import { invitationRoute } from './invitationRoutes'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are running...' })
})

// Board APIs
Router.use('/boards', boardRoute)
Router.use('/columns', columnRoute)
Router.use('/cards', cardRoute)
Router.use('/users', userRoute)
Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router