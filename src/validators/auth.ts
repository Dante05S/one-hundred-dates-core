import Joi from 'joi'
import { regexDigit, regexLetter, regexLower, regexUpper } from '../utils/regex'

export const validateRegisterSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .message('password must have at least 8 characters')
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
    codeToken: Joi.string()
      .regex(/^\d+$/)
      .message('codeToken just must have numbers (0-9)')
      .max(4)
      .required(),
    email: Joi.string().email().required()
  })
}

export const validateRequestCodeSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}
