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

const userRouter = Router()
const { hash, compare } = require('bcryptjs') // 암호화 모듈
// const mongoose = require('mongoose')
const User = require('../models/User')

/** 회원가입 */
userRouter.post('/register', async (req, res) => {
  try {
    // 비밀번호가 너무 긴 경우
    if (req.body.password.length > 6) {
      throw new Error('too long password! please less than 6 characters')
    }
    // 비밀번호가 너무 짧은 경우
    if (req.body.password.length < 3) {
      throw new Error('too short password! please more than 3 characters')
    }

    const hashedPassword = await hash(req.body.password, 10)

    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      hashedPassword,
      session: [{ createAt: new Date() }]
    }).save()

    const currentSession = user.session[0]
    res.json({
      message: 'user register',
      // eslint-disable-next-line no-underscore-dangle
      sessionId: currentSession._id,
      name: user.name
    })
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 로그인 */
userRouter.patch('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    const isValid = await compare(req.body.password, user.hashedPassword)

    // 입력한 정보가 맞지 않을 경우
    if (!isValid) {
      throw new Error('invalid information')
    }

    user.session.push({ createAt: new Date() })
    const currentSession = user.session[user.session.length - 1]
    await user.save()

    res.json({
      message: 'user validated ',
      // eslint-disable-next-line no-underscore-dangle
      sessionId: currentSession._id,
      name: user.name
    })
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 로그아웃 */
userRouter.patch('/logout', async (req, res) => {
  try {
    // @ts-ignore
    const { user } = req
    const { sessionid } = req.headers
    if (!user) {
      throw new Error('invalid sessionid')
    }
    await User.updateOne(
      // eslint-disable-next-line no-underscore-dangle
      { _id: user._id },
      { $pull: { session: { _id: sessionid } } }
    )

    res.json({ message: 'user is logged out' })
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

module.exports = { userRouter }
