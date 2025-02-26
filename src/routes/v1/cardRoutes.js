import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleWare'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

import { cardValidation } from '~/validations/cardValidation'

const router = express.Router()

router.route('/')
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)
router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('cardOver'),
    cardValidation.updateCardDetails,
    cardController.updateCardDetails
  )
export const cardRoute = router