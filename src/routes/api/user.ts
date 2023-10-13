/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import userController from '../../controllers/user'
import { publicRoute } from '../../middlewares/publicRoute'
import { validateParam } from '../../middlewares/validateParam'

const router = Router()

router.get(
  '/:email',
  publicRoute,
  validateParam('string'),
  userController.getByEmail
)

export default router
