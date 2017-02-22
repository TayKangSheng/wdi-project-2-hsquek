const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    required: true,
    type: String
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
