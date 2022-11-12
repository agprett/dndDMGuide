import json

def addEncounter(data, filename):
  with open(filename,'r+') as file:
    file.seek(0)

    json.dump(data, file, indent = 2)