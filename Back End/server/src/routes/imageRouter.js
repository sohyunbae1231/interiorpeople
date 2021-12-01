// @ts-check
// cSpell:disable

/** 모듈 */
const { Router } = require('express')
const { spawn } = require('child_process')

/** 로그인 관련 */
const { isLoggedIn, ifIsLoggedIn } = require('../middlewares/authentication')

/** multer 및 AWS 관련 */
const { multerConfig } = require('../middlewares/multerConfig')
const { s3 } = require('../aws')

const uploadImage = multerConfig('ml_image_img')
const uploadTheme = multerConfig('ml_theme_img')

/** 라우터 */
const imageRouter = Router()

/** 사진 업로드 */
// TODO : segmentation을 여기서 진행
imageRouter.post('/upload', ifIsLoggedIn, uploadImage.single('image'), async (req, res) => {
  // @ts-ignore
  // const userId = req.user.id
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = req.file.filename
  }
  // * 쿠키에 파일 경로를 저장
  // @ts-ignore
  res.cookie('image', req.file.filename, { maxAge: 1000 * 60 * 10 })
  // * segmetation 진행
  // TODO : 이미지 경로 변경
  const segmentation = await spawn(
    `cd ../../../../Machine Learning && dir && python segmentation.py 
    --trained_model=weights/yolact_plus_resnet50_cig_indoor_2473_4947_interrupt.pth 
    --config=yolact_resnet50_cig_indoor_config --score_threshold=0.3 --top_k=15 
    --image=data/train/images/kor_bedroom1.jpg:data/eval_result/kor_bedroom1.jpg 
    --display_bbox=False --display_text=False `
  )
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
imageRouter.post('/select-style', ifIsLoggedIn, async (req, res) => {})

/** 원하는 테마 이미지 업로드 */
imageRouter.post('/upload-style', ifIsLoggedIn, uploadTheme.single('theme'), async (req, res) => {
  // @ts-ignore
  // const userId = req.user.id
  if (process.env.NODE_ENV === 'dev') {
    // @ts-ignore
    req.file.location = req.file.filename
  }
  // @ts-ignore
  res.cookie('theme', req.file.filename, { maxAge: 1000 * 60 * 10 })
  res.status(200).json({ message: 'upload succuss' })
})

/** 영역 설정 */
// ! 일단 보류
imageRouter.post('/select-area', ifIsLoggedIn, async (req, res) => {})

/** 결과 보기 */
imageRouter.get('/seg', async (req, res) => {
  // * package.json 기준
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

  const process = spawn(
    `cd ../../../../Machine Learning && dir && python local_style_transfer.py --image_path './fg_bg/' --targets "tv01, tv02, tv03, pillow00" --vgg_path './pth/style_transfer/vgg_normalised.pth' --decoder_path './pth/style_transfer/decoder.pth' --content_image './data/train/images/kor_bedroom1.jpg' --style_image './data/style/modern/blue.jpg' --output_style_path './fg_bg/stylized.jpg' --style_intensity 'Middle' --fg_image_path "./fg_bg/fg_result.jpg" --bg_image_path "./fg_bg/bg_result.jpg" --stylized_image_path "./fg_bg/stylized.jpg" --output_local_style_path "./local_stylized.jpg"`,
    { shell: true, cwd: __dirname }
  )

  process.stdout.on('data', (data) => {
    console.log(data.toString())
  }) // 실행 결과

  process.stderr.on('data', (data) => {
    console.error(data.toString())
  }) // 실행 >에러
  res.status(200).json({})
})

module.exports = { imageRouter }
