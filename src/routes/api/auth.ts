/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from 'express'
import authController from '../../controllers/auth'
import { authRefresh } from '../../middlewares/authRefresh'

const router = Router()

router.get('/refresh', authRefresh, authController.refresh)

export default router
