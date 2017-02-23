const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Family = require('../models/FamilyAccount')
const User = require('../models/user')

let FamilyController = {

  listFamily: function (req, res) {
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

  newFamily: function (req, res) {
    // res.send('create form here')
    res.render('family/createfamily')
  },

  addFamily: function (req, res) {
    let newFamily = new Family({
      name: req.body.name,
      owner: req.user.local.id,
      members: [req.user.local.email]
    })
    newFamily.save(function (err, newFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.redirect('/family')
      // res.send('family created')
    })
  },

  newUser: function (req, res) {
    // res.send('user create here')
    res.render('family/newuser')
  },

  createUser: function (req, res) {
    let newUser = new User({
      local: {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync('password', 10)
      }
    })
    // console.log(newUser);
    newUser.save(function (err, newUser) {
      if (err) {
        console.error(err)
        return
      }
      // res.send('new user created')
      res.redirect('family')
    })
  },

  pushUserForm: function (req, res) {
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

  pushUser: function (req, res) {
    Family.findByIdAndUpdate(req.params.id, {
      $push: { members: req.body.email }
    }, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      // console.log(foundFamily.members)
      res.redirect('/family')
    })
  },

  deleteUserForm: function (req, res) {
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

  deleteUser: function (req, res) {
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

  changePasswordForm: function (req, response) {
    // enable user to change password (do after mvp is done)
  }

}

module.exports = FamilyController
