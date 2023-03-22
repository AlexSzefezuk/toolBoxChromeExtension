const generatePassBtn = document.querySelector('[data-js="generatePassBtn"]')
const copyPassBtn = document.querySelector('[data-js="copyPassBtn"]')
const rangeInput = document.querySelector('[name="charNumber"]')

const imgInput = document.querySelector('[data-js="imgInput"]')
const imageReaderLoading = document.querySelector(
  '[data-js="imageReaderLoading"]'
)

const codeValidatorForm = document.querySelector(
  '[data-js="codeValidatorForm"]'
)
const codeValidatorLabel = document.querySelector('[name="codeLabel"]')
const passGeneratorForm = document.querySelector(
  '[data-js="passGeneratorForm"]'
)

const showElement = element => {
  element.classList.remove('d-none')
}

const generatePassword = passwordLength => {
  passwordLength = passwordLength === 0 ? 100 : passwordLength

  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@#$%^&*()+?><:{}[]'
  let password = ''

  for (var i = 0; i < passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length)
    password += chars.substring(randomNumber, randomNumber + 1)
  }
  return password
}

passGeneratorForm.addEventListener('submit', event => {
  event.preventDefault()
})

rangeInput.addEventListener('input', event => {
  document.querySelector(
    '[data-js="charNumberLabel"]'
  ).textContent = `Número de caracteres: ${event.target.value}`
})

generatePassBtn.addEventListener('click', () => {
  const passwordLength = Number(
    document.querySelector('[name="charNumber"]').value
  )
  const password = generatePassword(passwordLength)

  const passInput = document.querySelector('[name="password"]')
  passInput.value = password

  showElement(passInput)
})

copyPassBtn.addEventListener('click', () => {
  const passInput = document.querySelector('[name="password"]')
  passInput.select()
  navigator.clipboard.writeText(passInput.value)
})

codeValidatorForm.addEventListener('input', () => {
  codeValidatorLabel.classList.remove('text-success')
  codeValidatorLabel.classList.remove('text-danger')

  codeValidatorLabel.textContent = 'CPF / CNPJ'
})

codeValidatorForm.addEventListener('submit', event => {
  event.preventDefault()
  const personCodeValidator = code => {
    code = code.replace(/[^\d]/g, '')

    while (code.length < 11) code = `0${code}`

    let Soma
    let Resto
    Soma = 0

    if (code.length > 11) return false
    if (/0{11}/.test(code)) return false

    for (let i = 1; i <= 9; i++)
      Soma = Soma + parseInt(code.substring(i - 1, i)) * (11 - i)
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(code.substring(9, 10))) return false

    Soma = 0
    for (let i = 1; i <= 10; i++)
      Soma = Soma + parseInt(code.substring(i - 1, i)) * (12 - i)
    Resto = (Soma * 10) % 11

    if (Resto == 10 || Resto == 11) Resto = 0
    if (Resto != parseInt(code.substring(10, 11))) return false
    return true
  }

  const bussinessCodeValidator = code => {
    const numbers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    code = code.replace(/[^\d]/g, '')
    while (code.length < 14) code = `0${code}`

    if (code.length !== 14) return false
    if (/0{14}/.test(code)) return false

    for (var i = 0, n = 0; i <= 12; n += code[i] * numbers[i++]);
    if (code[13] != ((n %= 11) < 2 ? 0 : 11 - n)) return false

    for (var i = 0, n = 0; i <= 12; n += code[i] * numbers[i++]);
    if (code[13] != ((n %= 11) < 2 ? 0 : 11 - n)) return false

    return true
  }

  const code = event.target.code.value

  let codeIsValid = null

  if (code.length === 11) {
    codeIsValid = personCodeValidator(code)
  }

  if (code.length === 14) {
    codeIsValid = bussinessCodeValidator(code)
  }

  if (codeIsValid) {
    codeValidatorLabel.classList.add('text-success')
    codeValidatorLabel.textContent = 'Valido'
  }

  if (!codeIsValid) {
    codeValidatorLabel.classList.add('text-danger')
    codeValidatorLabel.textContent = 'Inválido'
  }
})

imgInput.addEventListener('input', async event => {
  const inputDiv = event.target
  const inputIsImg = inputDiv.childNodes[0].tagName === 'IMG'
  if (inputIsImg) {
    const imgSrc = inputDiv.childNodes[0].src
    const imgOutput = document.querySelector('[data-js="imgOutput"]')

    imgInput.classList.add('d-none')

    imageReaderLoading.classList.remove('d-none')
    const {
      data: { text }
    } = await Tesseract.recognize(imgSrc, 'por')
    
    imgOutput.value = text
    imgOutput.select()
    navigator.clipboard.writeText(imgOutput.value)
    imgOutput.classList.remove('d-none')

    imageReaderLoading.classList.add('d-none')

    inputDiv.childNodes[0].remove()
  }
})
