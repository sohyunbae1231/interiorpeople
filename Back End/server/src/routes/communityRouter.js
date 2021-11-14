// @ts-check

// TODO : 댓글 + 삭제 기능
// TODO : 파일 이미지인지 확인 후 거르기
/** 모듈 */
const { Router } = require('express')
const path = require('path')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')
const requestip = require('request-ip')
const { v1: uuid } = require('uuid')

/** 데이터베이스 관련 */
const Post = require('../schemas/Post')
const Like = require('../schemas/Like')
const Scrape = require('../schemas/Scrape')
const Follow = require('../schemas/Follow')

/** 로그인 관련 */
const { isLoggedIn, ifIsLoggedIn } = require('../middlewares/authentication')

const communityRouter = Router()

/** AWS 설정 */
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
})
// !  var ext = file.mimetype.split('/')[1];
const uploadPost = multer({
  storage: multers3({
    s3,
    bucket: 'interiorpeople',
    key(req, file, cb) {
      // 저장할 파일 위치 설정
      cb(null, `post_img/${uuid()}${path.extname(file.originalname)}`)
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
  const currentPost = await Post.findById(postId)
  let userId
  if (req.user) {
    // @ts-ignore
    userId = req.user.id
  }

  // 조회수 기록을 위함
  if (userId && !req.cookies[postId]) {
    // 조회수 증가
    const clientIP = requestip.getClientIp(req) // 사용자 ip
    res.cookie(postId, clientIP, { maxAge: 1000 * 10 * 60 })
    currentPost.view_count += 1
    await currentPost.save()
  }
  res.json(currentPost)
})

/** 스크랩을 눌렀을 시 */
communityRouter.post('/post/:postId/scrape', isLoggedIn, async (req, res) => {
  const { postId } = req.params
  // @ts-ignore
  const userId = req.user.id

  try {
    // 먼저 scrape 컬렉션에 유저 아이디가 있는지 확인
    const userScrapeList = await Like.findOne({ id: userId })
    if (userScrapeList) {
      // 이미 스크랩이 되어 있어 스크랩을 취소할 시
      // @ts-ignore
      const postIdIndex = userScrapeList.post_id.findIndex((element) => element === postId)
      if (postIdIndex !== -1) {
        userScrapeList.post_id.splice(postIdIndex, 1)
        await userScrapeList.save()
        res.status(200).json({ message: 'unScrape' })
      }
      // 스크랩을 할 시
      else {
        userScrapeList.post_id = [...userScrapeList.post_id, postId]
        await userScrapeList.save()
        res.status(200).json({ message: 'scrape' })
      }
    } else {
      // 컬렉션에 데이터 생성
      await new Scrape({
        user_id: userId,
        post_id: [postId],
      }).save()
      res.status(200).json({ message: 'scrape' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 팔로우을 눌렀을 시 */
communityRouter.post('/post/:postId/follow', isLoggedIn, async (req, res) => {
  const { postId } = req.params
  // @ts-ignore
  const userId = req.user.id

  try {
    // 먼저 like 컬렉션에 유저 아이디가 있는지 확인
    const currentPost = await Post.findById(postId)
    const writerIdOfPost = currentPost.writer_id
    // 이미 팔로우 되어 있다면 팔로우를 찾는 동시에 삭제함으로써 팔로우 해제시킴
    const isFollowing = await Follow.findOneAndDelete({ follower_id: userId, followed_id: writerIdOfPost })
    /**
     * ? findOneAndDelete 리턴값
     * ? isFollowing === null : 애초에 데이터가 없음
     * ? isFollowing === 어떤 객체 : 삭제한 데이터를 반환함
     */
    if (isFollowing) {
      // 이미 팔로우가 되어 있어 팔로우를 취소한 경우
      res.status(200).json({ message: 'unFollow' })
    } else {
      // 팔로우를 하는 경우
      await new Follow({ follower_id: userId, followed_id: writerIdOfPost }).save()
      res.status(200).json({ message: 'follow' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 좋아요를 눌렀을 시 */
communityRouter.post('/post/:postId/like', isLoggedIn, async (req, res) => {
  const { postId } = req.params
  // @ts-ignore
  const userId = req.user.id
  // 먼저 like 컬렉션에 유저 아이디가 있는지 확인
  try {
    const userLikeList = await Like.findOne({ id: userId })
    const currentPost = await Post.findById(postId)
    // 있는 경우
    if (userLikeList) {
      // 이미 좋아요가 되어 있어 좋아요를 취소할 시
      // @ts-ignore
      const postIdIndex = userLikeList.post_id.findIndex((element) => element === postId)
      if (postIdIndex !== -1) {
        userLikeList.post_id.splice(postIdIndex, 1)
        currentPost.like_num -= 1
        await userLikeList.save()
        await currentPost.save()
        res.status(200).json({ message: 'unLike' })
      }
      // 좋아요를 할 시
      else {
        userLikeList.post_id = [...userLikeList.post_id, postId]
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
        user_id: userId,
        post_id: [postId],
      }).save()
      res.status(200).json({ message: 'like' })
    }
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 댓글 기능 */
// TODO : 댓글 기능

/** 포스트 작성 */
// upload.array('키', 최대파일개수)
communityRouter.post('/mypost/write', isLoggedIn, uploadPost.array('images'), async (req, res) => {
  // 객체 배열에서 특정 요소를 추출할 때는 filter가 아니라 map을 사용함.
  // @ts-ignore
  const imgURLs = req.files.map((element) => element.location)

  console.log(req.files)

  // 포스트 생성
  const result = await new Post({
    // @ts-ignore
    writer_id: req.user.id,
    title: req.body.title,
    content: req.body.content,
    like_num: 0,
    s3_photo_img_url: imgURLs,
  }).save()
  res.status(200).json(result)
})

/** 포스트 삭제 */
// TODO : req.body에 포스트 아이디 아니면 와일드 카드 쓰던가
communityRouter.delete('/mypost/delete', isLoggedIn, async (req, res) => {
  // @ts-ignore
  const userId = req.user.id
  try {
    const post = await Post.findOneAndDelete({ _id: req.body.postId, writer_id: userId })
    const imgUrls = post.s3_photo_img_url
    // ? 유사배열이라고 한다.
    Array.from(imgUrls).forEach(async (element) => {
      const key = `${element.split('/').slice(3, 4)}/${element.split('/').slice(4)}`
      s3.deleteObject(
        {
          Bucket: 'interiorpeople',
          Key: key,
        },
        (err) => {
          if (err) {
            throw new Error('s3 파일 삭제 실패')
          }
        }
      )
    })
    res.status(200).json({ message: 'successfully delete' })
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})
module.exports = { communityRouter }
