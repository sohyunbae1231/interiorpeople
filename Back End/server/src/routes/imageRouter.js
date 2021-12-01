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
// TODO : segmentation을 여기서 진행
imageRouter.post('/segmetantion', ifIsLoggedIn, async (req, res) => {
  // , uploadImage.single('image')
  // @ts-ignore
  // const userId = req.user.id
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    // req.file.location = req.file.filename
  }
  // * 쿠키에 파일 경로를 저장
  // @ts-ignore
  // res.cookie('image', req.file.filename, { maxAge: 1000 * 60 * 10 })
  // * segmetation 진행
  // TODO : 이미지 경로 변경
  const imagePath = `data/train/images/kor_bedroom1.jpg:data/eval_result/kor_bedroom1.jpg`
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

  let result
  segmentation.stderr.on('data', (data) => {
    result = data
    // eslint-disable-next-line no-console
    console.log(`stderr: ${data.toString()}`)
  })
  segmentation.stdout.on('data', (data) => {
    result = data
    // eslint-disable-next-line no-console
    console.log(`stdout: ${data.toString()}`)
  })
  res.status(200).json({ result })
})

/** 스타일 편집(선택) */
// TODO : 어떤 것을 어떻게 편집할 것인지
// imageRouter.post('/select-style', ifIsLoggedIn, async (req, res) => {})

/** 원하는 테마 이미지 업로드 */
imageRouter.post('/upload-style', ifIsLoggedIn, uploadTheme.single('theme'), async (req, res) => {
  // @ts-ignore
  // const userId = req.user.id
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = req.file.filename
  }
  // * 쿠키에 테마 이미지 경로를 저장
  // @ts-ignore
  res.cookie('theme', req.file.filename, { maxAge: 1000 * 60 * 10 })
  res.status(200).json({ message: 'upload theme succuss' })
})

/** 영역 설정 */
// ! 일단 보류
// imageRouter.post('/select-area', ifIsLoggedIn, async (req, res) => {})

/** 결과 보기 */
imageRouter.get('/local-style-transfer', ifIsLoggedIn, (req, res) => {
  const imageProcessedFolderName = `imageProcessed`
  if (!fs.existsSync(`./uploads/${imageProcessedFolderName}`)) {
    fs.mkdirSync(`./uploads/${imageProcessedFolderName}`, { recursive: true }) // ? package.json 기준 상대 경로
  }
  // const iamgeName = req.cookies.image
  // res.clearCookie('image')
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
