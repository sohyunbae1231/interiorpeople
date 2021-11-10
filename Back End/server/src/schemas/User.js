const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    name: { type: String, required: false, default: '' },
    s3_profilephoto_img_url: { type: String, default: '' },
    s3_history_img_url: [{ type: String }],
    s3_myphoto_img_url: [{ type: String }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)
