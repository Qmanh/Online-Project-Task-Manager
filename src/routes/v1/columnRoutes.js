import express from 'express'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleWare'
import { columnValidation } from '~/validations/columnValidation'

const router = express.Router()

router.route('/')
  .post(authMiddleware.isAuthorized, columnValidation.createNew, columnController.createNew)

router.route('/:id')
  .put(authMiddleware.isAuthorized, columnValidation.updateColumnDetails, columnController.updateColumnDetails)
  .delete(authMiddleware.isAuthorized, columnValidation.deleteColumnDetails, columnController.deleteColumnDetails)
export const columnRoute = router