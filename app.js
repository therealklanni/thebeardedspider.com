import path from 'path'
import logger from 'morgan'
import express from 'express'
// import favicon from 'serve-favicon'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import xhbs from 'express-handlebars'
import sassMiddleware from 'node-sass-middleware'
import session from 'express-session'

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', xhbs({
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/styles', sassMiddleware({
  debug: process.env.NODE_ENV !== 'production',
  force: process.env.NODE_ENV !== 'production',
  response: true,
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public/styles'),
  outputStyle: 'compressed',
  sourceMap: true
}))

app.use('/styles/vendor/normalize.css',
  express.static(path.join(__dirname, 'node_modules/normalize.css/normalize.css')))
app.use(express.static(path.join(__dirname, 'public')))

import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session)

import mongooseConnection from './lib/mongo'

app.use(session({
  secret: 'grant',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection })
}))

import passport from 'passport'

app.use(passport.initialize())
app.use(passport.session())

import localMiddleware from './lib/middleware/local'

app.use(localMiddleware)

import auth from './lib/auth'
import routes from './routes/index'
import users from './routes/users'
import login from './routes/login'
import api from './routes/api/v1'

app.use('/', routes)
app.use('/login', login)
app.use('/auth', auth)
app.use('/users', users)
app.use('/api/v1', api)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
