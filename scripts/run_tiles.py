import os

f = open('pretiled.txt', 'r')

images = f.readlines()
images = map(lambda x: x.strip(' \n'), images)

base_input = "../imgs/"
base_output = "../tiles/"

tracking_dict = {}

for imagename in images:
    imagefile = os.path.join(base_input, imagename)
    key = imagename[0:9]
    if key in tracking_dict:
        tracking_dict[key].append(imagename)
    else:
        tracking_dict[key] = [ imagename ]

    output_directory = os.path.join(base_output, key)
    output_directory = os.path.join(output_directory, str(len(tracking_dict[key])));
    
    #print "./imgproc %s %s" % (imagefile, output_directory)

    os.system("./imgproc %s %s" % (imagefile, output_directory));
