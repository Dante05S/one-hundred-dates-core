import Joi from 'joi'

const regexDigit = /[0-9]/
const regexLetter = /^(?=.*[A-Za-z])/
const regexLower = /^(?=.*?[a-z])/
const regexUpper = /^(?=.*?[A-Z])/

export const validateRegisterSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(regexDigit)
      .message('password must have at least one number (0-9)')
      .regex(regexLetter)
      .message('password must have at least one character (a-z)')
      .regex(regexLower)
      .message('password must have at least lowercase character')
      .regex(regexUpper)
      .message('password must have at least uppercase character')
      .required()
  })
}

export const validateLoginSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    code_token: Joi.string()
      .regex(/^\d+$/)
      .message('code_token just must have numbers (0-9)')
      .max(4)
      .required(),
    email: Joi.string().email().required()
  })
}

export const validateRequestCodeSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}

export const validateResendCodeSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    email: Joi.string().email().required()
  })
}
