const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Family = require('../models/familyAccount')
const User = require('../models/user')
const helpers = require('../middleware/helpers')

let FamilyController = {

  listFamily: function (req, res, next) {
    Family.find({}, function (err, families, next) {
      if (err) {
        console.error(err)
        return next(err)
      }

      for (var i = 0; i < families.length; i++) {
        if (families[i].members.includes(req.user.local.email)) {
          res.render('family/index', {
            family: families[i],
            message: families[i].id + ' ' + families[i].name
          })
          return
        }
      }
      res.render('family/index', {
        family: null,
        message: 'family not found. create a family account'
      })
    })
  },

  newFamily: function (req, res, next) {
    res.render('family/createfamily')
  },

  addFamily: function (req, res, next) {
    let newFamily = new Family({
      name: req.body.name,
      owner: req.user.id,
      members: [req.user.local.email]
    })
    console.log(newFamily)
    User.findByIdAndUpdate(req.user.id, {
      familyGroup: newFamily._id
    }, function (err, updatedUser, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      newFamily.save(function (err, newFamily, next) {
        helpers.handleValidationErr(err, res, req, '/family')
        res.redirect('/family')
        // res.send('family created')
      })
    })
  },

  newUser: function (req, res, next) {
    res.render('family/newuser')
  },

  createUser: function (req, res, next) {
    let newUser = new User({
      local: {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync('password', 10)
      }
    })
    newUser.save(function (err, newUser) {
      helpers.handleValidationErr(err, res, req, '/family/newuser')
      res.redirect('family')
    })
  },

  pushUserForm: function (req, res, next) {
    Family.findById(req.params.id, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('family/pushuser', {
        foundFamily: foundFamily
      })
    })
  },

  pushUser: function (req, res, next) {
    Family.findById(req.params.id, function (err, foundFamily) {
      if (err) {
        console.error(err)
        return next(err)
      }
      // let newUser = new User({
      //   local: {
      //     name: req.body.name,
      //     email: req.body.email,
      //     password: bcrypt.hashSync('password', 10)
      //   },
      //   familyGroup: req.user.familyGroup
      // })
      // foundFamily.members.push(newUser.local.email)
      // newUser.save()
      // foundFamily.save()
      // res.redirect('/family')
      let newUser = {
        local: {
          name: req.body.name,
          email: req.body.email,
          password: User.encrypt('password')
        },
        familyGroup: req.user.familyGroup
      }

      User.create(newUser, function (err, output) {
        if (err) {
          console.log(err)
          if (err.name === 'ValidationError') {
            let errMessages = []
            for (var field in err.errors) {
              errMessages.push(err.errors[field].message)
            }

            req.flash('flash', {
              type: 'danger',
              message: errMessages
            })
            res.redirect('/')
          }

          return next(err)
        }

        foundFamily.members.push(newUser.local.email)
        foundFamily.save()
        req.flash('flash', {
          type: 'success',
          message: 'Created user with email: ' + output.email
        })
        res.redirect('/')
      })
    })
  },

  deleteUserForm: function (req, res, next) {
    Family.findById(req.params.id, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('family/removeuser', {
        foundFamily: foundFamily
      })
    })
  },

  deleteUser: function (req, res, next) {
    if (req.user.local.email === req.body.email) {
      req.flash('flash', {
        type: 'warning',
        message: 'cannot remove self'
      })
      res.render('home', {
        flash: req.flash('flash')[0]
      })
    }

    Family.findByIdAndUpdate(req.params.id, {
      $pull: { members: req.body.email }
    }, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      req.flash('flash', {
        type: 'success',
        message: 'user deleted'
      })
      res.render('home', {
        flash: req.flash('flash')[0]
      })
    })
  },

  changePasswordForm: function (req, res, next) {
    // enable user to change password (do after mvp is done)
  }

}

module.exports = FamilyController
