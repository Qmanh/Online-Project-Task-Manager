import express from 'express'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddleWare'
import { invitationValidation } from '~/validations/invitationValidation'

const router = express.Router()

router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidation.creatNewBoardInvitation, invitationController.creatNewBoardInvitation)
router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getInvitationsByUser)
router.route('/board/:invitationId')
  .put(authMiddleware.isAuthorized, invitationController.updateBoardInvitation)
export const invitationRoute = router