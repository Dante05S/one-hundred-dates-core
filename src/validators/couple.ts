import Joi from 'joi'

export const validateConnectSchema = (): Joi.ObjectSchema => {
  return Joi.object({
    coupleCode: Joi.string().required()
  })
}
