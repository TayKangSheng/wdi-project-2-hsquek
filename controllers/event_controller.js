// const mongoose = require('mongoose')
const Event = require('../models/event')

let EventController = {
  listAll: function (req, res) {
    Event.find({}, function (err, foundEvents, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.send('all Events listed')
    })
  },

  listOne: function (req, res) {
    Event.findById(req.params.id, function (err, foundEvent, next) {
      if (err) {
        // console.error(err)
        // return next(err)
        res.send('err but listOne')
      }
      res.send('one event listed')
    })
  },

  makeNew: function (req, res) {
    res.send('create form exists on this page')
  },

  createNew: function (req, res) {
    Event.create(req.body, function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.send('New event created')
    })
  },

  edit: function (req, res) {
    res.send('edit form on this page')
  },

  update: function (req, res) {
    Event.findByIdAndUpdate(req.params.id,
      {
        $set: req.body
      },
    (err, updatedEvent, next) => {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.send('item updated')
    })
  },

  delete: function (req, res) {
    Event.findByIdAndRemove(req.params.id, function (err, output, next) {
      if (err) {
        console.error(err)
        return next(err)
      }
      res.send('item removed')
    })
  }
}

module.exports = EventController
