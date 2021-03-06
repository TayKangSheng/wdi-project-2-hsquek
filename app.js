require('dotenv').config({ silent: true })
const session = require('express-session')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const logger = require('morgan')
const app = express()

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

app.use(ejsLayouts)
// app.use(logger('dev'))
// app.use(express.static('public'))
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 36000000 },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true
  })
}))
app.use(passport.initialize())
app.use(passport.session())
require('./config/ppConfig')(passport)

app.use(flash())

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

const AuthRouter = require('./routes/auth_routes')
const EventRouter = require('./routes/event_routes')
const AlbumRouter = require('./routes/album_routes')
const FamilyRouter = require('./routes/family_routes')
const helpers = require('./middleware/helpers')

app.use(bodyParser.urlencoded({ extended: true }))

let port = process.env.PORT || 4000


app.use(function (req, res, next) {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()

  next()
})

app.use('/', AuthRouter)
app.use('/family', helpers.needLogin, FamilyRouter)
app.use('/albums', helpers.needLogin, helpers.needFamilyTag, AlbumRouter)
app.use('/events', helpers.needLogin, helpers.needFamilyTag, EventRouter)

// app.use(function (err, req, res, next) {
//   if (!res.headersSent) {
//     res.send({
//       message: err.message
//     })
//   }
// })

app.listen(port, function () {
  console.log('App is running on port: ' + port)
})
