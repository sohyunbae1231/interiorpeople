// @ts-check

/** 모듈 */
const { Router } = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')

/** 데이터베이스 관련 */
// TODO : const Post = require('../schemas/Post')

/** 로그인 관련 */
// TODO : const { isLoggedIn } = require('../middlewares/authentication')

const communityRouter = Router()

// try {
//   fs.readdirSync('uploads')
// } catch (err) {
//   fs.mkdirSync('uploads')
// }

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename(req, file, cb) {
//       const ext = path.extname(file.originalname)
//       cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 },
// })

/** AWS 설정 */
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2', // s3에서는 리전을 설정할 필요는 없음
})

const upload = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `original/${Date.now()}${path.basename(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
})

// TODO : 메인홈
// ! 무한 스크롤 방식?

// TODO : 내 포스트

// TODO : 포스트 리스트

// TODO: 포스트 작성하기
// 이미지 업로드, 태그하기, 본문 글 작성,
// ! 여러개 업로드 조사
communityRouter.post('/write', upload.single('img'), (req, res) => {
  // console.log(req.files)
  // console.log(req.body.content)
  // @ts-ignore
  console.log(req.file)
  res.json(req.file.location)
})

module.exports = { communityRouter }
