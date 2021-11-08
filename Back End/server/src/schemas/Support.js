const mongoose = require('mongoose')

const SupportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    contents: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('support', SupportSchema)
