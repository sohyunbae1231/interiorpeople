// @ts-check

const { Router } = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const Post = require('../schemas/Post')

const { isLoggedIn } = require('../middlewares/authentication')

const communityRouter = Router()

// ! 추후 s3로 수정
// uploads 폴더에다 이미지를 저장
try {
  fs.readdirSync('uploads')
} catch (err) {
  console.error('uploads폴더가 존재하지 않아 폴더를 생성')
  fs.mkdirSync('uploads')
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname)
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

// TODO : 메인홈
// ! 무한 스크롤 방식?
communityRouter.get('/', (req, res) => {})

// TODO : 내 포스트

// TODO : 포스트 리스트

// TODO: 포스트 작성하기
// 이미지 업로드, 태그하기, 본문 글 작성,
// ! 여러개 업로드 조사
communityRouter.post('/write', upload.array('images'), (req, res) => {
  console.log(req.files)
  console.log(req.body.content)
  // @ts-ignore
  res.json(req.files)
})

module.exports = { communityRouter }
