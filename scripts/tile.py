"""
This script is distributed under the MIT license.

Author: Greg Echelberger
Date: 7/22/2012

This script will accept an image, tileSize, and output directory. The maximum zoom level
that the original image can support will be calculated and the output directory will be populated 
with tiled images in lossless png by zoom levels 0 through the calculated native zoom level.

These tiles are meant as tileserver source for a google maps imageTypeMap client implementation.

The native Zoom level is rounded up, and padding is added where extra tiles are required to meet
the exponentially increasing number of tiles to fill a mathematically pure zoom.

"""


import os, sys, shutil
import math

#requires PIL
import Image

from functools import partial

tileSize = (256, 256)
imageName = "079r-074v_Alex03r_Sinar_LED365_01_PCA3.tif"
imageSource = "/home/ommatidia/repos/palimpsest/imgs/"
outputDir = "/home/ommatidia/repos/palimpsest/tiles/"

def tileLevel(level, image, tileSize, outputDir):
    zoomDir = os.path.join(outputDir, str(level))
    try:
        os.mkdir(zoomDir)
    except OSError, e:
        print e
    
        #BLARG... TODO ON PAPER
    grid_width = 1 << level
    grid_size = (tileSize[0] * grid_width, tileSize[1]*grid_width)
    newsize = 
    offsets = ((image.size[0]-newsize[0])/2,(image.size[1]-newsize[1])/2)
    canvas = Image.new('RGBA', grid_size)
    canvas.paste(image, offsets)
    
    newimage = image.resize(newsize, Image.ANTIALIAS)
    
    bounding = [0,0,0,0]

    x = 0
    while x < newimage.size[0]:
        bounding[0] = x
        y = 0
        bounding[2] = min(x + tileSize[0], newimage.size[0])
        while y < newimage.size[1]:
            bounding[1] = y
            bounding[3] = min(y + tileSize[1], newimage.size[1])
            
            region = newimage.crop(bounding)
            filename = "%s_%s.png" % (str(int(math.floor(x/tileSize[0]))), str(int(math.floor(y/tileSize[1]))))
            region.save(os.path.join(zoomDir, filename), "PNG")

            y += tileSize[1]
        x += tileSize[0]
        
    
    

def tileImage(imagefile, tileSize, outputDir):
    image = Image.open(imagefile)

    index = imagefile.rfind('/') + 1
    tileDir = os.path.join(outputDir, imagefile[index:index+9]) #will require more thought

    try:
        shutil.rmtree(tileDir)
    except:
        print "shutil.rmtree failed"

    try:
        os.mkdir(tileDir)
    except OSError, e:
        print e

    nativeZoomLevel = getNativeZoomLevel(image, tileSize)
    for level in range(0, nativeZoomLevel):
        tileLevel(level, image, tileSize, tileDir)
    


def init(sourceDir, outputDir, tileSize):
    try:
        os.mkdir(outputDir)
    except OSError, e:
        print e

    #images = [sourceDir + x for x in os.listdir(sourceDir)]
    images = [sourceDir + x for x in [imageName]]
    myfn = partial(tileImage, tileSize=tileSize, outputDir=outputDir)
    map(myfn, images)

if __name__ == "__main__":
    init(imageSource, outputDir, tileSize)

def getNativeZoomLevel(image, tileSize):
    imageWidth = image.size[0]
    imageHeight = image.size[1]

    horzRatio = imageWidth / tileSize[0];
    vertRatio = imageHeight/ tileSize[1];
    
    horzTiles = math.ceil(horzRatio)
    vertTiles = math.ceil(vertRatio)

    zoomH = math.log(horzTiles, 2)
    zoomV = math.log(vertTiles, 2)

    return int(math.ceil(max(zoomH, zoomV)))



def createLevel(image, grid_size, out_folder):
    tile_w = image.size[0] / grid_size
    tile_h = image.size[1] / grid_size
    for x_i in range(0, grid_size):
        x = x_i * tile_w
        for y_i in range(0, grid_size):
            y = y_i * tile_h
            box = (x, y, x+tile_w, y+tile_h)
            region = image.crop(box)
            out_file = out_folder + "out_x%s_y%s.jpg" % (x_i, y_i)
            region.save(out_file, "JPEG")    

def createTiles(filename):
    im = Image.open(filename)
    baseIndex = filename.rfind('/')
    if baseIndex == -1:
        base_folder = './'
    else:
        base_folder = filename[0: baseIndex+1]
        
    for level in range(1, 6):
        tiles = pow(2, level)
        folder = base_folder + ('zoom_%s/' % level)
        os.mkdir(folder)
        createLevel(im, tiles, folder)
        
        


#TODO:args->tile(args)
#args = sys.argv[1:]
#filename= args[0]
#level = 1 if len(args) < 2 else int(args[1])
#tiles = pow(2, level)
#tile(filename, tiles, tiles)
#createTiles(filename)
