import type Repository from '../repositories'
import {
  type Attributes,
  type WhereAttributeHash,
  type Model,
  type CreationAttributes
} from 'sequelize'
import { NotFoundError } from '../helpers/exceptions_errors'
import { type MakeNullishOptional } from 'sequelize/types/utils'
import { type ValuesUpdate } from '../types/values_update'

interface IService<T extends Model> {
  create: (body: MakeNullishOptional<T['_creationAttributes']>) => Promise<T>
  getAll: () => Promise<T[]>
  get: (id: string, message: string) => Promise<T>
  getOne: (
    whereQuery: WhereAttributeHash<Attributes<T>>,
    message: string
  ) => Promise<T>
  update: (id: string, body: ValuesUpdate<T>, message: string) => Promise<T>
  remove: (id: string, message: string) => Promise<void>
}

export default class Service<T extends Model, R extends Repository<T>>
  implements IService<T>
{
  protected repository: R
  constructor(repository: R) {
    this.repository = repository
  }

  /*
   * -----------------------------------------------------------------------
   * Crea un nuevo registro de un modelo
   *
   * -----------------------------------------------------------------------
   */
  async create(body: CreationAttributes<T>): Promise<T> {
    const data = await this.repository.create(body)
    return data
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un array de resultados con todos los registros del modelo
   *
   * -----------------------------------------------------------------------
   */
  async getAll(): Promise<T[]> {
    return await this.repository.getAll()
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene los resultados de un modelo específico según su UUID
   *
   * -----------------------------------------------------------------------
   */
  async get(id: string, message: string): Promise<T> {
    const data = await this.repository.getById(id)

    // Valida si la data existe
    if (data === null) {
      throw new NotFoundError(message)
    }
    return data
  }

  async getOne(
    whereQuery: WhereAttributeHash<Attributes<T>>,
    message: string
  ): Promise<T> {
    const data = await this.repository.getOne({
      where: whereQuery
    })

    // Valida si la data existe
    if (data === null) {
      throw new NotFoundError(message)
    }
    return data
  }

  /*
   * -----------------------------------------------------------------------
   * Actualiza un registro de un modelo
   *
   * -----------------------------------------------------------------------
   */
  async update(id: string, body: ValuesUpdate<T>, message: string): Promise<T> {
    // Find the data
    await this.get(id, message)

    // Update data
    const data = await this.repository.update(
      id as unknown as WhereAttributeHash<Attributes<T>['id']>,
      body
    )
    return data[1][0]
  }

  /*
   * -----------------------------------------------------------------------
   * Elimina un modelo por su id
   *
   * -----------------------------------------------------------------------
   */
  async remove(id: string, message: string): Promise<void> {
    // Find the data
    await this.get(id, message)

    // Remove data
    await this.repository.remove(
      id as unknown as WhereAttributeHash<Attributes<T>['id']>
    )
  }
}
