// @ts-check
const { Router } = require('express')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication')

const User = require('../schemas/User')

const myPageRouter = Router()

// TODO : 데이터 불러오기 미들웨어 필요한가?

/** 메인 페이지 */
myPageRouter.get('/', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const currentUser = await User.findOne({ id: req.user.id })
  console.log(currentUser.id)
  // TODO : 이메일 보내기?
  res.json(currentUser.id)
})

/** 나의 사진 페이지 */
// TODO : 나의 사진
myPageRouter.get('/photo', isLoggedIn, async (req, res) => {})

/** 스크랩 페이지 */
// TODO : 스크랩
myPageRouter.get('/ㄴ', isLoggedIn, async (req, res) => {})

/** 추천 기록 페이지 */
// TODO : 추천 기록
myPageRouter.get('/photo', isLoggedIn, async (req, res) => {})

/** 프로필 수정 페이지 */
// TODO : 프로필 수정
myPageRouter.get('/photo', isLoggedIn, async (req, res) => {})

module.exports = { myPageRouter }
