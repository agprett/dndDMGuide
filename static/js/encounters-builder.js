const getMonsters = () => {
  axios.get('/api/monsters')
    .then(res => {
      displayMonsters(res.data)
    })
}

const getPlayers = () => {
  axios.get('/api/players')
    .then(res => {
      displayPlayers(res.data)
    })
}

const encounterMonsterDisplay = document.getElementById('added-display-monsters')
const encounterPlayerDisplay = document.getElementById('added-display-players')

const selectionDisplayBtns = document.querySelectorAll('.selection-buttons')

const monstersSelection = document.getElementById('monsters-selection')
const playerSelection = document.getElementById('player-selection')

const selectDisplay = (event) => {
  if(event.target.textContent === 'Monsters') {
    playerSelection.classList.remove('displayed')
    monstersSelection.classList.add('displayed')
  } else if(event.target.textContent === 'Players') {
    monstersSelection.classList.remove('displayed')
    playerSelection.classList.add('displayed')
  }

  selectionDisplayBtns.forEach(button => {
    button.classList.toggle('selected-display-button')
  })
}

selectionDisplayBtns.forEach(button => {
  button.addEventListener('click', selectDisplay)
})

const removeFromEncounter = (index, type) => {
  if(type === 'monster'){
    encounterMonsterDisplay.removeChild(document.getElementById(`${index}-added`))
  } else if(type === 'player'){
    encounterPlayerDisplay.removeChild(document.getElementById(`${index}-added`))
  }
}

const addToEncounter = (character, type) => {
  const addedCharacter = document.createElement('div')
  addedCharacter.classList.add('added')
  if(type === 'monster'){
    addedCharacter.setAttribute('id', `${character.index}-added`)
    addedCharacter.setAttribute('data', `${character.url}`)
    
    addedCharacter.innerHTML = `<p class='added-monster-name'>${character.name}</p>
      <input class="added-monster-amount" value="1" type="number" min="1"/>
    `
  } else if(type === 'player'){
    addedCharacter.setAttribute('id', `${character.name}-added`)
    addedCharacter.setAttribute('data', `${character.hit_points}`)

    addedCharacter.innerHTML = `<p class='added-monster-name'>${character.name}</p>`
  }

  const removeBtn = document.createElement('button')
  removeBtn.textContent = 'X'
  removeBtn.classList.add('remove-character')
  removeBtn.addEventListener('click', () => {
    if(type === 'monster'){
      removeFromEncounter(character.index, type)
    } else if (type === 'player') {
      removeFromEncounter(character.name, type)
    }
  })

  addedCharacter.appendChild(removeBtn)

  if(type === 'monster'){
    encounterMonsterDisplay.appendChild(addedCharacter)
  } else if(type === 'player'){
    encounterPlayerDisplay.appendChild(addedCharacter)
  }
}

const createEncounter = () => {
  let monsters = []
  let players = []

  encounterMonsterDisplay.childNodes.forEach(monster => {
    const obj = {
      name: monster.childNodes[0].textContent,
      url: monster.getAttribute('data'),
      amount: +monster.childNodes[2].value
    }

    monsters.push(obj)
  })

  encounterPlayerDisplay.childNodes.forEach(player => {
    const obj = {
      name: player.childNodes[0].textContent,
      hit_points: +player.getAttribute('data')
    }

    players.push(obj)
  })

  axios.post('/api/encounters', {monsters, players})
    .then(res => {
      alert(res.data)
      window.location.href = "/encounters"
    })
}

const createEncounterBtn = document.getElementById('create-encounter-btn')

createEncounterBtn.addEventListener('click', createEncounter)

const searchForm = document.getElementById('search-monsters')

const displayMonsters = (monsters) => {
  const display = document.getElementById('displayed-monsters')
  const filterInput = document.getElementById('search-monsters-input')

  display.innerHTML = ''

  monsters.filter(monster => {
    if(filterInput.value){
      return monster.name.toLowerCase().includes(filterInput.value.toLowerCase())
    } else {
      return true
    }
  }).forEach(monster => {
    let monsterDiv = document.createElement('div')
    monsterDiv.classList.add('monster')
    monsterDiv.setAttribute('id', `${monster.index}`)

    monsterDiv.innerHTML = `
    <p>${monster.name}</p>
    <button
      class="add-monster"
    >Add</button>
    `

    display.appendChild(monsterDiv)

    const addBtns = document.querySelectorAll('.add-monster')
    const addBtn = addBtns[addBtns.length - 1]

    addBtn.addEventListener('click', () => {
      const addedCheck = document.getElementById(monster.index + '-added')
      if(addedCheck){
        addedCheck.childNodes[2].value = +addedCheck.childNodes[2].value + 1
      } else {
        addToEncounter(monster, 'monster')
      }
    })
  });
}

const createNewPlayer = () => {
  let newPlayerName = document.getElementById('new-player-name').value
  let newPlayerHp = document.getElementById('new-player-hp').value

  let body = {
    name: newPlayerName,
    hit_points: +newPlayerHp
  }

  axios.post('/api/players', body)
    .then(res => {
      alert(res.data)
      getPlayers()
    })
}

const displayPlayers = (players) => {
  const display = document.getElementById('displayed-players')

  display.innerHTML = ``

  players.forEach(player => {
    const playerDiv = document.createElement('div')
    playerDiv.classList.add('player')
    playerDiv.setAttribute('id', player.name.toLowerCase())

    playerDiv.innerHTML = `<p>${player.name}</p>
    <button
      class='add-player'
    >Add</button>`

    display.appendChild(playerDiv)

    const addBtns = document.querySelectorAll('.add-player')
    const addBtn = addBtns[addBtns.length - 1]

    addBtn.addEventListener('click', () => {
      const addedCheck = document.getElementById(player.name + '-added')
      if(addedCheck){
        alert('Already added to encounter')
      } else {
        addToEncounter(player, 'player')
      }
    })
  })

  const newPlayerDiv = document.createElement('div')
  newPlayerDiv.classList.add('player')

  newPlayerDiv.innerHTML = `<input id='new-player-name' placeholder='Name'/>
  <input id='new-player-hp' placeholder='Hit Points' type="number" min="1"/>`

  const createPlayerBtn = document.createElement('button')
  
  createPlayerBtn.innerHTML = 'Create'

  createPlayerBtn.addEventListener('click', createNewPlayer)

  newPlayerDiv.appendChild(createPlayerBtn)

  display.appendChild(newPlayerDiv)
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  getMonsters()
})

getMonsters()
getPlayers()