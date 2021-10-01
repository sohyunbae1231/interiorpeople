const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../schemas/User')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password'
      },
      async (id, password, done) => {
        try {
          const exUser = await User.findOne({ id })
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.hashedPassword)
            if (result) {
              done(null, exUser)
            } else {
              done(null, false, { message: 'cannot match information' })
            }
          } else {
            done(null, false, { message: 'cannot match information' })
          }
        } catch (err) {
          console.log(err)
          done(err)
        }
      }
    )
  )
}
