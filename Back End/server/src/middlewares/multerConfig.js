const path = require('path')
const multer = require('multer')
const AWS = require('aws-sdk')
const multers3 = require('multer-s3')
const { v1: uuid } = require('uuid')
const mime = require('mime-types') // 파일의 타입을 처리
const fs = require('fs')

/** 이미지 업로드 관련 */
/** AWS 설정 */
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
})

function multerConfig(imageFolderName) {
  let multerVariable = multer()
  if (process.env.NODE_ENV === 'dev') {
    if (!fs.existsSync(`./uploads/${imageFolderName}`)) {
      fs.mkdirSync(`./uploads/${imageFolderName}`, { recursive: true }) // ? package.json 기준 상대 경로
    }
    /** dev 환경일 경우 local storage에서 이미지 관리 */
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads')
      },
      filename: (req, file, cb) => {
        const temporaryFileName = `${imageFolderName}/${uuid()}.${mime.extension(file.mimetype)}`
        cb(null, temporaryFileName)
      },
    })

    multerVariable = multer({
      storage,
      fileFilter: (req, file, cb) => {
        if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
          cb(null, true)
        } else {
          // @ts-ignore
          cb(new Error(`파일 타입이 이미지가 아닙니다! : ${file.mimetype}`), false)
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 파일 크기를 5mb로 제한
      },
    })
  } else if (process.env.NODE_ENV === 'production') {
    /** production 환경일 경우 AWS S3에서 이미지 관리 */

    multerVariable = multer({
      storage: multers3({
        s3,
        bucket: 'interiorpeople',
        key(req, file, cb) {
          // 저장할 파일 위치 설정
          cb(null, `${imageFolderName}/${uuid()}${path.extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
          cb(null, true)
        } else {
          // @ts-ignore
          cb(new Error(`파일 타입이 이미지가 아닙니다! : ${file.mimetype}`), false)
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기를 5mb로 제한
    })
  }
  return multerVariable
}
module.exports = { s3, multerConfig }
