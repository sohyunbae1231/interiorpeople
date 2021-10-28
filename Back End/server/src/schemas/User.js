const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', UserSchema)
