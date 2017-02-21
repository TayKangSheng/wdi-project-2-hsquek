// const mongoose = require('mongoose')
const Event = require('../models/event')

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
    let newEvent = new Event({
      name: req.body.events.name,
      date: req.body.events.date,
      status: req.body.events.status,
      attendees: req.body.events.attendees,
      venue: req.body.events.venue,
      description: req.body.events.description,
      attachments: req.body.events.attachments
    })

    newEvent.save(function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      console.log(output)
      res.redirect('/events')
    })
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
      console.log('removed' + req.params.id);
      res.redirect('/events')
    })
  }
}

module.exports = EventController
