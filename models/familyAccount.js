const mongoose = require('mongoose')

const familyAccSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: Schema.Types.ObjectId,
  members: [User.Schema]
})

const FamilyAcc = mongoose.model('FamilyAcc', familyAccSchema)

module.exports = FamilyAcc
