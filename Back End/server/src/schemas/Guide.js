const mongoose = require('mongoose')

const GuideSchema = new mongoose.Schema(
  {
    createdAt: { type: Date, required: true },
    title: { type: String, required: true },
    contents: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('guide', GuideSchema)
