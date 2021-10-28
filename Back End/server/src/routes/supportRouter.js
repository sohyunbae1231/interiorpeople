/* eslint-disable no-unused-vars */
// // @ts-check
// ! 고객센터는 이용가이드, faq 정도로 두개 필요

const { Router } = require('express')

const supportRouter = Router()

/** 모델 */
const FAQ = require('../schemas/FAQ')
const Guide = require('../schemas/Guide')

// faq 관련

supportRouter.get('/faq', (req, res) => {})

// guide 관련
supportRouter.get('/guide', (req, res) => {})

module.exports = { supportRouter }
