import Joi from 'joi'

export const validateCoupleCreateSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    couple_code: Joi.string().required()
  })
}
