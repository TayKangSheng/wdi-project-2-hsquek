const mongoose = require('mongoose')
const photo = require('./photo.js')

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'misc'
  },
  date: Date,
  photos: [photo.PhotoSchema]
})

const Album = mongoose.model('Album', albumSchema)

module.exports = Album
