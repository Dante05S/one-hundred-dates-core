/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import coupleController from '../../controllers/couple'
import { authenticate } from '../../middlewares/authenticate'
import { validateBody } from '../../middlewares/validateBody'
import { validateConnectSchema } from '../../validators/couple'

const router = Router()

router.post(
  '/',
  authenticate,
  validateBody(validateConnectSchema()),
  coupleController.connect
)

export default router
