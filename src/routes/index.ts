import { Router } from 'express'
import userRouter from './api/user'
import authRouter from './api/auth'
import coupleRouter from './api/couple'
import { ResponseCode, http } from '../helpers/request'

const router = Router()
router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/couple', coupleRouter)

router.get('/', (_req, res) => {
  res.json(
    http.response(null, ResponseCode.OK, 'Welcome to One Hundred Dates!')
  )
})

export default router
