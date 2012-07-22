import curses
import time
from multiprocessing import Process, Semaphore

def worker(scr, i, semaphore):
    time.sleep(1)
    semaphore.acquire()
    scr.addstr(i, 0, "Hi(%d)\n" % i)
    semaphore.release()

if __name__ == '__main__':
    scr = curses.initscr()

    write = Semaphore(1)
    ps = [Process(target=worker, args=(scr, i, write)) for i in range(0, 15)]
    for p in ps:
        p.start()
    for p in ps:
        p.join()

    scr.refresh()
    time.sleep(5)

    curses.endwin()

