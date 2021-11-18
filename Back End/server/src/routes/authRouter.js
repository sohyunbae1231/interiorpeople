// @ts-check

/** 모듈 */
const { Router } = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication')

/** 데이터베이스 관련 */
const User = require('../schemas/User')

const authRouter = Router()

/** 회원가입 */
authRouter.post('/register', isNotLoggedIn, async (req, res) => {
  const { id, password } = req.body
  try {
    // TODO : 프론트에서 확인
    // // 비밀번호가 너무 긴 경우
    // if (password.length > 12) {
    //   throw new Error('비밀번호가 너무 깁니다.')
    // }
    // // 비밀번호가 너무 짧은 경우
    // if (password.length < 3) {
    //   throw new Error('비밀번호가 너무 짧습니다.')
    // }

    // 이미 해당 아이디가 있는 경우
    const doesIdAlreadyExist = await User.findOne({ id })
    if (doesIdAlreadyExist) {
      // return res.redirect('/register?error=exist') // 에러를 주소 뒤에 쿼리스트링으로 표기함
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' })
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 11)

    // 유저 생성
    await new User({
      id: req.body.id,
      hashedPassword,
    }).save()

    return res.status(200).json({ message: '회원가입되었습니다.' })
  } catch (err) {
    // @ts-ignore
    return res.status(400).json({ message: err.message })
  }
})

/** 로그인 */
authRouter.post('/login', isNotLoggedIn, (req, res, next) => {
  /**
   * ? authError : 이 값이 존재하면 실패
   * ? user : 이 값이 존재하면 성공
   */
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      return next(authError)
    }

    if (!user) {
      return res.redirect(`/?loginError=${info.message}`) // TODO : 수정
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        // eslint-disable-next-line no-console
        console.error(loginError)
        return next(loginError)
      }
      return res.send('로그인 성공')
    })
  })(req, res, next)
})

/** 로그아웃 */
authRouter.get('/logout', isLoggedIn, (req, res) => {
  req.logout()
  // @ts-ignore
  req.session.destroy()
  // eslint-disable-next-line no-console
  console.log('로그아웃 되었습니다.')
  res.redirect('/')
})

/** 비밀번호 찾기 */
authRouter.post('/forget', isNotLoggedIn, async (req, res) => {
  const { id } = req.body
  // 임의의 비밀번호를 재발급
  const newPassword = Math.random().toString(36).slice(2)
  const hashedPassword = await bcrypt.hash(newPassword, 11)
  await User.updateOne({ id }, { hashedPassword })
  res.json({ password: newPassword })
})

module.exports = { authRouter }
