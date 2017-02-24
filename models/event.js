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
    type: String
  },
  completed: {
    type: Boolean
  },
  venue: {
    type: String
  },
  status: {
    type: String,
    enum: ['confirmed', 'proposed']
  },
  attachments: {
    type: [Attachment.Schema],
    maxlength: 3
  },
  familyGroup: mongoose.Schema.Types.ObjectId
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
