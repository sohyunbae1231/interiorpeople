import requests
import shutil
from bs4 import BeautifulSoup
import os
import cv2
import numpy as np
import argparse

from pyimagesearch import config
from torchvision import models
# import numpy as np
# import argparse
import torch
# import cv2

parser = argparse.ArgumentParser(description='Arguments')

parser.add_argument('--targets', required=True, help = 'targets')
parser.add_argument('--search_img_path', required=True, help = 'search image path')
parser.add_argument('--crawling_img_path', required=True, help = 'crawling image path')
parser.add_argument('--color', required=True, help = 'color of style')

args = parser.parse_args()

crawling_img_path = args.crawling_img_path
targets = args.targets
search_img_pth = args.search_img_path
color = args.color

targets = targets.split(", ")

MODELS = {
	"resnet": models.resnet50(pretrained=True)
}
# load our the network weights from disk, flash it to the current
# device, and set it to evaluation mode
model = MODELS["resnet"].to(config.DEVICE)
model.eval()

total_info = []
# ======= FUNCTIONS ========= #
def preprocess_image(image):
    # swap the color channels from BGR to RGB, resize it, and scale
    # the pixel values to [0, 1] range
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (config.IMAGE_SIZE, config.IMAGE_SIZE))
    image = image.astype("float32") / 255.0
    # subtract ImageNet mean, divide by ImageNet standard deviation,
    # set "channels first" ordering, and add a batch dimension
    image -= config.MEAN
    image /= config.STD
    image = np.transpose(image, (2, 0, 1))
    image = np.expand_dims(image, 0)
    # return the preprocessed image
    return image

def isTarget(img_pth, target):
  image_path = img_pth
  image = cv2.imread(image_path)
  orig = image.copy()
  image = preprocess_image(image)
  image = torch.from_numpy(image)
  image = image.to(config.DEVICE)
  # load the preprocessed the ImageNet labels
  imagenetLabels = dict(enumerate(open(config.IN_LABELS)))

  # classify the image and extract the predictions
  logits = model(image)
  probabilities = torch.nn.Softmax(dim=-1)(logits)
  sortedProba = torch.argsort(probabilities, dim=-1, descending=True)

  for(_, idx) in enumerate(sortedProba[0, :5]):
    if target in imagenetLabels[idx.item()].strip():
      return True
  return False

def getData(url):
  headers = {
    'Host': 'www.amazon.fr',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'TE': 'Trailers'
  }

  r = requests.get(
         url, headers=headers)
  soup = BeautifulSoup(r.text, 'html.parser')
  return soup

def getNextPage(soup):
  pages = soup.find('ul', {'class' : 'a-pagination'})
  
  if pages is not None:
    if not pages.find('li', {'class': 'a-disabled a-last'}):
      url = 'https://www.amazon.com' + str(pages.find('li', {'class': 'a-last'}).find('a')['href'])
      return url
    else:
      return

def createFolder(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory)
    except OSError:
        print ('Error: Creating directory. ' +  directory)

# === MAIN CODE === #

def run():
  target_idx = -1
  while_break = False
  total_info = []

  for product in targets:
    target_idx+=1
    prod_info = []

    # Get Product Name
    target = product # ex : bed00
    product = product[:-2] # ex : bed

    if "bed" in product:
      search_product = "bed+set"
    if "chair" in product:
      search_product = "sofa+chair"
    
    search_product = color+"+"+search_product # search product with color

    # Create Product's Crawling Image Folders
    createFolder(crawling_img_path+target+'/')

    # Get Product's URL (first page)
    url =  "https://www.amazon.com/s?k="+search_product+"&ref=nb_sb_noss_1"
    
    # product index for image name
    prod_idx = 0
    while True:
      soup = getData(url) # get current page soup
      if "denied" in soup:
        print("Acess Denied!!")
        print("Stopping Recommendation of "+target+"..")
        break
      url = getNextPage(soup) # get next page url

      results = soup.find_all('div', {'data-component-type': 's-search-result'})
      image_path = crawling_img_path

      for i in range(len(results)):
        item = results[i]
        atag = item.h2.a
        description = atag.text.strip()

        # Get object which has price information
        if item.find('span', 'a-price'):
          # get product images
          item_path = image_path+target+'/'+product+str(format(prod_idx, '02'))+'.jpg' # define item path
          image_parent = item.find('div', 'a-section aok-relative s-image-square-aspect')
          image = image_parent.find('img', 's-image')
          image_url = image.attrs['src'] # get image url
          prod_idx+=1
          r = requests.get(image_url, stream=True) #Get request on full_url

          # save image at item_path
          if r.status_code == 200:                     #200 status code = OK
            with open(item_path, 'wb') as f: 
                r.raw.decode_content = True
                shutil.copyfileobj(r.raw, f)
          my_img_pth = search_img_pth

          if len(prod_info) == 3:
            while_break = True
            break
          # if isSimilarColor(my_img_pth, item_path):
          if isTarget(item_path, target[:-2]):
            prod_url = "https://amazon.com"+item.find('a', {'class': 'a-link-normal s-no-outline'}).get('href')
          
            # get product price
            price_parent = item.find('span', 'a-price')
            price = price_parent.find('span', 'a-offscreen').text
            price = str(format(int(round(float(price[:-1].replace(',','.'))*1340,0)), ','))+"원" # convert euro to won

            # append to prod_info list
            prod_info.append([item_path, prod_url, price])

          # if not similar, remove the saved crawling image.
          else:
            os.remove(item_path)
      if while_break:
        while_break = False
        break

      if not url:
        break
      # print(url)
    print(prod_info)
    total_info.append(prod_info)
  print(total_info)
  print("Done")
  return total_info
run()
