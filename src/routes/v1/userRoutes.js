import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleWare'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { userValidation } from '~/validations/userValidation'


const router = express.Router()

router.route('/register')
  .post(userValidation.createNew, userController.createNew)
router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)
router.route('/login')
  .post(userValidation.loginAccount, userController.loginAccount)
router.route('/logout')
  .delete(userController.logoutAccount)
router.route('/refresh-token')
  .get(userController.refreshToken)
router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.updateAccount,
    userController.updateAccount
  )

export const userRoute = router