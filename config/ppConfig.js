const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    return done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, output) {
      if (err) {
        console.error(err)
        return done(err)
      }
      done(null, output)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    // console.log(req);
    User.findOne({ 'local.email': email }, function (err, found) {
      if (err) {
        console.error(err)
        return done(err)
      }

      if (found) {
        done(null, false, req.flash('flash', {
          type: 'warning',
          message: 'user already exists'
        }))
      } else {
        let newUser = new User({
          local: {
            name: req.body.username,
            email: email,
            password: User.encrypt(password)
          }
        })
        newUser.save(function (err, output) {
          if (err) {
            console.error(err)
            return done(err)
          }
          return done(null, output, req.flash('flash', {
            type: 'success',
            message: 'user created successfully'
          }))
        })
      }
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    User.findOne({'local.email': email}, function (err, found) {
      if (err) {
        console.error(err)
        return done(err)
      }

      if (found.validPassword(password)) {
        return done(null, found, req.flash('flash', {
          type: 'success',
          message: 'welcome back ' + found.local.name + '!'
        }))
      }

      return done(null, false, req.flash('flash', {
        type: 'danger',
        message: 'wrong password provided'
      }))
    })
  }))
}
