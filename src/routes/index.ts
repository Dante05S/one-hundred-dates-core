import { Router } from 'express'
import authRouter from './api/auth'
import userRouter from './api/user'
import { ResponseCode, http } from '../helpers/request'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

router.get('/', (_req, res) => {
  res.json(http.response(null, ResponseCode.OK, 'Welcome to One Hundred Core!'))
})

export default router
