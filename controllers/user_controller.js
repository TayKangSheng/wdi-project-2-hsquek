const mongoose = require('mongoose')
const passport = require('passport')

let UserController = {
  getHomePage: function (req, res, next) {
    res.render('home', {
      flash: req.flash('flash')[0]
    })
  },

  getSignUp: function (req, res, next) {
    res.render('auth/signup', {
      flash: req.flash('flash')[0]
    })
  },

  getLogIn: function (req, res, next) {
    res.render('auth/login', {
      flash: req.flash('flash')[0]
    })
  },

  postSignUp: function (req, res, next) {
    var signUpStrategy = passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true
    })

    return signUpStrategy(req, res, next)
  },

  postLogIn: function (req, res, next) {
    var logInStrategy = passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    })

    return logInStrategy(req, res, next)
  },

  logOut: function (req, res, next) {
    req.logout()
    res.redirect('/')
  }
}

module.exports = UserController
