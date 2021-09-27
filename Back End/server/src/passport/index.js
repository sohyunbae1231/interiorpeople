const passport = require('passport')

const User = require('../schemas/User.js')

// const local = require('./localStrategy')
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser((email, done) => {
    User.findOne({ email }).then
  })
}
