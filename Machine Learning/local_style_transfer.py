from PIL import Image
import numpy as np
import argparse

parser = argparse.ArgumentParser(description='Arguments')

parser.add_argument('--fg_image_path', required=True, help = 'fg image path')
parser.add_argument('--bg_image_path', required=True, help = 'bg image path')
parser.add_argument('--stylized_image_path', required=True, help = 'stylized image path')
parser.add_argument('--output_path', required=True, help = 'output image path')

args = parser.parse_args()

fg_image_path = args.fg_image_path
bg_image_path = args.bg_image_path
stylized_image_path = args.stylized_image_path
output_path = args.output_path

fg_image = Image.open(fg_image_path)
fg_image = np.array(fg_image)
fg_image = np.stack((fg_image,)*3, axis=-1)
bg_image = Image.open(bg_image_path)
bg_image = np.array(bg_image)
stylized_image = Image.open(stylized_image_path)
stylized_image = np.array(stylized_image)

fg_styled_image = stylized_image*(fg_image>=stylized_image)
local_styled_image = fg_styled_image + bg_image

local_styled_image = Image.fromarray(local_styled_image, 'RGB')
local_styled_image.save(output_path)
