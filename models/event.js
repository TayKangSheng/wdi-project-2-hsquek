// what do events need?

// similar to to-dos

// name
// date
// description
// completed
// venue
// attendees: number/users?
// categories: 2 options: upcoming, proposed
// if upcoming, cannot be edited [block edit if category  = upcoming i.e. status is confirmed]

const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  venue: {
    type: String,
    default: 'To be confirmed'
  },
  attendees: {
    type: Number
  },
  status: {
    type: String,
    enum: ['confirmed', 'proposed'],
    default: 'proposed',
    required: true
  },
  attachments: {
    type: [String]
  }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
