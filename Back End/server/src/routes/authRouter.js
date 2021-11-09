// @ts-check

/**
 * TODO
 * 1. 회원가입할 때 어떤 정보를 얼마나 어떻게 받을 것인가
 * 2. 세션을 얼마나 유지할 것인가 -> redis로 변경 방법 알아보기
 * 3. 여러 기기에서 접속 가능하게 할 것인가
 * 4. 유저 정보 업데이트를 위한 라우터
 * //  5. 비밀번호 찾기 구현
 * 6. 다른 sns 아이디로 로그인 구현 (not mvp)
 */

const { Router } = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt') // 암호화 모듈
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication')

const User = require('../schemas/User')

const authRouter = Router()

/**
 * ! 확인용
 */
authRouter.get('/', (req, res) => {
  res.send('account route')
})

/** 회원가입 */
// eslint-disable-next-line
authRouter.post('/register', isNotLoggedIn, async (req, res, next) => {
  const { id, password } = req.body
  try {
    // 비밀번호가 너무 긴 경우
    if (password.length > 12) {
      throw new Error('비밀번호가 너무 깁니다.')
    }
    // 비밀번호가 너무 짧은 경우
    if (password.length < 3) {
      throw new Error('비밀번호가 너무 짧습니다.')
    }

    // 이미 해당 아이디가 있는 경우
    const doesIdAlreadyExist = await User.findOne({ id })
    if (doesIdAlreadyExist) {
      // eslint-disable-next-line no-console
      console.log('이미 아이디가 있습니다')
      // return res.redirect('/register?error=exist') // 에러를 주소 뒤에 쿼리스트링으로 표기함
      return res.send('존재하는 아이디입니다.')
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 11)

    // 유저 생성
    await new User({
      id: req.body.id,
      hashedPassword,
    }).save()

    // eslint-disable-next-line no-console
    console.log('회원가입되었습니다.')
    return res.redirect('/')
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
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
      // eslint-disable-next-line no-console
      console.error(authError)
      return next(authError)
    }

    if (!user) {
      return res.redirect(`/?loginError=${info.message}`)
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        // eslint-disable-next-line no-console
        console.error(loginError)
        return next(loginError)
      }
      // eslint-disable-next-line no-console
      console.log('로그인 되었습니다.')
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
