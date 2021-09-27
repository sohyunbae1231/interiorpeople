/* eslint-disable no-console */
// @ts-check

const mongoose = require('mongoose')

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true)
  }
}

/**  몽구스와 몽고디비를 연결 */
mongoose.connect(`${process.env.MONGODB_URI}`, {}, (error) => {
  if (error) {
    console.log(`mongoDB connect ERROR : ${error}`)
  } else {
    console.log(`mongoDB connect successfully`)
  }
})

/** 몽구스 커넥션 */
mongoose.connection.on('error', (error) => {
  console.log(`mongoDB connect ERROR : ${error}`)
})
mongoose.connection.on('disconnected', () => {
  console.log(`mongoDB disconnected. connect again.`)
  connect()
})

module.exports = connect
