from flask import Flask, render_template, request, config
from flask_cors import CORS
import requests, json
from controller import *

encountersRaw = open('./json/encounters.json')
encountersData = json.load(encountersRaw)

app = Flask(__name__)
CORS(app)

monstersData = requests.get('https://www.dnd5eapi.co/api/monsters').json().get('results')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/encounters')
def encounters():
  return render_template('encounters.html')

@app.route('/encounter-builder')
def encountersBuilder():
  return render_template('encounter-builder.html')

@app.route('/api/encounters', methods=['GET', 'POST'])
def apiEncounters():
  if request.method == 'GET':
    return encountersData
  
  if request.method == 'POST':
    print(type(encountersData[len(encountersData) - 1]['id']))
    # encounterId = encountersData[len(encountersData) - 1].id or 1
    encounterId = 2
    newEncounter = {}

    newEncounter['name'] = f'Encounter {encounterId}'
    newEncounter['monsters'] = request.json.get('monsters')
    newEncounter['players'] = encountersData[0]['players']
    newEncounter['id'] = encounterId
    newEncounter['description'] = ''

    encounterId += 1

    encountersData.append(newEncounter)

    addEncounter(encountersData, './json/encounters.json')
    
    return 'Encounter was created'

@app.route('/api/monsters', methods=['GET'])
def apiMonster():
  if request.method == 'GET':
    if len(monstersData) > 0:
      return monstersData
    else:
      return 'Unable to get monsters'

encountersRaw.close()