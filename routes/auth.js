import express from 'express'
import bug from 'debug'
const debug = bug('bearded:authRoute')
const router = express.Router()

router.get('/', (req, res, next) => {
  debug(req)
})

export default router
