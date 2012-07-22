import sys, os
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


im = Image.open(sys.argv[1])

im.save("copy_%s" % sys.argv[1], "TIFF",  compression=LZW)
os.unlink(sys.argv[1])
os.rename("copy_%s" % sys.argv[1], sys.argv[1])
