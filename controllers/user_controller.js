const mongoose = require('mongoose')

let UserController = {
  getHomePage: function (req, res) {
    res.send('render home page')
  },

  getSignUp: function (req, res) {
    res.send('render sign up form')
  },

  getLogIn: function (req, res) {
    res.send('render log in form')
  },

  postSignUp: function (req, res) {
    res.send('create new account if no account, redirect on successful creation, refresh signup if not')
  },

  postLogIn: function (req, res) {
    res.send('authenticate the log in here, redirect on success, refresh if not')
  },

  logOut: function (req, res) {
    res.send('redirect to home on successful logout')
  }
}

module.exports = UserController;
