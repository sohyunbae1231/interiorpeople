// @ts-check

/**
 * TODO : main page 이름이랑 이메일 보여주기
 * TODO : 나의 사진
 * TODO : 스크랩
 * TODO : 추천 기록
 * TODO : 회원정보 수정
 */
const { Router } = require('express')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication')

const myPageRouter = Router()

// TODO : 데이터 불러오기 미들웨어 필요한가?

myPageRouter.get('')

module.exports = { myPageRouter }
