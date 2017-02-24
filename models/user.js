const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  local: {
    name: {
      type: String,
      minlength: [ 5, 'Name should be between 5 and 20 characters'],
      maxlength: [ 20, 'Name should be between 5 and 20 characters']
    },
    email: {
      required: [ true, 'Email is required' ],
      type: String,
      unique: [ true, 'Email is locked to an account' ]
    },
    password: {
      type: String,
      minlength: [ 6, 'Password should be between 6 and 12 characters'],
      maxlength: [ 12, 'Password should be between 6 and 12 characters'],
      required: [ true, 'Password is required' ]
    }
  },
  familyGroup: mongoose.Schema.Types.ObjectId
})

userSchema.statics.encrypt = function (password) {
  return bcrypt.hashSync(password, 10)
}

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
