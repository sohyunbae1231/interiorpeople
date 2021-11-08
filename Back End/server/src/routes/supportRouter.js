// @ts-check

const { Router } = require('express')

const supportRouter = Router()

/** 모델 */
const Support = require('../schemas/Support')
// ? const FAQ = require('../schemas/Support')
// ? const Guide = require('../schemas/Guide')

/** support 페이지 홈  */
supportRouter.get('/', async (req, res) => {
  const allSupports = await Support.find({})
  res.json(allSupports)
})

// ? faq 관련
// ? supportRouter.get('/faq', (req, res) => {})

// ? guide 관련
// ? supportRouter.get('/guide', (req, res) => {})

module.exports = { supportRouter }
