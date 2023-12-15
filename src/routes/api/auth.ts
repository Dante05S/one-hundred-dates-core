/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import authController from '../../controllers/auth'
import { validateBody } from '../../middlewares/validateBody'
import {
  validateLoginSchema,
  validateRegisterSchema,
  validateRequestCodeSchema,
  validateResendCodeSchema
} from '../../validators/auth_validator'
import { publicRoute } from '../../middlewares/publicRoute'

const router = Router()

router.post(
  '/register',
  publicRoute,
  validateBody(validateRegisterSchema()),
  authController.register
)
router.post(
  '/validate-code',
  publicRoute,
  validateBody(validateLoginSchema()),
  authController.validateCode
)
router.post(
  '/login',
  publicRoute,
  validateBody(validateRequestCodeSchema()),
  authController.login
)
router.post(
  '/resend-code',
  publicRoute,
  validateBody(validateResendCodeSchema()),
  authController.resendCode
)

export default router
