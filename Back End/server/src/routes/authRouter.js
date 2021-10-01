// @ts-check

/**
 * TODO
 * 1. 회원가입할 때 어떤 정보를 얼마나 어떻게 받을 것인가
 * 2. 세션을 얼마나 유지할 것인가 -> redis로 변경 방법 알아보기
 * 3. 여러 기기에서 접속 가능하게 할 것인가
 * 4. 유저 정보 업데이트를 위한 라우터
 * 5. 비밀번호 찾기 구현
 * 6. 다른 sns 아이디로 로그인 구현 (not mvp)
 */

const { Router } = require('express')
const passport = require('passport')
// const { hash, compare } = require('bcryptjs') // 암호화 모듈
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication')

const User = require('../schemas/User')

const authRouter = Router()

/** 확인용 */
authRouter.get('/', (req, res) => {
  res.send('auth route')
})

/** 회원가입 */
// 현재는 이메일 안 받는 걸로?
authRouter.post('/register', isNotLoggedIn, async (req, res, next) => {
  const { id, password } = req.body
  try {
    // 비밀번호가 너무 긴 경우
    if (password.length > 12) {
      throw new Error('too long password! please less than 6 characters')
    }
    // 비밀번호가 너무 짧은 경우
    if (password.length < 3) {
      throw new Error('too short password! please more than 3 characters')
    }

    // 이미 해당 아이디가 있는 경우
    const doesIdAlreadyExist = await User.findOne({ id })
    // const doesIdAlreadyExist = await User.findOne({ where: { id } })
    if (doesIdAlreadyExist) {
      throw new Error(`The ID already exist!`)
    }

    // 비밀번호 암호화
    // const hashedPassword = await hash(password, 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 유저 생성
    const nowCreatedUser = await new User({
      id: req.body.id,
      // email: req.body.email,
      hashedPassword
      // session: [{ createAt: new Date() }]
    }).save()

    // const currentSession = nowCreatedUser.session[0]
    res.json({
      message: 'user register',
      // eslint-disable-next-line no-underscore-dangle
      // sessionId: currentSession._id,
      id: nowCreatedUser.id
    })
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 로그인 */
authRouter.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError)
      return next(authError)
    }
    if (!user) {
      return next('login error')
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError)
        return next(loginError)
      }
      return res.send('log in !')
    })
  })(req, res, next)

  // try {
  //   const user = await User.findOne({ email: req.body.email })
  //   const isValid = await compare(req.body.password, user.hashedPassword)

  //   // 입력한 정보가 맞지 않을 경우
  //   if (!isValid) {
  //     throw new Error('invalid information')
  //   }

  //   user.session.push({ createAt: new Date() })
  //   const currentSession = user.session[user.session.length - 1]
  //   await user.save()

  //   res.json({
  //     message: 'user validated ',
  //     // eslint-disable-next-line no-underscore-dangle
  //     sessionId: currentSession._id,
  //     id: user.id
  //   })
  // } catch (err) {
  //   // @ts-ignore
  //   res.status(400).json({ message: err.message })
  // }
})

/** 로그아웃 */
authRouter.get('/logout', isLoggedIn, (req, res) => {
  req.logout()
  // @ts-ignore
  req.session.destroy()
  res.send('logout')

  // try {
  //   // @ts-ignore
  //   const { user } = req
  //   const { sessionid } = req.headers
  //   if (!user) {
  //     throw new Error('invalid sessionid')
  //   }
  //   await User.updateOne(
  //     // @ts-ignore
  //     // eslint-disable-next-line no-underscore-dangle
  //     { _id: user._id },
  //     { $pull: { session: { _id: sessionid } } }
  //   )

  //   res.json({ message: 'user is logged out' })
  // } catch (err) {
  //   // @ts-ignore
  //   res.status(400).json({ message: err.message })
  // }
})

module.exports = { authRouter }
