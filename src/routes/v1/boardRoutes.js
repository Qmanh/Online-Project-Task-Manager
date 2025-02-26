import express from 'express'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'
import { authMiddleware } from '~/middlewares/authMiddleWare'

const router = express.Router()

router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidation.updateBoardDetails, boardController.updateBoardDetails)

router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = router