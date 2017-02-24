const express = require('express')
const Router = express.Router()
const UserController = require('../controllers/user_controller')
const helpers = require('..//middleware/helpers')

Router.get('/', UserController.getHomePage)

Router.get('/signup', helpers.needLogout, UserController.getSignUp)

Router.get('/login', helpers.needLogout, UserController.getLogIn)

Router.post('/signup', helpers.needLogout, UserController.postSignUp)

Router.post('/login', helpers.needLogout, UserController.postLogIn)

Router.get('/logout', helpers.needLogin, UserController.logOut)

module.exports = Router
