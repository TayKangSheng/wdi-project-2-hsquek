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
            message: families[i].name + ' found'
          })
          return
          // res.send('family found')
        }
      }

      res.render('family/index', {
        message: 'cannot find family'
      })
      // res.send('no family found')
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
    // res.send('create form here')
    res.render('family/createFamily')
  },

  addFamily: function (req, res) {
    let newFamily = new Family({
      name: req.body.name,
      owner: req.user.local.id,
      members: [req.user.local.email]
    })
    newFamily.save(function (err, newFamily) {
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
    res.render('family/newUser')
  },

  createUser: function (req, res) {
    let newUser = new User({
      local: {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync('password', 10)
      }
    })
    console.log(newUser);
    newUser.save(function (err, newUser) {
      if (err) {
        console.error(err)
        return
      }
      res.send('new user created')
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
