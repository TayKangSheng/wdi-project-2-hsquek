require('dotenv').config({ silent: true })
const session = require('express-session')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const app = express()

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/wdi-proj-2')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(ejsLayouts)
app.set('view engine', 'ejs')

const UserRouter = require('./routes/user_routes')
const EventRouter = require('./routes/event_routes')
const AlbumRouter = require('./routes/album_routes')

app.use(bodyParser.urlencoded({ extended: true }))

let port = 4001

app.use('/', UserRouter)
app.use('/albums', AlbumRouter)
app.use('/events', EventRouter)

app.listen(port, function () {
  console.log('App is running on port: ' + port)
})
