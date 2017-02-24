const mongoose = require('mongoose')

const familyAccSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [ true, 'Name already taken' ],
    minlength: [ 5, 'Name should be between 5 and 20 characters' ],
    maxlength: [ 20, 'Name should be between 6 and 12 characters' ]
  },
  owner: mongoose.Schema.Types.ObjectId,
  members: [String]
})

const FamilyAcc = mongoose.model('FamilyAcc', familyAccSchema)

module.exports = FamilyAcc
