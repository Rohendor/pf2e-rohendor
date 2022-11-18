import csv
import os
import json

path = "/home/rohendor/.local/share/FoundryVTT/ProjectSandro/pf2e-rohendor/packs/data/feats.db/"
filepath = path


with open('RadGridExport2.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
            line_count += 1
            for (root, dirs, file) in os.walk(path):
                for f in file:
                        print("sto processando il file " + f)
                        found = False; 
                        js = open(filepath + f)
                        data = json.load(js)
                        if (row[0]==data['name'] and data['system']['level']['value'] != None):
                                found = True
                                print("è una skill feat con livello")
                        js.close
                        if (found):
                                tmp = data['system']
                                data['system']['level']['value'] = None
                                jsonFile = open(filepath+f, "w+")
                                jsonFile.write(json.dumps(data, indent=4))
                                jsonFile.close()
                                print ("skill feat aggiornata correttamente" + f)