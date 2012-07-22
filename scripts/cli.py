import sys
import getopt

verbose = False

def printHelp():
    

def processArgs(args):
    for a, v in args:
        if a == 'h' or a == '--help':
            printHelp()
            sys.exit()

if __name__ == '__main__':
    commands = "hvs:u:"
    long_commands = [
        "--help",
        "--verbose",
        "--save",
        "--base_url"
    ]
    
    inputs = sys.argv[1:]
    args = getopt.getopt(inputs, commands, long_commands)
    try:
        filename = inputs[0]
        #fetch 

        processArgs(args)

    except:
        #TODO: Error Message
        pass
