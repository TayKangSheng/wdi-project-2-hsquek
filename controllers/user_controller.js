const mongoose = require('mongoose')
const passport = require('passport')


let UserController = {
  getHomePage: function (req, res) {
    res.render('home', {
      flash: req.flash('flash')[0]
    })
  },

  getSignUp: function (req, res) {
    // res.send('render sign up form')
    res.render('auth/signup', {
      flash: req.flash('flash')[0]
    })
  },

  getLogIn: function (req, res) {
    // res.send('render log in form')
    res.render('auth/login', {
      flash: req.flash('flash')[0]
    })
  },

  postSignUp: function (req, res) {
    // res.send('create new account if no account, redirect on successful creation, refresh signup if not')
    var signUpStrategy = passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    })

    return signUpStrategy(req, res)
  },

  postLogIn: function (req, res) {
    // res.send('authenticate the log in here, redirect on success, refresh if not')
    var logInStrategy = passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    })

    return logInStrategy(req, res)
  },

  logOut: function (req, res) {
    req.logout()
    res.redirect('/')
  }
}

module.exports = UserController
