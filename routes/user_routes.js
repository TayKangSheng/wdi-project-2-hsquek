const express = require('express')
const Router = express.Router()
const UserController = require('../controllers/user_controller')

Router.get('/', UserController.getHomePage)

Router.get('/signup', UserController.getSignUp)

Router.get('/login', UserController.getLogIn)

Router.post('/signup', UserController.postSignUp)

Router.post('/login', UserController.postLogIn)

Router.get('/logout', UserController.logOut)

module.exports = Router;
