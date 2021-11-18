const { Router } = require('express')

const indexRouter = Router()

/** 확인용 */
indexRouter.get('/', (req, res) => {
  console.log(req.user)
  // res.json({ message: '메인 페이지 입니다' })
  res.send('메인 페이지 입니다')
})

indexRouter.post('/', (req, res) => {
  res.send('메인 페이지 입니다')
})

module.exports = { indexRouter }
