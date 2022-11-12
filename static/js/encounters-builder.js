const encounterDisplay = document.getElementById('added-display')

const removeFromEncounter = (index) => {
  encounterDisplay.removeChild(document.getElementById(`${index}-added`))
}

const addToEncounter = (monster) => {
  const addedMonster = document.createElement('div')
  addedMonster.classList.add('added-monster')
  addedMonster.setAttribute('id', `${monster.index}-added`)
  addedMonster.setAttribute('data', `${monster.url}`)

  addedMonster.innerHTML = `<p class='added-monster-name'>${monster.name}</p>
    <input class="added-monster-amount" value="1" type="number" min="1"/>
  `

  const removeBtn = document.createElement('button')
  removeBtn.textContent = 'X'
  removeBtn.classList.add('remove-monster')
  removeBtn.addEventListener('click', () => removeFromEncounter(monster.index))

  addedMonster.appendChild(removeBtn)

  encounterDisplay.appendChild(addedMonster)
}

const createEncounter = () => {
  let monsters = []
  encounterDisplay.childNodes.forEach(monster => {
    const obj = {
      name: monster.childNodes[0].textContent,
      url: monster.getAttribute('data'),
      amount: +monster.childNodes[2].value
    }

    monsters.push(obj)
  })

  axios.post('/api/encounters', {monsters})
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
        addToEncounter(monster)
      }
    })
  });
}

const getMonsters = () => {
  axios.get('/api/monsters')
  .then(res => {
    displayMonsters(res.data)
  })
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  getMonsters()
})

getMonsters()