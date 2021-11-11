exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(403).send('로그인이 필요합니다.')
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next()
  } else {
    const message = encodeURIComponent('이미 로그인되어 있습니다.')
    // eslint-disable-next-line no-console
    console.error('이미 로그인되어 있습니다.')
    res.redirect(`/?error=${message}`)
  }
}

exports.ifIsLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    next()
  }
}
