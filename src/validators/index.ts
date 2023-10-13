import Joi from 'joi'

export const validateId = (name: string): Joi.ObjectSchema => {
  return Joi.object({
    [name]: Joi.string()
      .guid({ version: ['uuidv4'] })
      .required()
      .messages({
        'string.base': `El parametro ${name} debe ser un texto`,
        'string.guid': `El parametro ${name} debe ser un uuid válido`,
        'any.required': `El parametro ${name} es requerido`
      })
  })
}

export const validateString = (name: string): Joi.ObjectSchema => {
  return Joi.object({
    [name]: Joi.string()
      .required()
      .messages({
        'string.base': `El parametro ${name} debe ser un texto`,
        'any.required': `El parametro ${name} es requerido`
      })
  })
}
