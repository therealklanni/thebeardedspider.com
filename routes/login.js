import express from 'express'
import User from '../lib/models/user'
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('login')
})

export default router
