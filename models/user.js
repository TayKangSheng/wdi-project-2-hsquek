const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  local: {
    name: String,
    email: {
      required: true,
      type: String,
      unique: true
    },
    password: String
  }
})

userSchema.statics.encrypt = function (password) {
  return bcrypt.hashSync(password, 10)
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
