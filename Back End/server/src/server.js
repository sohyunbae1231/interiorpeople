// @ts-check

/** 모듈 */
const express = require('express')
require('dotenv').config() // dotenv 설정 불러오기
const morgan = require('morgan') // morgan
const cookieParser = require('cookie-parser') // cookieParser
const session = require('express-session')
const path = require('path')
const passport = require('passport')

/** 데이터베이스 관련 */
const connect = require('./schemas')

/** 로그인 관련 */
const passportConfig = require('./passport')

/** 라우터 */
const { authRouter } = require('./routes/authRouter') // 유저 정보 관련 라우터
const { communityRouter } = require('./routes/communityRouter') // 커뮤니티 기능 관련 라우터
const { indexRouter } = require('./routes/indexRouter') // 메인 페이지 라우터
const { faqRouter } = require('./routes/faqRouter') // 지주 묻는 질문 라우터
const { noticeRouter } = require('./routes/noticeRouter') // 공지사항 라우터
const { imageRouter } = require('./routes/imageRouter') // 이미지 처리 라우터

/** 미들웨어 */
// const { authenticate } = require('./middlewares/authentication') // 인증 관련 미들웨어

const app = express()
const { PORT, COOKIE_KEY } = process.env
passportConfig()

connect() // 몽고디비 연결

app.use(morgan('dev'))
app.use(express.json())
// app.use(authenticate)
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
app.use(passport.initialize())
app.use(passport.session())

/** 라우터 연결 */
// 메인 페이지 라우터
app.use('/', indexRouter)
// 로그인,로그아웃,회원가입,비밀번호 찾기 라우터
app.use('/auth', authRouter)

/** 에러 핸들링 라우터 : 페이지가 없을 경우 */
// app.use((req, res, next) => {
//   const error = new Error('no route')
//   // @ts-ignore
//   error.status = 404
//   next(error)
// })

// // @ts-ignore
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   res.locals.message = err.message
//   res.locals.error = err // TODO : Modify

//   // eslint-disable-next-line no-console
//   console.error(err.status || 500)
//   res.render('error')
// })

/** 서버 실행 */
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on PORT : ${PORT}`)
})
