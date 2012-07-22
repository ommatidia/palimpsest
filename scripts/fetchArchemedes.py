import os, sys, errno
import urllib

def init():
    print("Retrieving Archimedes Digital Project File List...")
    filelist = "http://archimedespalimpsest.net/1_FileList.txt"
    handle = urllib.urlopen(filelist)
    files = handle.readlines()
    handle.close()

    print("Filtering Files for Tifs and Folders...")
    imagePredicate = lambda x: (x.find('.tif') != -1 and x.find('.md5') == -1) or x.startswith("* /Data/")
    imagefiles = filter(imagePredicate, files)

    print("Resolving Paths with folders...")
    prefix = ''
    for i in range(0, len(imagefiles)):
        if imagefiles[i].startswith('* /Data/'):
            prefix = imagefiles[i].strip(' *:\n\r')
        else:
            imagefiles[i] = imagefiles[i].strip(' -\n\r')
            #os.path.join
            imagefiles[i] = "%s/%s" % (prefix, imagefiles[i])
            
    print("Removing Folder entries")
    imagefiles = filter(lambda x: not x.startswith('* /Data/'), imagefiles)

    return imagefiles


if __name__ == '__main__':

    imagefiles = init()

    f = open('images.txt', 'w')
    for filename in imagefiles:
        f.write(filename + "\n")

    f.flush()
    f.close()
    




