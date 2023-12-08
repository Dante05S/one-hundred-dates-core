import crypto from 'crypto'

const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length

  let resultado = ''
  const bytes = crypto.randomBytes(length)

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % charactersLength
    resultado += characters.charAt(index)
  }

  return resultado
}

export default generateRandomString
