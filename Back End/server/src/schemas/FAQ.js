const mongoose = require('mongoose')

const FAQSchema = new mongoose.Schema({}, { timestamps: true })

module.exports = mongoose.model('faq', FAQSchema)
