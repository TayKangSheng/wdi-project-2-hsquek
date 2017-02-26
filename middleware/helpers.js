// const express = require('express')
// const passport = require('passport')
// const flash = require('connect-flash')

const helpers = {
  needLogin: function (req, res, next) {
    if (req.isAuthenticated()) {
      next()
    } else {
      req.flash('flash', {
        type: 'warning',
        message: 'please log in first'
      })
      res.render('home', {
        flash: req.flash('flash')[0]
      })
    }
  },

  needLogout: function (req, res, next) {
    if (!req.isAuthenticated()) {
      next()
    } else {
      req.flash('flash', {
        type: 'warning',
        message: 'already logged in'
      })
      res.render('home', {
        flash: req.flash('flash')[0]
      })
    }

  }

  // needFamilyTag: function (req, res, next) {
  //   if (req.user.familyGroup) {
  //     next()
  //   } else {
  //     req.flash('flash', {
  //       type: 'warning',
  //       message: 'please create/join a family group first'
  //     })
  //     res.render('home', {
  //       flash: req.flash('flash')[0]
  //     })
  //   }
  // }
}

module.exports = helpers
