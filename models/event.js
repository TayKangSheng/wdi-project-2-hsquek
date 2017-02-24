const mongoose = require('mongoose')
const Attachment = require('./attachment')

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Event name is required' ]
  },
  date: {
    type: Date,
    required: [ true, 'Date is required' ]
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
    default: 'proposed'
  },
  attachments: {
    type: [Attachment.Schema]
  },
  familyGroup: mongoose.Schema.Types.ObjectId
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
