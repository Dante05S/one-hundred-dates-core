import Repository from '.'
import Couple from '../database/models/couple'

export default class CoupleRepository extends Repository<Couple> {
  constructor() {
    super(Couple)
  }
}
