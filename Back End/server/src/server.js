// @ts-check

const express = require('express')
const mongoose = require('mongoose') // 몽구스
require('dotenv').config() // dotenv 설정 불러오기
const morgan = require('morgan') // morgan
const cookieParser = require('cookie-parser') // cookieParser
const session = require('express-session')

const { userRouter } = require('./routes/userRouter') // 유저 정보 관련 라우터
const { authenticate } = require('./middlewares/authentication') // 인증 관련 미들웨어

const { PORT, COOKIE_KEY } = process.env
const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(authenticate)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(COOKIE_KEY))
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    // @ts-ignore
    secret: COOKIE_KEY,
    cookie: {
      httpOnly: true,
      secure: false
    },
    name: 'session-cookie'
  })
)

/** 몽고 디비 연결 */
mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('mongodb connected successfully')

    /** 메인 화면 */
    app.get('/', (req, res) => {
      res.send('connect successful')
    })

    /** 라우터 연결 */
    app.use('/user', userRouter) // 유저 라우터

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`express server listening on PORT : ${PORT}`)
    })
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err)
  })
