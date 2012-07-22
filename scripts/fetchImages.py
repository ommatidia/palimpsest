import os, sys, errno
import urllib
import curses

from functools import partial
from multiprocessing import Pool, Semaphore, Value, Process, Manager

#shared globals
stdscr = None
line_number = None
linenum_semaphore = None

def pool_data_init(dictionary, i_stdscr, i_line_number, i_linenum_semaphore):
    global line_number, stdscr, linenum_semaphore
    stdscr = i_stdscr
    line_number = dictionary['line_number']
    linenum_semaphore = dictionary['linenum_semaphore']

def putline(string, color=0, line=None):
    global line_number, linenum_semaphore, stdscr
    linenum_semaphore.aquire()

    y = line_number.value if line is None else line
    stdscr.addstr(y, 0, ("%s>> " % y) + string, curses.color_pair(color))
    if line is None: line_number.value += 1
    linenum_semaphore.release()

    stdscr.refresh()
    
def getProgressHook(filename, num):
    ctl_char = '='
    bar = 50 #characters wide    
    def dlProgress(count, blockSize, totalSize):
        progress = count*blockSize
        percent = float(progress)/float(totalSize)
        rem = float(totalSize - progress)
        mb = rem / 1048576.0
        
        done = ctl_char * int(bar*percent)
        todo = ' ' * int(bar*(1.0-percent))
        prog_disp = "[%s%s]" % (done, todo)
        line = "num=%s, %s: %s %3.2f%% Complete %5.2f MB Remaining" % (num, filename, prog_disp, (percent*100.0), mb)

        putline(line, line=num, color=1)

    return dlProgress

def getfile(im_filename, directory='.'):
    base = "http://archimedespalimpsest.net/Data/"    
    im_url = base + im_filename[0:9] + '/' + im_filename
    save_filename = directory + '/' + im_filename

    global linenum_semaphore, line_number
    linenum_semaphore.acquire()
    temp = line_number.value
    line_number.value += 1
    linenum_semaphore.release()

    urllib.urlretrieve(im_url, save_filename, reporthook=getProgressHook(im_filename, temp))

def init(d, i_stdscr, i_line_number, i_linenum_semaphore):
    global linenum_semaphore, line_number, stdscr
    stdscr = i_stdscr
    line_number = i_line_number
    linenum_semaphore = i_line_number_semaphore

    putline("Retrieving Archimedes Digital Project File List...")
    filelist = "http://archimedespalimpsest.net/1_FileList.txt"
    handle = urllib.urlopen(filelist)
    files = handle.readlines()
    handle.close()
    
    putline("Filtering Files for Tifs")
    imagePredicate = lambda x: x.find('.tif') != -1 and x.find('.md5') == -1
    imagefiles = filter(imagePredicate, files)
    imagefiles = map(lambda x: x.strip(' -\n\r'), imagefiles)
    
    args = sys.argv[1:]
    try:
        directory = args[0]
        try:
            os.mkdir(directory)
        except OSError, e:
            if e.errno != errno.EEXIST:
                raise e
    except:
        directory = '.'
            
    try:
        pool_size = int(args[1])
    except:
        pool_size = 5
    
    d['pool_size'] = pool_size
    d['imagefiles'] = imagefiles
    d['directory'] = directory

    putline("Beginning Retrieval of Archimedes Tif Files to %s" % directory)

if __name__ == '__main__':

    i_stdscr = curses.initscr()
    curses.start_color()
    curses.init_pair(1, curses.COLOR_RED, curses.COLOR_BLACK)
    curses.noecho()

    i_linenum_semaphore = Semaphore(1) #semaphore to manage writing
    i_line_number = Value('i', 0) #shared c_type 

    manager = Manager()
    dictionary = manager.dict()
    dictionary['pool_size'] = 4
    dictionary['directory'] = '.'
    dictionary['imagefiles'] = []
    initargs = (dictionary, i_stdscr, i_line_number, i_linenum_semaphore)
    
    filelist = Process(target=init, args=initargs)
    filelist.start()
    filelist.join()

    pool = Pool(processes=dictionary['pool_size'], initializer=pool_data_init, initargs=initargs)
    func = partial(getfile, directory=dictionary['directory'])
    pool.map(func, dictionary['imagefiles'])
    pool.close()
    pool.join()
    
    stdscr.endwin()
