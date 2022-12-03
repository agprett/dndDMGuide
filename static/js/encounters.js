const displayedEncounter = document.getElementById('displayed-encounter')

const displayActions = (actions) => {
  const actionsDiv = document.createElement('div')
  actions.forEach(action => {
    const singleAction = document.createElement('div')
    singleAction.innerHTML = `<br><p>${action.name}</p>
    <p>${action.desc}</p>`

    actionsDiv.appendChild(singleAction)
  })

  return actionsDiv
}

class Initiative {
  constructor(){
    this.turnOrder = []
    this.encounterCharacters = []
    this.position = 0
  }

  resetCharacters() {
    this.encounterCharacters = []
    this.turnOrder = []
    this.position = 0
  }

  addCharacter(id) {
    this.encounterCharacters.push(id)
  }

  orderTurns() {
    let activeTurn = document.querySelectorAll('.turn')
    
    if(activeTurn){
      activeTurn.forEach(ele => {
        ele.classList.remove('turn')
      })
      this.position = 0
      this.turnOrder = []
    }

    this.encounterCharacters.forEach(character => {
      const rolledInit = +document.getElementById(`${character}-initiative`).value

      if(rolledInit){
        this.turnOrder.push({id: character, initiative: rolledInit})
      }
    })

    if(this.turnOrder.length < 1){
      alert('Please add an initiative to at least one character.')
      return
    }

    this.turnOrder.sort((a, b) => {
      return b.initiative - a.initiative
    })

    document.getElementById(this.turnOrder[this.position].id).classList.toggle('turn')
  }

  changeTurn() {
    document.getElementById(this.turnOrder[this.position].id).classList.toggle('turn')

    if(this.position + 1 >= this.turnOrder.length){
      this.position = 0
    } else {
      this.position++
    }

    document.getElementById(this.turnOrder[this.position].id).classList.toggle('turn')
  }
  
  removeCharacter(id) {
    let index = this.encounterCharacters.indexOf(id)

    this.encounterCharacters.splice(index, 1)

    index = this.turnOrder.findIndex(turn => turn.id === id)

    if(index !== -1){
      if(this.position === index){
        document.getElementById(this.turnOrder[this.position].id).classList.toggle('turn')

        if(this.position + 1 >= this.turnOrder.length){
          this.position = 0
        } else {
          this.position++
        }
    
        document.getElementById(this.turnOrder[this.position].id).classList.toggle('turn')
      }

      this.turnOrder.splice(index, 1)
    }
    
  }
}

class MonsterSpecsDisplays {
  constructor(data, id){
    this.data = data
    this.domObject = {}
  }

  buildObject() {
    const monsterSpecs = document.createElement('div')
    monsterSpecs.classList.add('monster-specs', 'torn-edge')
    monsterSpecs.setAttribute('id', `${this.data.index}-monster-specs`)

    const closeAction = () => {
      this.closeSpecs()
    }

    const closeBtn = document.createElement('button')
    closeBtn.classList.add('close-info-button')
    closeBtn.textContent = 'X'
    closeBtn.addEventListener('click', closeAction)

    const monsterHeader = document.createElement('div')
    monsterHeader.classList.add('monster-header')
    
    monsterHeader.innerHTML = `<h2 class="monster-name">${this.data.name}</h2>
    <p>&nbsp-&nbsp</p>
    <p>${this.data.size} ${this.data.type}${this.data.subtype ? ` (${this.data.subtype})` : ''}, ${this.data.alignment}</p>`

    if(this.data.desc) {
      monsterHeader.innerHTML += `<p class="monster-desc">${this.data.desc}</p>`
    }
    
    const monsterBaseInfo = document.createElement('div')
    monsterBaseInfo.classList.add('monster-base-info')

    monsterBaseInfo.innerHTML = `<p>AC: ${this.data.armor_class}</p>
      <p>Hit Points: ${this.data.hit_points} (Hit Die: ${this.data.hit_dice})</p>
    `

    const monsterSpeed = document.createElement('p')

    let speed = 'Speed: '

    let speedI = 0
    for(let key in this.data.speed){
      speed += `${key}: ${this.data.speed[key]}`
      
      if(speedI < Object.keys(this.data.speed).length - 1){
        speed += ', '
      }
      speedI++
    }

    monsterSpeed.innerHTML = speed

    monsterBaseInfo.appendChild(monsterSpeed)
    
    const monsterMainSkills = document.createElement('div')
    monsterMainSkills.classList.add('monster-main-skills')

    monsterMainSkills.innerHTML = `<p class="monster-main-skill">STR: ${this.data.strength} (${Math.floor((this.data.strength - 10) / 2)})</p>
      <p class="monster-main-skill">DEX: ${this.data.dexterity} (${Math.floor((this.data.dexterity - 10) / 2)})</p>
      <p class="monster-main-skill">CON: ${this.data.constitution} (${Math.floor((this.data.constitution - 10) / 2)})</p>
      <p class="monster-main-skill">INT: ${this.data.intelligence} (${Math.floor((this.data.intelligence - 10) / 2)})</p>
      <p class="monster-main-skill">WIS: ${this.data.wisdom} (${Math.floor((this.data.wisdom - 10) / 2)})</p>
      <p class="monster-main-skill">CHA: ${this.data.charisma} (${Math.floor((this.data.charisma - 10) / 2)})</p>
    `
    
    const monsterSubSkills = document.createElement('div')
    monsterSubSkills.classList.add('monster-sub-skills')

    let savingThrowsString = 'Saving Throws: '
    let skillsString = 'Skills: '

    let savingThrowData = []
    let skillsData = []

    this.data.proficiencies.forEach(element => element.proficiency.name.includes('Saving Throw') ? savingThrowData.push(element) : skillsData.push(element))
    
    if(savingThrowData[0]){
      savingThrowData.forEach((element, i) => {
        savingThrowsString += `${element.proficiency.name.replace('Saving Throw: ', '')}: +${element.value}`
        if(i < savingThrowData.length - 1){
          savingThrowsString += ', '
        }
      })

      monsterSubSkills.innerHTML += `<p>${savingThrowsString}</p>`
    }

    if(skillsData[0]){
      skillsData.forEach((element, i) => {
        skillsString += `${element.proficiency.name.replace('Skill: ', '')}: +${element.value}`
        if(i < skillsData.length - 1){
          skillsString += ', '
        }
      })

      monsterSubSkills.innerHTML += `<p>${skillsString}</p>`
    }

    if(this.data.senses) {
      let sensesString = 'Senses: '
      for(let sense in this.data.senses){
        sensesString += `${sense}: ${this.data.senses[sense]}`
        if(sense !== Object.keys(this.data.senses).pop()){
          sensesString += ', '
        }
      }

      monsterSubSkills.innerHTML += `<p>${sensesString}</p>`
    }

    monsterSubSkills.innerHTML += `<p>Language: ${this.data.languages}</p>
      <p>Challenge: ${this.data.challenge_rating} (${this.data.xp} XP)</p>
    `
    
    const monsterSpecialAbilities = document.createElement('div')
    monsterSpecialAbilities.classList.add('monster-special-abilities')
    
    monsterSpecialAbilities.innerHTML = `<p>Special Abilities</p>`
    
    const monsterActions = document.createElement('div')
    monsterActions.classList.add('monster-actions')
    
    monsterActions.innerHTML = `<h3>Actions</h3>`

    monsterActions.appendChild(displayActions(this.data.actions))

    const splitter = '<div class="splitter"></div>'
    
    monsterSpecs.appendChild(monsterHeader)
    monsterSpecs.innerHTML+= splitter
    monsterSpecs.appendChild(monsterBaseInfo)
    monsterSpecs.innerHTML+= splitter
    monsterSpecs.appendChild(monsterMainSkills)
    monsterSpecs.innerHTML+= splitter
    monsterSpecs.appendChild(monsterSubSkills)
    monsterSpecs.innerHTML+= splitter
    monsterSpecs.appendChild(monsterSpecialAbilities)
    monsterSpecs.innerHTML+= splitter
    monsterSpecs.appendChild(monsterActions)
    
    if(this.data.legendary_actions[0]) {
      const monsterLegendaryActions = document.createElement('div')
      monsterLegendaryActions.classList.add('monster-legendary-actions')
      
      monsterLegendaryActions.innerHTML = `<h3>Legendary Actions</h3>
      <p>The ${this.data.type} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The ${this.data.type} regains spent legendary actions at the start of its turn.</p>`
      
      monsterLegendaryActions.appendChild(displayActions(this.data.legendary_actions))
      
      monsterSpecs.innerHTML+= splitter
      monsterSpecs.appendChild(monsterLegendaryActions)
    }
    
    monsterSpecs.appendChild(closeBtn)

    this.domObject = monsterSpecs
  }

  displaySpecs() {
    displayedEncounter.appendChild(this.domObject)
  }
  
  closeSpecs() {
    displayedEncounter.removeChild(this.domObject)
  }
}

let encounterInitiative = new Initiative()

const adjustHealth = (id, type) => {
  const hpText = document.querySelector(`#${id}-hp`)
  const amount = document.getElementById(`${id}-hp-input`).value

  if(type === 'plus'){
    hpText.textContent = `Health: ${+hpText.textContent.match(/(\d+)/)[0] + +amount}`
  } else if(type === 'minus' && +hpText.textContent.match(/(\d+)/)[0] - +amount > 0){
    hpText.textContent = `Health: ${+hpText.textContent.match(/(\d+)/)[0] - +amount}`
  } else if(type === 'minus' && +hpText.textContent.match(/(\d+)/)[0] - +amount < 0){
    hpText.textContent = `Health: 0`
  }
}

const removeMonster = (id) => {
  const removedMonster = document.getElementById(id)

  encounterInitiative.removeCharacter(id)

  removedMonster.remove()
}

const createMonsterCards = (monster, apiMonsterInfo, i, specsObj) => {
  const monsterTracker = document.createElement('div')
  monsterTracker.classList.add('tracker')
  monsterTracker.setAttribute('id', `${apiMonsterInfo.index}-${i}`)
  
  monsterTracker.innerHTML = `<h2>${monster.name}-${i}</h2>
  <div class="health-display">
    <h3 class="tracker-health" id="${apiMonsterInfo.index}-${i}-hp">Health: ${apiMonsterInfo.hit_points}</h3>
    <div class="health-updater">
      <button onclick="adjustHealth('${apiMonsterInfo.index + '-' + i}', 'minus')">-</button>
      <input id="${apiMonsterInfo.index}-${i}-hp-input" class="health-updater-input" value="1" min="0"/>
      <button onclick="adjustHealth('${apiMonsterInfo.index + '-' + i}', 'plus')">+</button>
    </div>
  </div>
  <p>Initiative:</p>
  <input id='${apiMonsterInfo.index}-${i}-initiative' class='tracker-initiative'/>
  <button onclick="removeMonster('${apiMonsterInfo.index}-${i}')">Remove</button>`

  const infoAction = () => {
    specsObj.displaySpecs()
  }

  const infoButton = document.createElement('button')
  infoButton.classList.add('info-button')
  infoButton.textContent = 'i'
  infoButton.addEventListener('click', infoAction)

  monsterTracker.appendChild(infoButton)

  encounterInitiative.addCharacter(`${apiMonsterInfo.index}-${i}`)

  return monsterTracker
}

const monsterTrackerCreator = (data) => {
  const monsterView = document.getElementById('monster-view')

  const monsterSpecs = {}

  data.forEach(monster => {
    axios.get(`https://www.dnd5eapi.co${monster.url}`)
    .then(res => {
      const {data: apiMonsterInfo} = res

      monsterSpecs[`${apiMonsterInfo.index}-specs`] = new MonsterSpecsDisplays(apiMonsterInfo)

      monsterSpecs[`${apiMonsterInfo.index}-specs`].buildObject()
  
      for(let i = 1; i <= monster.amount; i++){
        let monsterTracker = createMonsterCards(monster, apiMonsterInfo, i, monsterSpecs[`${apiMonsterInfo.index}-specs`])
  
        monsterView.appendChild(monsterTracker)
      }

      const addSelect = document.getElementById('add-monster-select')
      newOption = document.createElement('option')
      newOption.innerHTML = apiMonsterInfo.name
      addSelect.appendChild(newOption)
    })
  })
}

const createPlayerCard = (player, i) => {
  const playerDiv = document.createElement('div')
  playerDiv.classList.add('tracker')
  playerDiv.setAttribute('id', `${player.name}-${i}`)
  
  playerDiv.innerHTML = `<h2>${player.name}</h2>
  <div class="health-display">
    <h3 class="tracker-health" id="${player.name}-${i}-hp">Health: ${player.hit_points}</h3>
    <div class="health-updater">
      <button onclick="adjustHealth('${player.name + '-' + i}', 'minus')">-</button>
      <input id="${player.name}-${i}-hp-input" class="health-updater-input" value="1" min="0"/>
      <button onclick="adjustHealth('${player.name + '-' + i}', 'plus')">+</button>
    </div>
  </div>
  <p>Initiative:</p>
  <input id='${player.name}-${i}-initiative' class='tracker-initiative'/>`

  encounterInitiative.addCharacter(`${player.name}-${i}`)

  return playerDiv
}

const playerTrackerCreator = (players) => {
  const playerView = document.getElementById('player-view')

  players.forEach((player, i) => {
    const playerDiv = createPlayerCard(player, i)

    playerView.appendChild(playerDiv)
  })
}

const deleteEncounter = (index) => {
  axios.delete(`/api/encounters?index=${index}`)
    .then(res => {
      alert(res.data)
      window.location.reload()
    })
}

const viewEncounter = (encounter, index) => {
  encounterInitiative.resetCharacters()
  
  displayedEncounter.innerHTML = `
    <div id='viewed-encounter-name-stuff'>
      <h2 id="encounter-name">${encounter.name}</h2>
      <button onclick='encounterInitiative.orderTurns()'>Set Initiative</button>
      <button onclick='encounterInitiative.changeTurn()'>Next Turn</button>
      <button onclick='deleteEncounter(${index})'>Delete Encounter</button>
    </div>
  `

  const encounterMonsters = document.createElement('div')
  encounterMonsters.setAttribute('id', 'encounter-monsters')
  encounterMonsters.innerHTML = '<h2 class="character-view-title">Monsters:</h2>'

  const monsterView = document.createElement('div')
  monsterView.setAttribute('id', 'monster-view')
  
  encounterMonsters.appendChild(monsterView)

  displayedEncounter.appendChild(encounterMonsters)
  
  const addMonsterForm = document.createElement('form')
  addMonsterForm.setAttribute('id', 'add-monster-form')
  addMonsterForm.innerHTML = `<h3>Add Monster</h3>
  <select id='add-monster-select'>
    <option selected disabled>Select One</option>
  </select>
  <input id='add-monster-amount' placeholder='amount' type='number' min=1>
  <button>Add</button>`

  encounterMonsters.appendChild(addMonsterForm)
  
  monsterTrackerCreator(encounter.monsters)

  const encounterPlayers = document.createElement('div')
  encounterPlayers.setAttribute('id', 'encounter-players')
  encounterPlayers.innerHTML = '<h2>Players:</h2>'
  
  const playerView = document.createElement('div')
  playerView.setAttribute('id', 'player-view')
  
  encounterPlayers.appendChild(playerView)
  
  displayedEncounter.appendChild(encounterPlayers)

  playerTrackerCreator(encounter.players)
}

const allEncountersDisplay = document.getElementById('all-encounters')

const displayEncounters = (encounters) => {
  allEncountersDisplay.innerHTML = ''

  encounters.forEach((encounter, i) => {
    const encounterDiv = document.createElement('div')
    encounterDiv.classList.add('encounter')

    encounterDiv.innerHTML = `<h2>${encounter.name}</h2>`

    const viewButton = document.createElement('button')
    viewButton.textContent = 'View'
    viewButton.addEventListener('click', () => viewEncounter(encounter, i))

    encounterDiv.appendChild(viewButton)

    allEncountersDisplay.appendChild(encounterDiv)
  });
}

const getEncounters = () => {
  axios.get('/api/encounters')
  .then(res => {
    displayEncounters(res.data)
  })
}

getEncounters()