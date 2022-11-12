const mainSection = document.getElementById('main')

const addText = () => {
  let text = document.createElement('p')

  text.setAttribute('id', 'added-text')

  text.textContent = 'I don\'t know what to write'

  mainSection.appendChild(text)
}

document.getElementById('random-button').addEventListener('click', addText)