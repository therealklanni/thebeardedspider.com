import bug from 'debug'
const debug = bug('bearded:indexRouter')

import express from 'express'
const router = express.Router()

import dotty from 'dotty'

router.get('/', function(req, res, next) {
  const viewData = {
    title: 'The Bearded Spider'
  }

  if (req.isAuthenticated()) {
    let user = req.user
    user.logo = user.logo || `https://robohash.org/${req.user.displayName}.png?set=set3`
    viewData.user = user
  }

  res.render('index', viewData);
});

module.exports = router;
