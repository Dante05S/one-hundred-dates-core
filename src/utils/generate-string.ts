import crypto from 'crypto'

export const generateRandomString = (length: number): string => {
  const caracteres =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let resultado = ''
  const bytes = crypto.randomBytes(length)

  for (let i = 0; i < length; i++) {
    resultado += caracteres[bytes[i] % caracteres.length]
  }
  return resultado
}
