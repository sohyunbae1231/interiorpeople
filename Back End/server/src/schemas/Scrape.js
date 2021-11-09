const mongoose = require('mongoose')

const ScrapeSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, default: '' },
    post_id: { type: String, required: true, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Scrape', ScrapeSchema)
