const displayedEncounter = document.getElementById('displayed-encounter')

class Initiative {
  constructor(){
    this.turnOrder = []
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
      this.turnOrder.splice(index, 1)
    }
    
    if(this.position === index){
      document.getElementById(this.turnOrder[this.position].id).classList.toggle('turn')
    }
  }
}

let encounterInitiative = new Initiative()

const adjustHealth = (id, type) => {
  const input = document.querySelector(`#${id}-hp`)

  if(type === 'plus'){
    input.value = +input.value + 1
  } else if(type === 'minus' && +input.value > 0){
    input.value = +input.value - 1
  }
}

const removeMonster = (id) => {
  const removedMonster = document.getElementById(id)

  encounterInitiative.removeCharacter(id)

  removedMonster.remove()
}

const createMonsterCards = (monster, apiMonsterInfo, i) => {
  const monsterDiv = document.createElement('div')
  monsterDiv.classList.add('tracker')
  monsterDiv.setAttribute('id', `${apiMonsterInfo.index}-${i}`)
  
  monsterDiv.innerHTML = `<h2>${monster.name}-${i}</h2>
  <h3 class="tracker-health">Health: </h3>
  <button onclick="adjustHealth('${apiMonsterInfo.index + '-' + i}', 'minus')">-</button>
  <input id="${apiMonsterInfo.index}-${i}-hp" class="tracker-input" value="${apiMonsterInfo.hit_points}" min="0"/>
  <button onclick="adjustHealth('${apiMonsterInfo.index + '-' + i}', 'plus')">+</button>
  <p>Initiative:</p>
  <input id='${apiMonsterInfo.index}-${i}-initiative' class='tracker-initiative'/>
  <button onclick="removeMonster('${apiMonsterInfo.index}-${i}')">Remove</button>`

  encounterInitiative.addCharacter(`${apiMonsterInfo.index}-${i}`)

  return monsterDiv
}

const monsterTrackerCreator = (data) => {
  const monsterView = document.createElement('section')
  monsterView.setAttribute('id', 'monster-view')

  data.forEach(monster => {
    const encounterDiv = document.createElement('div')
    encounterDiv.classList.add('encountered-monster')

    axios.get(`https://www.dnd5eapi.co${monster.url}`)
    .then(res => {
      const {data: apiMonsterInfo} = res

      const monsterSpecs = document.createElement('div')
      monsterSpecs.classList.add('monster-specs')

      const monsterName = document.createElement('div')
      monsterName.classList.add('monster-name')
      
      monsterName.innerHTML = `<h2>${apiMonsterInfo.name}</h2>
      <p>${apiMonsterInfo.size} ${apiMonsterInfo.type}${apiMonsterInfo.subtype ? ` (${apiMonsterInfo.subtype})` : ''}, ${apiMonsterInfo.alignment}</p>
      `
      
      const monsterBaseInfo = document.createElement('div')
      monsterBaseInfo.classList.add('monster-base-info')

      monsterBaseInfo.innerHTML = `<p>AC: ${apiMonsterInfo.armor_class}</p>
        <p>Hit Points: ${apiMonsterInfo.hit_points} (Hit Die: ${apiMonsterInfo.hit_dice})</p>
      `

      const monsterSpeed = document.createElement('p')

      let speed = 'Speed: '

      let speedI = 0
      for(let key in apiMonsterInfo.speed){
        speed += `${key}: ${apiMonsterInfo.speed[key]}`
        
        if(speedI < Object.keys(apiMonsterInfo.speed).length - 1){
          speed += ', '
        }
        speedI++
      }

      monsterSpeed.innerHTML = speed

      monsterBaseInfo.appendChild(monsterSpeed)
      
      const monsterMainSkills = document.createElement('div')
      monsterMainSkills.classList.add('monster-main-skills')

      monsterMainSkills.innerHTML = `<p class="monster-main-skill-left">Str: ${apiMonsterInfo.strength} (${Math.floor((apiMonsterInfo.strength - 10) / 2)})</p>
        <p class="monster-main-skill-center">Dex: ${apiMonsterInfo.dexterity} (${Math.floor((apiMonsterInfo.dexterity - 10) / 2)})</p>
        <p class="monster-main-skill-right">Con: ${apiMonsterInfo.constitution} (${Math.floor((apiMonsterInfo.constitution - 10) / 2)})</p>
        <p class="monster-main-skill-left">Int: ${apiMonsterInfo.intelligence} (${Math.floor((apiMonsterInfo.intelligence - 10) / 2)})</p>
        <p class="monster-main-skill-center">Wis: ${apiMonsterInfo.wisdom} (${Math.floor((apiMonsterInfo.wisdom - 10) / 2)})</p>
        <p class="monster-main-skill-right">Cha: ${apiMonsterInfo.charisma} (${Math.floor((apiMonsterInfo.charisma - 10) / 2)})</p>
      `
      
      const monsterSubSkills = document.createElement('div')
      monsterSubSkills.classList.add('monster-sub-skills')

      let skillsString = 'Skills: '

      apiMonsterInfo.proficiencies.forEach((element, i) => {
        skillsString += `${element.proficiency.name.replace('Skill: ', '')}: ${element.value}`
        if(i < apiMonsterInfo.proficiencies.length - 1){
          skillsString += ', '
        }
      })

      monsterSubSkills.innerHTML += `<p>${skillsString}</p>
        <p>Language: ${apiMonsterInfo.languages}</p>
        <p>Challenge: ${apiMonsterInfo.challenge_rating} (${apiMonsterInfo.xp})</p>
      `
      
      const monsterSpecialAbilities = document.createElement('div')
      monsterSpecialAbilities.classList.add('monster-special-abilities')
      
      monsterSpecialAbilities.innerHTML = `<p>Special Abilities</p>`
      
      const monsterActions = document.createElement('div')
      monsterActions.classList.add('monster-actions')
      
      monsterActions.innerHTML = `<h3>Actions</h3>
        <div>
          Action and info
        </div>
      `
      
      const monsterLegendaryActions = document.createElement('div')
      monsterLegendaryActions.classList.add('monster-legendary-actions')

      monsterLegendaryActions.innerHTML = `<h3>Legendary Actions</h3>
        <div>
          Action and info
        </div>
      `
      
      monsterSpecs.appendChild(monsterName)
      monsterSpecs.appendChild(monsterBaseInfo)
      monsterSpecs.appendChild(monsterMainSkills)
      monsterSpecs.appendChild(monsterSubSkills)
      monsterSpecs.appendChild(monsterSpecialAbilities)
      monsterSpecs.appendChild(monsterActions)
      monsterSpecs.appendChild(monsterLegendaryActions)

      encounterDiv.appendChild(monsterSpecs)
  
      const trackerDisplay = document.createElement('div')
      trackerDisplay.classList.add('monster-tracker-display')
  
      for(let i = 1; i <= monster.amount; i++){
        let monsterDiv = createMonsterCards(monster, apiMonsterInfo, i)
  
        trackerDisplay.appendChild(monsterDiv)
      }

      let addMonsterBtn = document.createElement('button')
      addMonsterBtn.classList.add('add-more-monster')

      addMonsterBtn.textContent = '+'

      addMonsterBtn.onclick = () => {
        monster.amount++
        
        let addedMonster = createMonsterCards(monster, apiMonsterInfo, monster.amount)

        trackerDisplay.insertBefore(addedMonster, trackerDisplay.lastChild)
      }

      trackerDisplay.appendChild(addMonsterBtn)

      encounterDiv.appendChild(trackerDisplay)
    })
    
    monsterView.appendChild(encounterDiv)
  })
  
  return monsterView
}

const createPlayerCard = (player, i) => {
  const playerDiv = document.createElement('div')
  playerDiv.classList.add('tracker')
  playerDiv.setAttribute('id', `${player.name}-${i}`)
  
  playerDiv.innerHTML = `<h2>${player.name}</h2>
  <h3 class="tracker-health">Health: </h3>
  <button onclick="adjustHealth('${player.name + '-' + i}', 'minus')">-</button>
  <input id="${player.name}-${i}-hp" class="tracker-input" value="${player.hit_points}" min="0"/>
  <button onclick="adjustHealth('${player.name + '-' + i}', 'plus')">+</button>
  <p>Initiative:</p>
  <input id="${player.name}-${i}-initiative" class='tracker-initiative'/>`

  encounterInitiative.addCharacter(`${player.name}-${i}`)

  return playerDiv
}

const playerTrackerCreator = (players) => {
  const playerTracker = document.createElement('section')
  playerTracker.setAttribute('id', 'player-tracker')

  players.forEach((player, i) => {
    const playerDiv = createPlayerCard(player, i)

    playerTracker.appendChild(playerDiv)
  })

  return playerTracker
}

const deleteEncounter = (index) => {
  axios.delete(`/api/encounters?index=${index}`)
    .then(res => {
      alert(res.data)
      getEncounters()
    })
}

const viewEncounter = (encounter, index) => {
  encounterInitiative.resetCharacters()
  
  displayedEncounter.innerHTML = `
    <div id='viewed-encounter-name-stuff'>
      <h2 id="encounter-name">${encounter.name}</h2>
      <button onclick='encounterInitiative.orderTurns()'>Update Initiative</button>
      <button onclick='encounterInitiative.changeTurn()'>Next Turn</button>
      <button onclick='deleteEncounter(${index})'>Delete Encounter</button>
    </div>
  `

  const encounterView = document.createElement('section')
  encounterView.setAttribute('id', 'encounter-view')

  encounterView.appendChild(monsterTrackerCreator(encounter.monsters))
  encounterView.appendChild(playerTrackerCreator(encounter.players))

  displayedEncounter.appendChild(encounterView)
}

const allEncountersDisplay = document.getElementById('all-encounters')

const displayEncounters = (encounters) => {
  allEncountersDisplay.innerHTML = ''

  encounters.forEach((encounter, i) => {
    const encounterDiv = document.createElement('div')
    encounterDiv.classList.add('encounter')

    let monsterList = 'No monsters added'

    if(encounter.monsters[0]) {
      monsterList = encounter.monsters[0].name

      if(encounter.monsters[1]) {
        monsterList += `, ${encounter.monsters[1].name}`
      }
    }

    encounterDiv.innerHTML = `
      <h2>${encounter.name}</h2>
      <p>${monsterList}</p>
    `

    displayedEncounter.innerHTML = ''

    const viewButton = document.createElement('button')
    viewButton.textContent = 'View'
    viewButton.addEventListener('click', () => viewEncounter(encounter, i))

    encounterDiv.appendChild(viewButton)

    allEncountersDisplay.appendChild(encounterDiv)

    // if(i === 0){
    //   viewEncounter(encounter)
    // }
  });
}

const getEncounters = () => {
  axios.get('/api/encounters')
  .then(res => {
    displayEncounters(res.data)
  })
}

getEncounters()