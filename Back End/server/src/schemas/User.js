const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    name: { type: String, required: false, default: null },
    profilePhoto: { type: String, required: false, default: null },
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', UserSchema)
