// @ts-check

const { Router } = require('express')
const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication')

const myPageRouter = Router()

// TODO : 데이터 불러오기 미들웨어 필요한가?
myPageRouter.use((req, res, next) => {})

myPageRouter.get('')
