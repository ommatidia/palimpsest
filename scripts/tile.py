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


import os, sys
import math

#requires PIL
import Image

tileSize = (256, 256)
imageSource = "/home/ommatidia/repos/palimpsest/imgs/"

def getNativeZoomLevel(image, tileSize):
    imageWidth = image.size[0]
    imageHeight = image.size[1]

    horzRatio = imageWidth / tileSize[0];
    vertRatio = imageHeight/ tileSize[1];
    
    horzTiles = math.ceil(horzRatio)
    vertTiles = math.ceil(vertRatio)

    zoomH = math.log(horzTiles, 2)
    zoomV = math.log(vertTiles, 2)

    return math.max(zoomH, zoomV)



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
args = sys.argv[1:]
filename= args[0]
#level = 1 if len(args) < 2 else int(args[1])
#tiles = pow(2, level)
#tile(filename, tiles, tiles)
createTiles(filename)
