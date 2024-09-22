/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import userController from '../../controllers/user'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/', authenticate, userController.get)

export default router
