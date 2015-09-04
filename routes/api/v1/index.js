import bug from 'debug'
const debug = bug('bearded:api')

// import _ from 'lodash'
import dotty from 'dotty'
import express from 'express'

import db from '../../../lib/db'
import requireAuth from '../../../lib/middleware/require-auth'

const router = express.Router()

router.all('*', requireAuth)

router.get('/:resource', (req, res) => {
  const resource = dotty.get(req, 'params.resource')

  db.read(resource)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => {
      debug(err)
      res.sendStatus(500)
    })
})

router.get('/:resource/:id', (req, res) => {
  const resource = dotty.get(req, 'params.resource')
  const id = dotty.get(req, 'params.id')

  db.read(resource, id)
    .then(docs => {
      res.json(docs)
    })
    .catch(err => {
      debug(err)
      res.sendStatus(500)
    })
})

router.post('/:resource', (req, res) => {
  const resource = dotty.get(req, 'params.resource')
  const payload = dotty.get(req, 'body')

  db.create(resource, payload)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      debug(err)
      res.sendStatus(500)
    })
})

router.put('/:resource/:id', (req, res) => {
  const resource = dotty.get(req, 'params.resource')
  const id = dotty.get(req, 'params.id')
  const payload = dotty.get(req, 'body')

  db.update(resource, id, payload)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      debug(err)
      res.sendStatus(500)
    })
})

export default router
