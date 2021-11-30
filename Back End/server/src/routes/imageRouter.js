// @ts-check

/** 모듈 */
const { Router } = require('express')
const { spawn } = require('child_process')

const imageRouter = Router()

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
