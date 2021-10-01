const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    // email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    session: [{ createAt: { type: Date, required: true } }]
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', UserSchema)
