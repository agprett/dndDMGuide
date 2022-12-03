from flask import Flask, render_template, request
from flask_cors import CORS
import requests, json

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

@app.route('/api/encounters', methods=['GET', 'POST', 'DELETE'])
def apiEncounters():
  if request.method == 'GET':
    encountersRaw = open('./json/encounters.json')
    encountersData = json.load(encountersRaw)

    encountersRaw.close()

    return encountersData
  
  if request.method == 'POST':
    encountersRaw = open('./json/encounters.json', 'r+')
    encountersData = json.load(encountersRaw)

    encounterId = encountersData[len(encountersData) - 1]['id'] + 1 or 1
    newEncounter = {}

    newEncounter['id'] = encounterId
    newEncounter['name'] = f'Encounter {encounterId}'
    newEncounter['description'] = ''
    newEncounter['monsters'] = request.json.get('monsters')
    newEncounter['players'] = request.json.get('players')

    encountersData.append(newEncounter)

    encountersRaw.seek(0)

    json.dump(encountersData, encountersRaw, indent = 2)
    
    encountersRaw.close()

    return 'Encounter was created'

  if request.method == 'DELETE':
    encountersRaw = open('./json/encounters.json', 'r')
    encountersData = json.load(encountersRaw)

    del encountersData[int(request.args.get('index'))]

    encountersRaw.close()

    with open('./json/encounters.json', 'w') as file:
      json.dump(encountersData, file, indent = 2)

    return 'Encounter deleted'

@app.route('/api/players', methods=['GET', 'POST'])
def apiPlayers():
  if request.method == 'GET':
    playersRaw = open('./json/players.json')
    playersData = json.load(playersRaw)

    playersRaw.close()

    return playersData

  if request.method == 'POST':
    playersRaw = open('./json/players.json', 'r+')
    playersData = json.load(playersRaw)

    playerId = playersData[len(playersData) - 1]['id'] + 1 or 1
    newPlayer = {}

    newPlayer['id'] = playerId
    newPlayer['name'] = request.json.get('name')
    newPlayer['hit_points'] = request.json.get('hit_points')

    playersData.append(newPlayer)

    playersRaw.seek(0)

    json.dump(playersData, playersRaw, indent = 2)
    
    playersRaw.close()

    return 'Player was created'

@app.route('/api/monsters', methods=['GET'])
def apiMonster():
  if request.method == 'GET':
    if len(monstersData) > 0:
      return monstersData
    else:
      return 'Unable to get monsters'