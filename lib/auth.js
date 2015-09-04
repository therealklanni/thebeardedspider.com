import bug from 'debug'
const debug = bug('bearded:passport')

import assign from 'lodash/object/assign'
import pick from 'lodash/object/pick'
import passport from 'passport'
import { Strategy as TwitchStrategy } from 'passport-twitch'
import User from './models/user'

import express from 'express'
const router = express.Router()

debug('twitch auth', process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET)

const nodeEnv = process.env.NODE_ENV
const baseUrl = nodeEnv === 'production' ?
  process.env.BASE_URL : nodeEnv === 'staging' ?
    'http://1cfa4de0.ngrok.com' : 'http://localhost:3000'

debug('baseUrl', baseUrl)

passport.serializeUser((user, done) => {
  debug('serializeUser', user)
  done(null, user.twitchId)
})

passport.deserializeUser((twitchId, done) => {
  debug('deserializeUser', twitchId)

  User.findOne({ twitchId }, (err, user) => {
    debug('deserializeUser:findOne', err, user)
    done(err, user)
  })
})

passport.use(new TwitchStrategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: `${baseUrl}/auth/twitch/callback`
}, (accessToken, refreshToken, profile, done) => {
  debug('auth success', profile)

  const id = profile.id
  const twitchProfile = assign(
    { twitchId: id },
    pick(profile._json, ['logo', 'bio']),
    pick(profile, ['username', 'displayName', 'email'])
  )

  debug('twitchProfile object', twitchProfile)

  User.findOrCreate({ twitchId: id }, twitchProfile, (err, user, created) => {
    debug('findOrCreate user', err, user, created)
    const twitchId = twitchProfile.twitchId
    const date = {}

    // update user
    if (created) {
      date.createdAt = Date.now()
    } else {
      date.createdAt = user.createdAt || Date.now()
      date.updatedAt = Date.now()
    }

    User.update({ twitchId }, assign(twitchProfile, date), err => {
      debug('updated user')
      return done(err, user)
    })
  })
  // return done(null, twitchProfile)
}))

router.get('/twitch', passport.authenticate('twitch', { scope: ['user_read'] }))

router.get('/twitch/callback', passport.authenticate('twitch', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/twitch/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logout()
  }

  res.redirect('/')
})

export default router
