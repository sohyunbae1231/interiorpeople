const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../schemas/User')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, done) => {
        try {
          const doesIdAlreadyExist = await User.findOne({ id })
          if (doesIdAlreadyExist) {
            // 비밀번호 비교
            const result = await bcrypt.compare(password, doesIdAlreadyExist.hashedPassword)
            if (result) {
              done(null, doesIdAlreadyExist)
            } else {
              done(null, false, { message: '입력된 정보가 올바르지 않습니다.' })
            }
          } else {
            done(null, false, { message: '입력된 정보가 올바르지 않습니다.' })
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
          done(err)
        }
      }
    )
  )
}
