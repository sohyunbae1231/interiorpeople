// @ts-check

/** 모듈 */
const { Router } = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')
const path = require('path')
const bcrypt = require('bcrypt')
const { v1: uuid } = require('uuid')

/** 데이터베이스 관련 */
const User = require('../schemas/User')
const Scrape = require('../schemas/Scrape')

/** 로그인 관련 */
const { isLoggedIn } = require('../middlewares/authentication')

const myPageRouter = Router()

/** AWS 설정 */
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
})

/** 마이페이지 프로필 이미지 */
const uploadProfilePhoto = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      cb(null, `profilePhoto_img/${uuid()}${path.extname(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

/** 메인 페이지 */
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
