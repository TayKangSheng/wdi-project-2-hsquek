const mongoose = require('mongoose')
const Attachment = require('./attachment')

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
    type: [Attachment.Schema]
  }
})

// eventSchema.methods.imgUpload = function (allImages, callback) {
//   var thisEvent = this.toObject()
//   for (var i = 0; i < allImages.length; i++) {
//     cloudinary.uploader.upload(allImages[i].path,function (result) {
//       thisEvent.attachments.push(result.url.toString())
//       // console.log(thisEvent.attachments)
//     })
//   }
//   return callback(null, thisEvent)
// }

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
