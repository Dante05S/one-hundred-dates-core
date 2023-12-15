/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import coupleController from '../../controllers/couple'
import { authenticate } from '../../middlewares/authenticate'
import { validateBody } from '../../middlewares/validateBody'
import { validateCoupleCreateSchema } from '../../validators/couple_validator'

const router = Router()

router.post(
  '/',
  authenticate,
  validateBody(validateCoupleCreateSchema()),
  coupleController.create
)

export default router
