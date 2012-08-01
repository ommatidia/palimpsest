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
    
from itertools import izip
for key in tracking_dict:
    img_list = tracking_dict[key]
    x = dict(izip(xrange(1, len(img_list)+1), iter(img_list)))
    tracking_dict[key] = x

lastkey = None
for x in iter(sorted(tracking_dict)):
    inner = tracking_dict[x]
    inner['_length'] = len(inner)
    inner['_prev'] = lastkey
    if lastkey is not None:
        tracking_dict[lastkey]['_next'] = x

    lastkey = x
    inner['_next'] = None
        
f  = open('map.txt', 'w');
import simple_json as json
output = json.dumps(tracking_dict, indent='    ', sort_keys=True)
#f.write('\n'.join([l.strip() for l in output.splitlines()]))
f.write(output)
f.flush()
f.close()
