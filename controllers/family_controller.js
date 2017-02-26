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
            message: families[i].name
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
        if (err) {
          console.error(err)
          return
        }
        res.redirect('/family')
      })
    })
  },

  updateForm: function (req, res, next) {
    Family.findById(req.params.id, function (err, foundFamily, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('family/updatefamily', {
        foundFamily: foundFamily
      })
    })
  },

  updateFamily: function (req, res, next) {
    Family.findById(req.params.id, function (err, foundFamily) {
      if (err) {
        console.error(err)
        return next(err)
      }

      var toRemove = req.body.pullMembers
      var thisArr = foundFamily.members

      if (toRemove) {
        if (!Array.isArray(toRemove)) {
          let idx = (function () {
            for (var i = 0; i < thisArr.length; i++) {
              if (thisArr[i] === toRemove) {
                return i
              }
            }
          })()

          thisArr.splice(idx, 1)
        } else {
          var spliceIdxArr = []
          for (var j = 0; j < toRemove.length; j++) {
            for (var n = 0; n < thisArr.length; n++) {
              if (thisArr[n] === toRemove[j]) {
                if (!spliceIdxArr.includes(n)) {
                  spliceIdxArr.push(n)
                }
              }
            }
          }
          spliceIdxArr.sort()
          for (var x = spliceIdxArr.length - 1; x >= 0; x--) {
            thisArr.splice(spliceIdxArr[x], 1)
          }
        }
      }

      if (req.body.email.length) {
        User.findOne({ 'local.email': req.body.email }, function (err, userFound) {
          if (err) {
            console.error(err)
            return next(err)
          }

          if (!userFound) {
            console.log('no user found')
            foundFamily.members.push(req.body.email)
            let newUser = new User({
              local: {
                email: req.body.email,
                password: User.encrypt('password', 10)
              },
              familyGroup: req.user.familyGroup
            })

            newUser.save()
            foundFamily.save()
            res.redirect('/family')
          } else {
            console.log('user found')
            foundFamily.members.push(req.body.email)
            foundFamily.save()
            res.redirect('/family')
          }
        })
      } else {
        foundFamily.save()
        res.redirect('/family')
      }
    })
  },

  changePasswordForm: function (req, res, next) {
    // enable user to change password (do after mvp is done)
  },

  deleteFamily: function (req, res, next) {
    Family.findByIdAndRemove(req.params.id, function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }

      res.redirect('/family')
    })
  }

}

module.exports = FamilyController
