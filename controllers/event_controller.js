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

    if (req.files.length) {
      req.files.forEach(function (file) {
        cloudinary.uploader.upload(file.path, function (result) {
          newEvent.attachments.push({
            url: result.url
          })
          if (newEvent.attachments.length === req.files.length) {
            newEvent.save(function (err, output) {
              if (err) return err
              res.redirect('/events')
            })
          }
        })
      })
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
    // console.log(req.body);
    Event.findByIdAndUpdate(req.params.id, {
      name: req.body.events.name,
      date: req.body.events.date,
      status: req.body.events.status,
      attendees: req.body.events.attendees,
      venue: req.body.events.venue,
      description: req.body.events.description,
      attachments: req.body.events.attachments
    },
    function (err, updatedEvent, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.redirect('/events/' + updatedEvent.id)
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
