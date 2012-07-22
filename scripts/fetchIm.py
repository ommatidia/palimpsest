import os, sys, errno
import urllib
from functools import partial

import tempfile

# install standard driver
import Image, TiffImagePlugin 

LZW      = "lzw:2"
ZIP      = "zip"
JPEG     = "jpeg"
PACKBITS = "packbits"
G3       = "g3"
G4       = "g4"

def _save(im, fp, filename):
    
    # check compression mode
    try:
        compression = im.encoderinfo["compression"]
    except KeyError:
        # use standard driver
        TiffImagePlugin._save(im, fp, filename)
    else:
        # compress via temporary file
        if compression not in (LZW, ZIP, JPEG, PACKBITS, G3, G4):
            raise IOError, "unknown compression mode"
        file = tempfile.mktemp()
        im.save(file, "TIFF")
        os.system("tiffcp -c %s %s %s" % (compression, file, filename))
        try: os.unlink(file)
        except: pass

Image.register_save(TiffImagePlugin.TiffImageFile.format, _save)

#TODO: tempfile
def lzw2_compress(filename):
    if filename.find('/') != -1:
        (directory, name) = filename.rsplit('/', 1)
        tempname = "%s/copy_%s" % (directory, name)
    else:
        tempname = "copy_%s" % filename

    im = Image.open(filename)
    try:
        im.save(tempname, "TIFF", compression=LZW)
        os.unlink(filename)
        os.rename(tempname, filename)
    except OSError, e:
        print e
    del im

complete = 0
total = 0
    
def getProgressHook(filename):
    ctl_char = '='
    bar = 50 #characters wide    
    def dlProgress(count, blockSize, totalSize):
        global complete, total
        progress = count*blockSize
        percent = float(progress)/float(totalSize)
        rem = float(totalSize - progress)
        mb = rem / 1048576.0
        
        done = ctl_char * int(bar*percent)
        todo = ' ' * int(bar*(1.0-percent))
        prog_disp = "[%s%s]" % (done, todo)
        line = "[%d of %d] %s: %s %3.2f%% Complete %5.2f MB Remaining" % (complete+1, total, filename, prog_disp, (percent*100.0), mb)

        sys.stdout.write(line + "\r")
        sys.stdout.flush()

    return dlProgress

def getfile(im_filename, directory='.'):
    base = "http://archimedespalimpsest.net"    
    im_url = base + im_filename
    displayname = im_filename[im_filename.rfind('/')+1:]
    save_filename = os.path.join(directory, displayname)
 
    
    global complete
    if not os.path.exists(save_filename):
        urllib.urlretrieve(im_url, save_filename, reporthook=getProgressHook(displayname))
        sys.stdout.write("\nCompressing file:\n")
        sys.stdout.write("\ttiffcp -c lzw:2 {tempfile} %s\n" % save_filename)
        lzw2_compress(save_filename)
    else:
        sys.stdout.write("[%d of %d] %s: Already exists. Skipping...\n" % (complete+1, total, displayname))
    sys.stdout.flush()
    
    complete += 1

    if sys.stdout.isatty():
        if complete % 100 == 0:
            os.system("clear")

def init(d): #TODO: real cli options
    args = sys.argv[1:]
    try:
        directory = args[1]
        try:
            os.mkdir(directory)
        except OSError, e:
            if e.errno != errno.EEXIST:
                raise e
    except:
        directory = '.'

    try:
        source = args[0]
    except:
        source = 'images.txt'
        
    f = open(source)
    imagefiles = f.readlines()
    f.close()

    imagefiles = map(lambda x : x.strip('\n\r'), imagefiles)
    imagefiles = filter(lambda x : not x.startswith('#'), imagefiles)
    
    global total
    total = len(imagefiles)
            
    d['imagefiles'] = imagefiles
    d['directory'] = directory

    print("Beginning Retrieval of Archimedes Tif Files to %s" % directory)

if __name__ == '__main__':

    dictionary = {}
    init(dictionary)

    get = partial(getfile, directory=dictionary['directory'])
    
    failed = list()
    def failures(imagefile, myfn=lambda x : x):
        try:
            myfn(imagefile)
        except:
            failed.append(imagefile)
            
    wrappedget = partial(failures, myfn=get)
    map(wrappedget, dictionary['imagefiles'])

    f = open('failed.txt', 'w')
    for x in failed:
        f.write(x + '\n')
    f.flush()
    f.close()

