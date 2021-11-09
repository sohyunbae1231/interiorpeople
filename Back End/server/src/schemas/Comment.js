const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, default: '' },
    post_id: { type: String, required: true, default: '' },
    content: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)
