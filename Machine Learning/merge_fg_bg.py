from PIL import Image
import numpy as np
import os
import argparse

parser = argparse.ArgumentParser(description='Arguments')

parser.add_argument('--image_path', required=True, help = 'fg image path')

args = parser.parse_args()

image_path = args.image_path

def merge_bg(targets):
  images = os.listdir(image_path) # image files in image path(ex : bg_tv1.jpg)
  target_images = []
  for image in images:
    if image[0:2]=='bg': # check if bg image
      label = image[3:-4] # (ex : tv1, tv2,,,)
      if label in targets : # put every target images into target_images list
        target_images.append(image)

  result = np.array(PIL.Image.open(image_path + target_images[0])) # set result image as first target image
  if len(target_images)>1: # if multiple labels are selected, merge them
    for i in range(1, len(target_images)):
      img = image_path+target_images[i] # (ex : ./bg_tv1.jpg)
      img = PIL.Image.open(img) # open as PIL image
      img = np.array(img) # use as numpy array
      result = np.where((img!=result)&(img<=result), img, result) # merge bg_image
  result_img = PIL.Image.fromarray(result, 'RGB') # numpy to image
  result_img.save(image_path+"bg_result.jpg") # save image

def merge_fg(targets):
  images = os.listdir(image_path) # image files in image path(ex : bg_tv1.jpg)
  target_images = []
  for image in images:
    if image[0:2]=='fg': # check if fg image
      label = image[3:-4] # (ex : tv1, tv2,,,)
      if label in targets : # put every target images into target_images list
        target_images.append(image)

  result = np.array(PIL.Image.open(image_path + target_images[0])) # set result image as first target image
  if len(target_images)>1: # if multiple labels are selected, merge them
    for i in range(1, len(target_images)):
      img = image_path+target_images[i] # (ex : ./bg_tv1.jpg)
      img = PIL.Image.open(img) # open as PIL image
      img = np.array(img) # use as numpy array
      result = np.where((img!=result)&(img>=result), img, result) # merge fg_image
  result_img = PIL.Image.fromarray(result, 'L') # numpy to image
  result_img.save(image_path+"fg_result.jpg") # save image

# 사용자가 여러 개의 object를 선택한 경우
if len(targets)>=2:
  merge_bg(targets) # merge bg of targets
  merge_fg(targets) # merge fg of targets
# 사용자가 하나의 object를 선택한 경우
else:
  fg = image_path+'fg_'+targets[0]+'.jpg'
  fg = PIL.Image.open(fg)
  fg.save(image_path+'fg_result.jpg')

  bg = image_path+'bg_'+targets[0]+'.jpg'
  bg = PIL.Image.open(bg)
  bg.save(image_path+'bg_result.jpg')
