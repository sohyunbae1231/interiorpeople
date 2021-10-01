// @ts-check

// @ts-ignore
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(403).send('you must log in!')
  }
}

// @ts-ignore
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next()
  } else {
    const message = encodeURIComponent('already logged in')
    res.send(`${message}`)
  }
}
