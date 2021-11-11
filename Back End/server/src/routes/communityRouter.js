// @ts-check

// TODO : 사진 저장할 때 고유 id 부여해서 넣기 안그러면 중복 사진 생길 수 있음
// TODO : 댓글
/** 모듈 */
const { Router } = require('express')
const path = require('path')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')
const requestip = require('request-ip')

/** 데이터베이스 관련 */
const Post = require('../schemas/Post')
const Like = require('../schemas/Like')

/** 로그인 관련 */
const { isLoggedIn, ifIsLoggedIn } = require('../middlewares/authentication')

const communityRouter = Router()

/** AWS 설정 */
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2', // s3에서는 리전을 설정할 필요는 없음
})

const uploadPost = multer({
  storage: multers3({
    s3: new AWS.S3(),
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `post_img/${path.basename(file.originalname)}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
})

// TODO : 메인홈
// TODO : 포스트 클릭 어떻게 구현
// TODO : 인기글, 나의 글 구현
communityRouter.get('/', ifIsLoggedIn, async (req, res) => {
  res.send(123)
})

// TODO : 내 포스트
// TODO : infinite scroll 방식으로 하기
communityRouter.get('/mypost', isLoggedIn, async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.user)
  res.json({ 123: 123 })
})

/** 포스트 상세 */
communityRouter.get('/post/:postId', ifIsLoggedIn, async (req, res) => {
  const { postId } = req.params
  const postResult = await Post.findById(postId)
  // @ts-ignore
  const userId = req.user.id
  // 조회수 기록을 위함
  if (userId && !req.cookies[postId]) {
    const clientIP = requestip.getClientIp(req)
    res.cookie(postId, clientIP, { maxAge: 1000 * 10 * 60 })
  }
  res.json(postResult)
})

/** 스크랩을 눌렀을 시 */
communityRouter.get('/:postId/scrape', isLoggedIn, async (req, res) => {
  res.json(req)
})

/** 좋아요를 눌렀을 시 */
communityRouter.get('/:postId/like', isLoggedIn, async (req, res) => {
  const currentPostId = req.params.postId
  // @ts-ignore
  const currentUserId = req.user.id
  // 먼저 like 컬렉션에 유저 아이디가 있는지 확인
  try {
    const userLikeList = await Like.findOne({ id: currentUserId })
    const currentPost = await Post.findById(currentPostId)
    // 있는 경우
    if (userLikeList) {
      // 이미 좋아요가 되어 있어 좋아요를 취소할 시
      // @ts-ignore
      const postIdIndex = userLikeList.post_id.findIndex((element) => element === currentPostId)
      if (postIdIndex !== -1) {
        userLikeList.post_id.splice(postIdIndex, 1)
        currentPost.like_num -= 1
        await userLikeList.save()
        await currentPost.save()
        res.status(200).json({ message: 'unlike' })
      }
      // 좋아요를 할 시
      else {
        userLikeList.post_id = [...userLikeList.post_id, currentPostId]
        currentPost.like_num += 1
        await userLikeList.save()
        await currentPost.save()
        res.status(200).json({ message: 'like' })
      }
    }
    // 없는 경우
    else {
      // 좋아요를 누름
      currentPost.like_num += 1
      await currentPost.save()
      await new Like({
        user_id: currentUserId,
        post_id: req.params.postId,
      }).save()
      res.status(200).json({ message: 'like' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 포스트 작성 */
// upload.array('키', 최대파일개수)
communityRouter.post('/write', isLoggedIn, uploadPost.array('images'), async (req, res) => {
  // 객체 배열에서 특정 요소를 추출할 때는 filter가 아니라 map을 사용함.
  // @ts-ignore
  const imgURLs = req.files.map((element) => element.location)

  // 포스트 생성
  const result = await new Post({
    // @ts-ignore
    writer_id: req.user.id,
    title: req.body.title,
    content: req.body.content,
    like_num: 0,
    s3_photo_img_url: imgURLs,
  }).save()
  res.json(result)
})

module.exports = { communityRouter }
