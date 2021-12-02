// @ts-check
// cSpell:disable

/** 모듈 */
const { Router } = require('express')
const { spawn } = require('child_process')
const fs = require('fs')

/** 로그인 관련 */
// eslint-disable-next-line no-unused-vars
const { isLoggedIn, ifIsLoggedIn } = require('../middlewares/authentication')

/** multer 및 AWS 관련 */
const { multerConfig } = require('../middlewares/multerConfig')
// eslint-disable-next-line no-unused-vars
const { s3 } = require('../aws')

const uploadImage = multerConfig('ml_image_img')
const uploadTheme = multerConfig('ml_theme_img')

/** 라우터 */
const imageRouter = Router()

/** 사진 업로드 */
imageRouter.post('/segmetantion', ifIsLoggedIn, uploadImage.single('image'), async (req, res) => {
  // @ts-ignore
  // const userId = req.user.id
  // @ts-ignore
  const imageName = req.file.filename
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = imageName
  }
  // * 쿠키에 파일 경로를 저장
  res.cookie('imageName', imageName, { maxAge: 1000 * 60 * 10 })
  // * segmetation 진행
  const imagePath = `../Back End/server/uploads/${imageName}`
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
  ]
  const segmentation = spawn(`cd`, command, {
    shell: true,
    cwd: __dirname,
  })

  let resultOfSeg
  let checkSeg = true
  // * 쉘 명령어 에러
  segmentation.stderr.on('data', (data) => {
    // ! 바꾸기
    // checkSeg = false
    // return res.status(200).json({
    //   segmentation: 'false',
    //   bbox_label_list: [],
    // })
    console.log(data.toString())
  })

  segmentation.stdout.on('data', (data) => {
    console.log(data.toString())
    resultOfSeg = data
  })

  // * 쉘 명령어 종료
  // eslint-disable-next-line consistent-return
  segmentation.on('exit', () => {
    if (checkSeg === true) {
      // ! 삭제
      resultOfSeg = `Config not specified. Parsed yolact_base_config from the file name.
    /usr/local/lib/python3.7/dist-packages/torch/jit/_recursive.py:235: UserWarning: 'lat_layers' was found in ScriptModule constants,  but it is a non-constant submodule. Consider removing it.
      " but it is a non-constant {}. Consider removing it.".format(name, hint))
    /usr/local/lib/python3.7/dist-packages/torch/jit/_recursive.py:235: UserWarning: 'downsample_layers' was found in ScriptModule constants,  but it is a non-constant submodule. Consider removing it.
      " but it is a non-constant {}. Consider removing it.".format(name, hint))
    /usr/local/lib/python3.7/dist-packages/torch/jit/_recursive.py:235: UserWarning: 'pred_layers' was found in ScriptModule constants,  but it is a non-constant submodule. Consider removing it.
      " but it is a non-constant {}. Consider removing it.".format(name, hint))
    Loading model... Done.
    bbox_label_list :  [[array([340, 195, 845, 460]), 'bed00'], [array([ 31, 198, 220, 438]), 'chair01'], [array([383,  23, 591, 302]), 'potted plant02'], [array([251, 218, 443, 333]), 'couch03'], [array([217, 269, 240, 291]), 'vase04'], [array([188, 238, 221, 290]), 'vase05'], [array([350, 173, 806, 459]), 'couch06'], [array([159, 167, 255, 301]), 'potted plant07'], [array([217, 269, 240, 291]), 'cup08']]`

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
      const listResult = step5.map((element) => element.split(','))
      return res.status(200).json({
        segmentation: true,
        bbox_label_list: listResult,
      })
    }
  })
})

/** 스타일 편집(선택) */
imageRouter.post('/select-style', ifIsLoggedIn, async (req, res) => {
  const { furnitureCategory, style, color } = req.body
})

/** 원하는 테마 이미지 업로드 */
imageRouter.post('/upload-theme', ifIsLoggedIn, uploadTheme.single('theme'), async (req, res) => {
  // @ts-ignore
  // const userId = req.user.id
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = req.file.filename
  }
  // * 쿠키에 테마 이미지 경로를 저장
  // @ts-ignore
  res.cookie('themeName', req.file.filename, { maxAge: 1000 * 60 * 10 })
  res.status(200).json({ message: 'upload theme succuss' })
})

/** 결과 보기 */
imageRouter.get('/local-style-transfer', ifIsLoggedIn, (req, res) => {
  const imageProcessedFolderName = `imageProcessed`
  if (!fs.existsSync(`./uploads/${imageProcessedFolderName}`)) {
    fs.mkdirSync(`./uploads/${imageProcessedFolderName}`, { recursive: true }) // ? package.json 기준 상대 경로
  }
  const { imageName, themeName } = req.cookies
  res.clearCookie('imageName')
  const targets = `"tv01, tv02, tv03, pillow00"`
  const contentImage = `"./data/train/images/kor_bedroom1.jpg"`
  const styleImage = '"./data/style/modern/blue.jpg"'
  const outputLocalStylePath = `"../Back End/server/upload/local_stylized.jpg"` // imageName
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
    `"./pth/style_transfer/vgg_normalised.pth"`,
    `--decoder_path`,
    `"./pth/style_transfer/decoder.pth"`,
    `--content_image`,
    contentImage,
    `--style_image`,
    styleImage,
    `--output_style_path`,
    `"./fg_bg/stylized.jpg"`,
    `--style_intensity`,
    `"Middle"`,
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
  // await는 무쓸모
  const localStyleTransfer = spawn(`cd`, command, {
    shell: true,
    cwd: __dirname,
  })

  // TODO : 사진 보내기
  localStyleTransfer.stdout.on('data', (data) => {
    console.log(data.toString())
    res.status(200).json({})
  }) // 실행 결과

  localStyleTransfer.stderr.on('data', (data) => {
    console.error(data.toString())
  }) // 실행 >에러
  res.status(200).json({})
})

module.exports = { imageRouter }

// ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ! //
// * package.json 기준
// ! 이렇게 하면 띄어쓰기 인식을 못함
// ! 두번쨰 인자 사용해서 하나씩 넣어줘야 함 ㅠㅠ
// const process = spawn('python', ['./src/routes/test11.py', '--print-number', '5'])
// const process = spawn('python', [
//   '../../Machine Learning/segmentation.py',
//   '--trained_model=weights/yolact_plus_resnet50_cig_indoor_78_869_interrupt.pth',
//   '--config=yolact_resnet50_cig_indoor_config',
//   '--score_threshold=0.3',
//   '--top_k=15',
//   '--image=data/train/images/kor_bedroom1.jpg:data/eval_result/kor_bedroom1.jpg',
//   '--display_bbox=False',
//   '--display_text=False',
// ])

// const process = spawn('python', [
//   '../../Machine Learning/local_style_transfer.py',
//   '--image_path',
//   "'./fg_bg/'",
//   '--targets',
//   '"tv01, tv02, tv03, pillow00"',
//   '--vgg_path',
//   "'./pth/style_transfer/vgg_normalised.pth'",
//   '--decoder_path',
//   "'./pth/style_transfer/decoder.pth'",
//   '--content_image',
//   "'./data/train/images/kor_bedroom1.jpg'",
//   '--style_image',
//   "'./data/style/modern/blue.jpg'",
//   '--output_style_path',
//   "'./fg_bg/stylized.jpg'",
//   '--style_intensity',
//   "'Middle'",
//   '--fg_image_path',
//   '"./fg_bg/fg_result.jpg"',
//   '--bg_image_path',
//   '"./fg_bg/bg_result.jpg"',
//   '--stylized_image_path',
//   '"./fg_bg/stylized.jpg"',
//   '--output_local_style_path',
//   '"./local_stylized.jpg"',
// ])
// ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ! //
