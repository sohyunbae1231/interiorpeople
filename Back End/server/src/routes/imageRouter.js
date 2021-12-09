/* eslint-disable camelcase */
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
const themeImage = multerConfig('ml_theme_img')

/** 라우터 */
const imageRouter = Router()

/** 사진 업로드 */
imageRouter.post('/seg', ifIsLoggedIn, preTransferImage.single('image'), async (req, res) => {
  const userId = req.user ? req.user.id : 'testUser'

  if (process.env.NODE_ENV === 'dev') {
    req.file.location = req.file.filename
  }
  const imgUrl = req.file.location

  // segmetation 진행
  // ! machine learning 폴더 기준
  const imagePath = `../Back End/server/uploads/${imgUrl}` // ml_pre_transfer_image/~.~

  // 이미지 이름에 해당하는 폴더를 머신러닝 폴더 안에 만들기
  const temp1 = req.file.filename.split('/')
  const temp2 = temp1[temp1.length - 1]
  const temp3 = temp2.split('.')
  const realImageName = temp3[0]
  // ! package.json 파일 기준
  // eslint-disable-next-line camelcase
  const fg_bg_folder = `../../Machine Learning/fg_bg/${realImageName}`
  fs.mkdirSync(fg_bg_folder, { recursive: true })

  // fg_bg 폴더 경로
  // eslint-disable-next-line camelcase
  const fg_bg_path = `./fg_bg/${realImageName}`

  const command = [
    `../../../../Machine Learning`,
    `&&`,
    `python`,
    `segmentation.py`,
    `--trained_model=weights/yolact/yolact_base_54_800000.pth`,
    `--score_threshold=0.15`,
    `--top_k=15`,
    `--top_k=15`,
    `--image=${imagePath}`,
    `--display_bbox=False`,
    `--display_text=False`,
    // eslint-disable-next-line camelcase
    `--fg_bg="${fg_bg_path}"`,
  ]
  const segmentation = spawn(`cd`, command, {
    shell: true,
    cwd: __dirname,
  })

  let resultOfSeg
  // eslint-disable-next-line prefer-const
  let checkSeg = true
  // * 쉘 명령어 에러
  segmentation.stderr.on('data', () => {
    // checkSeg = false
  })

  // * 쉘 명령어 실행 중
  segmentation.stdout.on('data', (data) => {
    resultOfSeg = data
    // eslint-disable-next-line no-console
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
      // // !
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
  const userId = req.user ? req.user.id : 'testUser'
  try {
    const interiorImage = await InteriorImage.findOne({ _id: req.body.imageId, user_id: userId })
    res.status(200).json(interiorImage)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/** 스타일 편집(선택) */
/**
 * style : classic, natural, northern_europe, modern, vintage
 * color : black, blue, brown, grey, red
 */
imageRouter.post('/select-style', ifIsLoggedIn, async (req, res) => {
  const { category, style, color, imageId, intensity } = req.body
  const userId = req.user ? req.user.id : 'testUser'
  try {
    const interiorImage = await InteriorImage.findOne({ _id: imageId, user_id: userId })
    interiorImage.selected_color = color
    interiorImage.selected_category = category
    interiorImage.selected_style = style
    interiorImage.intensity = intensity
    await interiorImage.save()
  } catch (err) {
    res.status(400).json({ result: false })
  }
  res.status(200).json({ result: true })
})

/** 원하는 테마 이미지 업로드 */
imageRouter.post('/upload-theme', ifIsLoggedIn, themeImage.single('theme'), async (req, res) => {
  const userId = req.user ? req.user.id : 'testUser'
  if (process.env.NODE_ENV === 'dev') {
    req.file.location = req.file.filename
  }

  const interiorImage = await InteriorImage.findOne({ _id: req.body.imageId, user_id: userId })
  interiorImage.s3_theme_img_url = req.file.location
  await interiorImage.save()
  res.status(200).json({ result: true })
})

/** local-style-transfer 결과 보기 */
imageRouter.post('/local-style-transfer', ifIsLoggedIn, async (req, res) => {
  const userId = req.user ? req.user.id : 'testUser'
  const { imageId } = req.body

  const interiorImage = await InteriorImage.findOne({ _id: imageId, user_id: userId })
  // 이미지 이름 가져오기
  const temp1 = interiorImage.s3_pre_transfer_img_url.split('/')
  const temp2 = temp1[temp1.length - 1]
  const temp3 = temp2.split('.')
  const realImageName = temp3[0]
  const imgUrl = InteriorImage.s3_pre_transfer_img_url

  let styleImage
  // 테마 이미지가 있는 경우
  if (interiorImage.s3_theme_img_url && interiorImage.s3_theme_img_url !== 'none') {
    // ! 머신 러닝 폴더 기준
    styleImage = `../Back End/server/uploads/${interiorImage.s3_theme_img_url}`
  } else {
    // 테마 이미지가 없는 경우 스타일과 컬러를 고려
    styleImage = `./data/style/${interiorImage.selected_style}/${interiorImage.selected_color}.jpg`
  }

  // ! machine learning 폴더 기준
  const imagePath = `../Back End/server/uploads/${imgUrl}` // ml_pre_transfer_image/~.~

  const fg_bg_path = `./fg_bg/${realImageName}`
  const targets = `"bed00"` // ! 수정

  const resultOfTransferImagePath = `../Back End/server/uploads/ml_post_transfer_image_img/${realImageName}.jpg`

  const command = [
    `../../../../Machine Learning`,
    `&&`,
    `dir`, // TODO : 제거
    '&&',
    `python`,
    `local_style_transfer.py`,
    `--image_path`, // fg_bg 경로가 어디인지
    `"${fg_bg_path}"`,
    `--targets`, // 무엇을 바꿀지
    `"${targets}"`,
    `--vgg_path`,
    `"./weights/style_transfer/vgg_normalised.pth"`,
    `--decoder_path`,
    `"./weights/style_transfer/decoder.pth"`,
    `--content_image`, // 어떤 이미지인지
    `"${imagePath}"`,
    `--style_image`, // 어떤 스타일인지
    `"${styleImage}"`,
    `--output_style_path`,
    `"${fg_bg_path}/stylized.jpg"`,
    `--style_intensity`, // 강도를 어느 정도로 할지
    'Middle', // ! 추가
    `--output_local_style_path`, // 어디에 결과를 저장할지
    `"${resultOfTransferImagePath}"`,
    `--fg_image_path`,
    `"${fg_bg_path}/fg_result.jpg"`,
    `--bg_image_path`,
    `"${fg_bg_path}/bg_result.jpg"`,
    `--stylized_image_path`,
    `"${fg_bg_path}/stylized.jpg"`,
  ]
  // 만들어 지는 시간이 걸림

  const localStyleTransfer = spawn(`cd`, command, {
    shell: true,
    cwd: __dirname,
  })

  localStyleTransfer.stderr.on('data', (data) => {
    // eslint-disable-next-line no-console
    console.error(data.toString())
  })

  localStyleTransfer.on('exit', async () => {
    // 테마 이미지로 변환한 경우
    interiorImage.s3_post_transfer_img_url = `ml_post_transfer_image_img/${realImageName}.jpg`
    await interiorImage.save()

    if (interiorImage.s3_theme_img_url !== 'none') {
      return res.status(200).json({
        localStyleTransfer: true,
        colorStyle: false,
        originalImage: interiorImage.s3_pre_transfer_img_url,
        transferedImage: interiorImage.s3_post_transfer_img_url,
      })
    }
    // 선택한 컬러와 스타일로 변환한 경우
    return res.status(200).json({
      localStyleTransfer: true,
      colorStyle: true,
      originalImage: interiorImage.s3_pre_transfer_img_url,
      transferedImage: interiorImage.s3_post_transfer_img_url,
      color: interiorImage.selected_color,
      style: interiorImage.selected_style,
    })
  })
})

module.exports = { imageRouter }

// TODO : 선택한 이미지를 통해 검색
