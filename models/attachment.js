const mongoose = require('mongoose')

const attachmentSchema = new mongoose.Schema({
  url: String
})

const Attachment = mongoose.model('Attachment', attachmentSchema)

module.exports = Attachment
