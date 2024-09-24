import { AppDataSource } from '../database/data-source'
import { Couple } from '../database/entity/Couple'

export const CoupleRepository = AppDataSource.getRepository(Couple).extend({})
