const mongoose = require('mongoose')
const Photo = require('./photo')

var albumSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'misc'
  },
  date: Date,
  description: String,
  photos: {
    type: [Photo.Schema]
  }
})

var Album = mongoose.model('Album', albumSchema)

module.exports = Album
