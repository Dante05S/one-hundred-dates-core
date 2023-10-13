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
import { contentType } from '../../middlewares/content_type'

const router = Router()

router.post(
  '/register',
  publicRoute,
  contentType,
  validateBody(validateRegisterSchema()),
  authController.register
)
router.post(
  '/login',
  publicRoute,
  contentType,
  validateBody(validateLoginSchema()),
  authController.login
)
router.post(
  '/request-code',
  publicRoute,
  contentType,
  validateBody(validateRequestCodeSchema()),
  authController.requestCode
)
router.post(
  '/resend-code',
  publicRoute,
  contentType,
  validateBody(validateResendCodeSchema()),
  authController.resendCode
)

export default router
