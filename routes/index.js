import bug from 'debug'
const debug = bug('bearded:indexRouter')

import express from 'express'
const router = express.Router()

import passport from 'passport'

import dotty from 'dotty'

router.get('/', function(req, res, next) {
  const viewData = {
    title: 'The Bearded Spider'
  }

  if (req.isAuthenticated()) {
    viewData.user = req.user
  }

  res.render('index', viewData);
});

module.exports = router;
