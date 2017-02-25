// const mongoose = require('mongoose')
const Event = require('../models/event')
const Attachment = require('../models/attachment')
const cloudinary = require('cloudinary')

let EventController = {
  listAll: function (req, res, next) {
    Event.find({familyGroup: req.user.familyGroup}, function (err, foundEvents, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('event/index', {
        foundEvents: foundEvents
      })
    })
  },

  listOne: function (req, res, next) {
    Event.findById(req.params.id, function (err, foundEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
        // res.send('err but listOne')
      }
      res.render('event/show', {
        foundEvent: foundEvent
      })
    })
  },

  makeNew: function (req, res, next) {
    res.render('event/create')
  },

  createNew: function (req, res, next) {
    let newEvent = new Event({
      name: req.body.events.name,
      date: req.body.events.date,
      status: req.body.events.status,
      attendees: req.body.events.attendees,
      venue: req.body.events.venue,
      description: req.body.events.description,
      familyGroup: req.user.familyGroup
    })
    console.log(req.files)
    if (req.files) {
      if (req.files.length) {
        req.files.forEach(function (file) {
          cloudinary.uploader.upload(file.path, function (result) {
            newEvent.attachments.push({
              url: result.url,
              name: file.originalname
            })
            if (newEvent.attachments.length === req.files.length) {
              newEvent.save(function (err, output) {
                if (err) return err
                res.redirect('/events')
              })
            }
          })
        })
      }
    } else {
      newEvent.save()
      res.redirect('/events')
    }
  },

  editForm: function (req, res, next) {
    Event.findById(req.params.id, function (err, foundEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('event/edit', {
        foundEvent: foundEvent
      })
    })
  },

  updateExisting: function (req, res, next) {
    // console.log(req.body.pullAttachments[0])
    Event.findByIdAndUpdate(req.params.id,
      {
        name: req.body.events.name,
        date: req.body.events.date,
        status: req.body.events.status,
        venue: req.body.events.venue,
        description: req.body.events.description
      },
    function (err, foundEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      // console.log(foundEvent);
      // console.log('1')
      // console.log(req.body.pullAttachments)
      // console.log(foundEvent.attachments)
      var toRemove = req.body.pullAttachments
      var thisArr = foundEvent.attachments

      if (toRemove) {
        if (!Array.isArray(toRemove)) {
          // console.log('index of');
          // console.log(thisArr.indexOf({url: toRemove}));
          let idx = (function () {
            for (var i = 0; i < thisArr.length; i++) {
              if (thisArr[i].url === toRemove) {
                return i
              }
            }
          })()
          // console.log('index is ' + idx);
          thisArr.splice(idx, 1)
        } else {
          var spliceIdxArr = []
          for (var j = 0; j < toRemove.length; j++) {
            for (var n = 0; n < thisArr.length; n++) {
              if (thisArr[n].url === toRemove[j]) {
                if (!spliceIdxArr.includes(n)) {
                  spliceIdxArr.push(n)
                }
              }
            }
          }
          console.log('pre spliced arr is ', thisArr);
          spliceIdxArr.sort()
          for (var x = spliceIdxArr.length - 1; x >= 0; x--) {
            thisArr.splice(spliceIdxArr[x], 1)
          }
          console.log('arr after splice is ', thisArr);
        }
      }

      // console.log('2')
      // console.log(foundEvent.attachments)

      var originalLength = foundEvent.attachments.length

      // console.log(originalLength)
      if (req.files.length > 0) {
        // console.log(req.files.length)
        req.files.forEach(function (file) {
          cloudinary.uploader.upload(file.path, function (result) {
            console.log('going into cloudinary')
            foundEvent.attachments.push({
              url: result.url,
              name: file.originalname
            })
            // console.log(result.url)
            // console.log(foundEvent.attachments.length)
            if (foundEvent.attachments.length === originalLength + req.files.length) {
              console.log(foundEvent.attachments.length, originalLength + req.files.length)
              foundEvent.save(function (err, output) {
                if (err) return err
                res.redirect('/events/' + foundEvent.id)
              })
            }
          })
        })
      } else {
        // console.log('event updated with no upload')
        foundEvent.save()
        res.redirect('/events/' + foundEvent.id)
      }
    })
  },

  deleteRecord: function (req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log('removed' + req.params.id)
      res.redirect('/events')
    })
  }
}

module.exports = EventController
