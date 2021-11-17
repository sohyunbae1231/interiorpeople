const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    user_id: { type: String, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', require: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
    content: { type: String, required: true, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)
