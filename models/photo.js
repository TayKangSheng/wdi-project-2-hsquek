const mongoose = require('mongoose')
// photo url: required string
// album name

const photoSchema = new mongoose.Schema({
  title: String,
  url: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  }
})

const Photo = mongoose.model('Photo', photoSchema)

module.exports = {
  Photo,
  photoSchema
}
