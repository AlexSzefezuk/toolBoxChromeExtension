const generatePassBtn = document.querySelector('[data-js="generatePassBtn"]')
const copyPassBtn = document.querySelector('[data-js="copyPassBtn"]')
const rangeInput = document.querySelector('[name="charNumber"]')

const personCodeValidatorForm = document.querySelector(
  '[data-js="personCodeValidatorForm"]'
)
const personCodeValidatorLabel = document.querySelector(
  '[name="personCodeLabel"]'
)
const passGeneratorForm = document.querySelector(
  '[data-js="passGeneratorForm"]'
)

const copyPass = () => {
  const copyText = document.querySelector('[name="password"]')
  copyText.select()
  navigator.clipboard.writeText(copyText.value)
}

const getPassword = () => {
  let passwordLength = Number(
    document.querySelector('[name="charNumber"]').value
  )
  passwordLength = passwordLength === 0 ? 100 : passwordLength

  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@#$%^&*()+?><:{}[]'
  let password = ''

  for (var i = 0; i < passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length)
    password += chars.substring(randomNumber, randomNumber + 1)
  }
  document.querySelector('[name="password"]').value = password
}

passGeneratorForm.addEventListener('submit', event => {
  event.preventDefault()
})

generatePassBtn.addEventListener('click', () => {
  getPassword()
})

rangeInput.addEventListener('input', event => {
  document.querySelector(
    '[data-js="charNumberLabel"]'
  ).textContent = `Número de caracteres: ${event.target.value}`
})

copyPassBtn.addEventListener('click', () => {
  copyPass()
})

personCodeValidatorForm.addEventListener('submit', event => {
  const personCodeValidator = personCode => {
    personCode = personCode.replace(/[^\d]/g, '')

    while (personCode.length < 11) personCode = `0${personCode}`

    let Soma
    let Resto
    Soma = 0

    if (personCode.length > 11) return false
    if (/0{11}/.test(personCode)) return false

    for (let i = 1; i <= 9; i++)
      Soma = Soma + parseInt(personCode.substring(i - 1, i)) * (11 - i)
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(personCode.substring(9, 10))) return false

    Soma = 0
    for (let i = 1; i <= 10; i++)
      Soma = Soma + parseInt(personCode.substring(i - 1, i)) * (12 - i)
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(personCode.substring(10, 11))) return false
    return true
  }

  event.preventDefault()

  const personCode = event.target.personCode.value

  const personCodeIsValid = personCodeValidator(personCode)

  if (personCodeIsValid) {
    personCodeValidatorLabel.textContent = 'CPF Valido'
  }

  if (!personCodeIsValid) {
    personCodeValidatorLabel.textContent = 'CPF inválido'
  }
})

const imgInput = document.querySelector('[data-js="imgInput"]')
imgInput.addEventListener('input', event => {
  const inputDiv = event.target
  const imgSrc = inputDiv.childNodes[0].src

  if (imgSrc) {
    Tesseract.recognize(imgSrc, 'por', {}).then(({ data: { text } }) => {
      console.log('rodou')
      const canvas = document.querySelector('[data-js="canvas"]')
      canvas.textContent = text
      navigator.clipboard.writeText(text)
    })
  }
})
