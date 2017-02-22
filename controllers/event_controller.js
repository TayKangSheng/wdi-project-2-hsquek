// const mongoose = require('mongoose')
const async = require('async')
const Event = require('../models/event')
const cloudinary = require('cloudinary')

let EventController = {
  listAll: function (req, res) {
    Event.find({}, function (err, foundEvents, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.render('event/index', {
        foundEvents: foundEvents
      })
    })
  },

  listOne: function (req, res) {
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

  makeNew: function (req, res) {
    res.render('event/create')
  },

  createNew: function (req, res) {
    // var arr = []
    //
    Event.create({
      name: req.body.events.name,
      date: req.body.events.date,
      status: req.body.events.status,
      attendees: req.body.events.attendees,
      venue: req.body.events.venue,
      description: req.body.events.description,
      attachments: []
    }, function (err, createdEvent) {
      if (err) {
        console.error()
        return
      }
      createdEvent.imgLoad(req.files, function () {
        createdEvent.save(function (err, final, next) {
          if (err) {
            console.error(err)
            return next(err)
          }
          console.log(final)
          res.redirect('/events')
        })
      })
    })
    // let newEvent = new Event({
    //   name: req.body.events.name,
    //   date: req.body.events.date,
    //   status: req.body.events.status,
    //   attendees: req.body.events.attendees,
    //   venue: req.body.events.venue,
    //   description: req.body.events.description,
    //   attachments: []
    // })

    // console.log(newEvent);

    // newEvent.imgUpload (req.files, function () {
    //   // console.log(newEvent.attachments)
    //
    //   newEvent.save(function (err, createdEvent, next) {
    //     if (err) {
    //       console.error(err);
    //       return next(err)
    //     }
    //     res.redirect('/events')
    //   })
    // })

    // async.series([
    //   function (callback) {
    //     for (var i = 0; i < req.files.length; i++) {
    //       cloudinary.uploader.upload(req.files[i].path, function (result) {
    //         console.log(result.url)
    //
    //         newEvent.attachments.push(result.url)
    //       })
    //     }
    //     callback()
    //   },
    //   function (callback) {
    //     console.log(`this should come second`);
    //     newEvent.save(function (err, output) {
    //       if (err) {
    //         console.error(err)
    //         return callback(err)
    //       }
    //       callback()
    //     })
    //   }
    // ], function (err) {
    //   if (err) {
    //     return next(err)
    //   }
    //   res.redirect('/events')
    // })

    // cloudinary.uploader.upload(req.file.path, function (result) {
    //   let newEvent = new Event({
    //     name: req.body.events.name,
    //     date: req.body.events.date,
    //     status: req.body.events.status,
    //     attendees: req.body.events.attendees,
    //     venue: req.body.events.venue,
    //     description: req.body.events.description,
    //     attachments: result.url
    //   })
    //
    //   newEvent.save(function (err, output, next) {
    //     if (err) return next(err)
    //     res.redirect('/events')
    //   })
    // })
  },

  editForm: function (req, res) {
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

  updateExisting: function (req, res) {
    Event.findByIdAndUpdate(req.params.id,
      {
        $set: {
          name: req.body.events.name,
          date: req.body.events.date,
          status: req.body.events.status,
          attendees: req.body.events.attendees,
          venue: req.body.events.venue,
          description: req.body.events.description,
          attachments: req.body.events.attachments
        }
      },
    function (err, updatedEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.redirect('/events/' + updatedEvent.id)
    })
  },

  deleteRecord: function (req, res) {
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
