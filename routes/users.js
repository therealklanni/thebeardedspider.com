import express from 'express'
import User from '../lib/models/user'
const router = express.Router()

router.get('/', (req, res) => {
  User.find((err, users) => {
    res.render('users', { users })
  })
})

export default router
