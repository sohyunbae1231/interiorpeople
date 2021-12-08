// @ts-check
// cSpell:disable

/**
 * TODO : s3 연결
 * TODO :
 * TODO :
 * TODO :
 */

/** 모듈 */
const { Router } = require('express')
const { spawn } = require('child_process')
const fs = require('fs')

/** 데이터베이스 관련 */
const InteriorImage = require('../schemas/interiorImage')

/** 로그인 관련 */
const { ifIsLoggedIn } = require('../middlewares/authentication')

/** multer 및 AWS 관련 */
const { multerConfig } = require('../middlewares/multerConfig')
// eslint-disable-next-line no-unused-vars
const { s3 } = require('../aws')

const preTransferImage = multerConfig('ml_pre_transfer_image_img')
const postTransferImage = multerConfig('ml_post_transfer_image_img')

const themeImage = multerConfig('ml_theme_img')

/** 라우터 */
const imageRouter = Router()

/** 사진 업로드 */
imageRouter.post('/seg', ifIsLoggedIn, preTransferImage.single('image'), async (req, res) => {
  // @ts-ignore
  const userId = req.user ? req.user.id : 'testUser'

  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = req.file.filename
  }
  // @ts-ignore
  const imgUrl = req.file.location

  // segmetation 진행
  // ! machine learning 폴더 기준
  const imagePath = `../Back End/server/uploads/${imgUrl}` // ml_pre_transfer_image/~.~
  // eslint-disable-next-line camelcase
  const fg_bg_path_in_server = `./uploads/fg_bg/${userId}`

  // 폴더를 지우고 다시 생성
  if (fs.existsSync(fg_bg_path_in_server)) {
    fs.rmdirSync(fg_bg_path_in_server, { recursive: true })
  }
  fs.mkdirSync(fg_bg_path_in_server, { recursive: true })

  // eslint-disable-next-line camelcase
  const fg_bg_path = `../Back End/${fg_bg_path_in_server}/`

  const command = [
    `../../../../Machine Learning`,
    `&&`,
    `dir`,
    `&&`,
    `python`,
    `segmentation.py`,
    `--trained_model=weights/yolact_plus_resnet50_cig_indoor_2473_4947_interrupt.pth`,
    `--config=yolact_resnet50_cig_indoor_config`,
    `--score_threshold=0.3`,
    `--top_k=15`,
    `--image=${imagePath}`,
    `--display_bbox=False`,
    `--display_text=False`,
    // eslint-disable-next-line camelcase
    `--fg_bg=${fg_bg_path}`,
  ]
  const segmentation = spawn(`cd`, command, {
    shell: true,
    cwd: __dirname,
  })

  let resultOfSeg
  let checkSeg = true
  // * 쉘 명령어 에러
  segmentation.stderr.on('data', () => {
    // ! 주석 처리 하지 않아야 함
    // checkSeg = false
  })

  // * 쉘 명령어 실행 중
  segmentation.stdout.on('data', (data) => {
    resultOfSeg = data
    console.log(resultOfSeg.toString())
  })

  // * 쉘 명령어 종료
  // eslint-disable-next-line consistent-return
  segmentation.on('exit', async () => {
    if (checkSeg === true) {
      // ! 삭제
      resultOfSeg = `Config not specified. Parsed yolact_base_config from the file name.
      /usr/local/lib/python3.7/dist-packages/torch/jit/_recursive.py:235: UserWarning: 'pred_layers' was found in ScriptModule constants,  but it is a non-constant submodule. Consider removing it.
        " but it is a non-constant {}. Consider removing it.".format(name, hint))
      /usr/local/lib/python3.7/dist-packages/torch/jit/_recursive.py:235: UserWarning: 'downsample_layers' was found in ScriptModule constants,  but it is a non-constant submodule. Consider removing it.
        " but it is a non-constant {}. Consider removing it.".format(name, hint))
      /usr/local/lib/python3.7/dist-packages/torch/jit/_recursive.py:235: UserWarning: 'lat_layers' was found in ScriptModule constants,  but it is a non-constant submodule. Consider removing it.
        " but it is a non-constant {}. Consider removing it.".format(name, hint))
      Loading model... Done.
      bbox_label_list :  [[array([340, 195, 845, 460]), 'bed00'], [array([ 31, 198, 220, 438]), 'chair01'], [array([383,  23, 591, 302]), 'potted plant02'], [array([251, 218, 443, 333]), 'couch03'], [array([217, 269, 240, 291]), 'vase04'], [array([188, 238, 221, 290]), 'vase05'], [array([350, 173, 806, 459]), 'couch06'], [array([159, 167, 255, 301]), 'potted plant07'], [array([217, 269, 240, 291]), 'cup08']]`
      // !
      // 결과에서 bbox_label_list 추출
      const bboxLabelListExistence = resultOfSeg.indexOf('bbox_label_list') // 존재하지 않으면 -1을 반환
      // 세그멘테이션이 잘 안된 경우
      if (bboxLabelListExistence === -1) {
        return res.status(200).json({
          segmentation: false,
          bbox_label_list: [],
        })
      }
      // 세그멘테이션이 되면 결과를 발신
      const step1 = resultOfSeg.slice(bboxLabelListExistence + 'bbox_label_list'.length + 4)
      const step2 = step1.replace(/array/g, '')
      const step3 = step2.split('],')
      const step4 = step3.map((el) => el.replace(/ /g, ''))
      // eslint-disable-next-line no-useless-escape
      const reg = /[()'".\{\}\[\]\\\/ ]/gim
      const step5 = step4.map((element) => element.replace(reg, ''))
      const listSegCategory = step5.map((element) => element.split(','))
      res.cookie('bbox_label_list', listSegCategory, { maxAge: 1000 * 60 * 10 })
      // console.log(listSegCategory)
      // 세그멘테이션의 결과를 몽고디비에 저장
      const newInteriorImage = await new InteriorImage({
        user_id: userId,
        s3_pre_transfer_img_url: imgUrl,
        category_in_img: listSegCategory,
      }).save()
      // console.log(newInteriorImage)
      return res.status(200).json({
        segmentation: true,
        // eslint-disable-next-line no-underscore-dangle
        imageId: newInteriorImage._id,
      })
    }
    return res.status(200).json({
      segmentation: false,
      bbox_label_list: [],
    })
  })
})

/** 이미지 및 카테고리 가져오기 */
imageRouter.post('/pre-image', ifIsLoggedIn, async (req, res) => {
  // @ts-ignore
  const userId = req.user ? req.user.id : 'testUser'
  try {
    // @ts-ignore
    const interiorImage = await InteriorImage.findOne({ _id: req.body.imageId, user_id: userId })
    res.status(200).json(interiorImage)
  } catch (err) {
    // @ts-ignore
    res.status(400).json({ message: err.message })
  }
})

/** 스타일 편집(선택) */
// TODO
imageRouter.post('/select-style', ifIsLoggedIn, async (req, res) => {
  const { category, style, color, imageId } = req.body
  // @ts-ignore
  const userId = req.user ? req.user.id : 'testUser'
  // @ts-ignore
  try {
    const interiorImage = await InteriorImage.findOne({ _id: imageId, user_id: userId })
    interiorImage.selected_color = color
    interiorImage.selected_category = category
    interiorImage.selected_style = style
    await interiorImage.save()
  } catch (err) {
    console.log(err)
  }
  res.status(200).json({ message: 'select successfully' })
})

/** 원하는 테마 이미지 업로드 */
imageRouter.post('/upload-theme', ifIsLoggedIn, themeImage.single('theme'), async (req, res) => {
  // @ts-ignore
  const userId = req.user ? req.user.id : 'testUser'
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = req.file.filename
  }
  // @ts-ignore
  const interiorImage = await InteriorImage.findOne({ _id: req.body.imageId, user_id: userId })
  // @ts-ignore
  interiorImage.s3_theme_img_url = req.file.location
  await interiorImage.save()
  res.status(200).json({ message: 'upload theme succuss' })
})

// TODO :
/** local-style-transfer 결과 보기 */
imageRouter.post('/local-style-transfer', ifIsLoggedIn, async (req, res) => {
  const imageProcessedFolderName = `syle_transfer_img`
  if (!fs.existsSync(`./uploads/${imageProcessedFolderName}`)) {
    fs.mkdirSync(`./uploads/${imageProcessedFolderName}`, { recursive: true }) // ? package.json 기준 상대 경로
  }
  // @ts-ignore
  const userId = req.user ? req.user.id : 'testUser'
  const { imageId } = req.body
  // @ts-ignore
  const interiorImage = await InteriorImage.findOne({ _id: imageId, user_id: userId })
  console.log(interiorImage)

  let styleImage
  // 테마 이미지가 있는 경우
  if (interiorImage.s3_theme_img_url && interiorImage.s3_theme_img_url !== 'none') {
    // ! 머신 러닝 폴더 기준
    styleImage = `../Back End/server/uploads/${interiorImage.s3_theme_img_url}`
  } else {
    // 테마 이미지가 없는 경우 스타일과 컬러를 고려
    // 스타일
    // 컬러
    styleImage = '"./data/style/modern/blue.jpg"'
  }

  // ! machine learning 폴더 기준
  const imagePath = `../Back End/server/uploads/${imgUrl}` // ml_pre_transfer_image/~.~
  // eslint-disable-next-line camelcase
  const fg_bg_path_in_server = `./uploads/fg_bg/${userId}`

  // 폴더를 지우고 다시 생성
  if (fs.existsSync(fg_bg_path_in_server)) {
    fs.rmdirSync(fg_bg_path_in_server, { recursive: true })
  }
  fs.mkdirSync(fg_bg_path_in_server, { recursive: true })

  // eslint-disable-next-line camelcase
  const fg_bg_path = `../Back End/${fg_bg_path_in_server}/`

  const targets = `"tv01, tv02, tv03, pillow00"`
  const contentImage = `"./data/train/images/kor_bedroom1.jpg"`
  const styleIntensity = `"Middle"`
  const colorstyleImage = 'ml_post_transfer_image_img/local_stylized.jpg'
  const themProcessedImage = 'ml_post_transfer_image_img/1235df3f_163824427.png'
  // const outputLocalStylePath = `"../Back End/server/upload/local_stylized.jpg"` // imageName
  const outputLocalStylePath = `"../Back End/server/${imageId}"` // imageName
  const command = [
    `../../../../Machine Learning`,
    `&&`,
    `dir`, // TODO : 제거
    '&&',
    `python`,
    `local_style_transfer.py`,
    `--image_path`,
    `"./fg_bg/"`,
    `--targets`,
    targets,
    `--vgg_path`,
    `"./weights/style_transfer/vgg_normalised.pth"`,
    `--decoder_path`,
    `"./weights/style_transfer/decoder.pth"`,
    `--content_image`,
    contentImage,
    `--style_image`,
    styleImage,
    `--output_style_path`,
    `"./fg_bg/stylized.jpg"`,
    `--style_intensity`,
    styleIntensity,
    `--fg_image_path`,
    `"./fg_bg/fg_result.jpg"`,
    `--bg_image_path`,
    `"./fg_bg/bg_result.jpg"`,
    `--stylized_image_path`,
    `"./fg_bg/stylized.jpg"`,
    `--output_local_style_path`,
    outputLocalStylePath,
  ]
  // 만들어 지는 시간이 걸림

  const localStyleTransfer = spawn(`cd`, command, {
    shell: true,
    cwd: __dirname,
  })

  localStyleTransfer.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  localStyleTransfer.stderr.on('data', (data) => {
    console.error(data.toString())
  })

  localStyleTransfer.on('exit', async () => {
    if (interiorImage.s3_theme_img_url !== 'none') {
      return res.status(200).json({
        localStyleTransfer: true,
        colorStyle: false,
        originalImage: interiorImage.s3_pre_transfer_img_url,
        transferedImage: themProcessedImage,
      })
    }
    return res.status(200).json({
      localStyleTransfer: true,
      colorStyle: true,
      originalImage: interiorImage.s3_pre_transfer_img_url,
      transferedImage: colorstyleImage,
      color: 'red',
      style: 'nrt',
    })
  })
})

module.exports = { imageRouter }

// TODO : 선택한 이미지를 통해 검색
