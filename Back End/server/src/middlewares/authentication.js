// @ts-check

// @ts-ignore
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(403).send('로그인이 필요합니다.')
  }
}

// @ts-ignore
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next()
  } else {
    const message = encodeURIComponent('이미 로그인되어 있습니다.')
    res.redirect(`${message}`)
  }
}
