// @ts-check

/** 모듈 */
const { Router } = require('express')
const bcrypt = require('bcrypt')

/** 데이터베이스 관련 */
const User = require('../schemas/User')
const Scrape = require('../schemas/Scrape')

/** 로그인 관련 */
const { isLoggedIn } = require('../middlewares/authentication')

/** multer 및 AWS 관련 */
const { s3, multerConfig } = require('../middlewares/multerConfig')

const uploadProfilePhoto = multerConfig('profilePhoto_img')

const myPageRouter = Router()

/** 메인 페이지 */
/**
 * TODO : 보내야 할 것들
 * TODO : 이름
 * TODO : 이메일
 * TODO : 프로필 사진
 */
myPageRouter.get('/', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const currentUser = await User.findOne({ id: req.user.id })
  // TODO : 무엇을 보내야 할까
  // ! 프론트
  res.json(currentUser)
})

/** 나의 사진 페이지 */
// TODO : 나의 사진
// eslint-disable-next-line no-unused-vars
myPageRouter.get('/myphoto', isLoggedIn, async (req, res) => {})

/** 추천 기록 페이지 */
// TODO : 추천 기록
// eslint-disable-next-line no-unused-vars
myPageRouter.get('/photo', isLoggedIn, async (req, res) => {})

/** 스크랩 페이지 */
myPageRouter.get('/scrap', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const userScrapeList = await Scrape.findOne({ user_id: req.user.id })
  res.status(200).json({ scrapeList: userScrapeList.post_id })
})

/** 프로필 수정 페이지 */
myPageRouter.patch('/profile', isLoggedIn, uploadProfilePhoto.single('img'), async (req, res) => {
  // @ts-ignore
  const currentUser = await User.findOne({ id: req.user.id })
  // 비밀번호 변경
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 11)
    currentUser.hashedPassword = hashedPassword
  }
  // 이름 변경
  if (req.body.name) {
    currentUser.name = req.body.name
  }
  // 프로필 사진 변경
  if (req.file) {
    // @ts-ignore
    currentUser.s3_profilephoto_img_url = req.file.location
  }
  try {
    await User.updateOne(
      // @ts-ignore
      { id: req.user.id },
      currentUser
    )
    res.status(200).json({ succuss: true })
  } catch (err) {
    // @ts-ignore
    res.status(200).json({ message: err.message })
  }
})

module.exports = { myPageRouter }
