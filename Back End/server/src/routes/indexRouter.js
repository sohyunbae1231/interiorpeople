const { Router } = require('express')

const indexRouter = Router()

/** 확인용 */
indexRouter.get('/', (req, res) => {
  res.send('index route')
})

module.exports = { indexRouter }
