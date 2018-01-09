const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const index = require('./routes/index')
const users = require('./routes/users')
const auth = require('./routes/authentication')
const post = require('./routes/post')
const mongoose = require('mongoose')
const app = express()

//mongoose connection
mongoose.connection.openUri(`mongodb://${process.env.USERNAMEDB}:${process.env.PASSWORDDB}@cluster0-shard-00-00-xrrgq.mongodb.net:27017,cluster0-shard-00-01-xrrgq.mongodb.net:27017,cluster0-shard-00-02-xrrgq.mongodb.net:27017/jepretgram?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`)
mongoose.Promise = global.Promise;
mongoose.connection.once('open', () => {
  console.log('mongoose connection success');
}).on('error', (error) => {
  console.log('connection error');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use('/', index)
app.use('/api/users', users)
app.use('/api/authentication', auth)
app.use('/api/jepret', post)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
