const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Family = require('../models/FamilyAccount')
const User = require('../models/FamilyAccount')

let FamilyController = {

  listFamily: function (req, res) {
    // if req.user.local.email

    Family.find({}, function (err, families, next) {
      if (err) {
        console.error(err)
        return next(err)
      }

      for (var i = 0; i < families.length; i++) {
        if (families[i].members.includes(req.user.local.email)) {
          res.send('family found')
        }
      }

      res.send('cannot find family')
    })

    // Family.findById(id, function (err, foundFamily, next) {
    //   if (err) {
    //     console.error(err)
    //     return next(err)
    //   }
    //   // if user comes under familyacc, show the family
    //   // res.render('family/index/' + foundFamily.id, {
    //   //   family: foundFamily
    //   // })
    //   res.send('show my family here')
    // })
  },

  newFamily: function (req, res) {
    res.send('create form here')
  },

  addFamily: function (req, res) {
    let newFamily = new FamilyAcc({
      name: req.body.name,
      owner: req.user.id
    })
    newFamily.save(function (err, newFamily) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.send('new family created')
    })
  },

  newUser: function (req, res) {
    res.send('user create here')
  },

  createUser: function (req, res) {
    let newUser = new User({
      local: {
        name: req.body.name,
        email: req.body.email,
        password: 'password'
      }
    })
    newUser.save(function (err, newUser) {
      if (err) {
        console.error(err)
        return next(err)
      }
      next()
    })
  },

  pushUser: function (req, res) {
    Family.findById(id, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      if (!foundFamily.members.include(req.body.email)) {
        foundFamily.members.push(req.body.email)
      }
      console.log(foundFamily.members)
      res.send('user pushed')
    })
  },

  deleteUser: function (req, res) {
    Family.findById(id, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log(foundFamily.members.length)
      foundFamily.members = foundFamily.members.splice(foundFamily.indexOf(req.body.email), 1)
      console.log(foundFamily.members.length)
      res.send('user deleted')
    })
  }
}

module.exports = FamilyController
