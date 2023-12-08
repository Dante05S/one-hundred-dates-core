/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import userController from '../../controllers/user'
import { publicRoute } from '../../middlewares/publicRoute'
import { validateParam } from '../../middlewares/validateParam'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get(
  '/generate-couple-code',
  authenticate,
  userController.generateCoupleCode
)

router.get(
  '/:email',
  publicRoute,
  validateParam('string'),
  userController.getByEmail
)

export default router
