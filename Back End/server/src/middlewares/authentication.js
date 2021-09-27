// @ts-check

const mongoose = require('mongoose')
const User = require('../schemas/user')

// @ts-ignore
const authenticate = async (req, res, next) => {
  const { sessionid } = req.headers // 세션 확인

  // 세션이 없거나 올바른 형식이 아닌 경우
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) {
    return next()
  }

  const user = await User.findOne({ 'session._id': sessionid })

  // 세션이 없는 경우
  if (!user) {
    return next()
  }

  req.user = user
  return next()
}

module.exports = { authenticate }
