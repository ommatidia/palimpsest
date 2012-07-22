import os, sys

#requires PIL
import Image


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
