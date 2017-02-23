const mongoose = require('mongoose')

const familyAccSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: mongoose.Schema.Types.ObjectId,
  members: [String]
})

const FamilyAcc = mongoose.model('FamilyAcc', familyAccSchema)

module.exports = FamilyAcc
