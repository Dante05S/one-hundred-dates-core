/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import authController from '../../controllers/auth'
import { authRefresh } from '../../middlewares/authRefresh'
import { publicRoute } from '../../middlewares/publicRouter'
import {
  validateLoginSchema,
  validateRegisterSchema,
  validateRequestCodeSchema,
  validateResendCodeSchema
} from '../../validators/auth'
import { validateBody } from '../../middlewares/validateBody'

const router = Router()

router.get('/refresh', authRefresh, authController.refresh)
router.post(
  '/register',
  publicRoute,
  validateBody(validateRegisterSchema()),
  authController.register
)
router.post(
  '/login',
  publicRoute,
  validateBody(validateRequestCodeSchema()),
  authController.login
)
router.post(
  '/validate-code',
  publicRoute,
  validateBody(validateLoginSchema()),
  authController.validateCode
)
router.post(
  '/resend-code',
  publicRoute,
  validateBody(validateResendCodeSchema()),
  authController.resendCode
)

export default router
