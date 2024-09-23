/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type Repository,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  type FindOptionsWhere,
  type FindOptionsSelect,
  type FindOptionsSelectByString,
  type ObjectLiteral
} from 'typeorm'
import { NotFoundError } from '../helpers/exceptions-errors'
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class BaseAttributes {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}

export interface IService<T extends BaseAttributes> {
  create: (
    body: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>
  ) => Promise<ObjectLiteral[]>
  getAll: () => Promise<T[]>
  get: (
    id: string,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined
  ) => Promise<T>
  getOne: (
    where: FindOptionsWhere<T>,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined
  ) => Promise<T>
  update: (
    id: string,
    body: QueryDeepPartialEntity<T>,
    message: string
  ) => Promise<T>
  remove: (id: string, message: string) => Promise<void>
}

export default class Service<T extends BaseAttributes, R extends Repository<T>>
  implements IService<T>
{
  protected repository: R
  constructor(repository: R) {
    this.repository = repository
  }

  /*
   * -----------------------------------------------------------------------
   * Crea un nuevo registro de una entidad
   *
   * -----------------------------------------------------------------------
   */
  async create(
    body: QueryDeepPartialEntity<T> | Array<QueryDeepPartialEntity<T>>
  ): Promise<ObjectLiteral[]> {
    const data = await this.repository.insert(body)
    return data.generatedMaps
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un array de resultados con todos los registros del modelo
   *
   * -----------------------------------------------------------------------
   */
  async getAll(): Promise<T[]> {
    return await this.repository.find()
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene los resultados de un modelo específico según su UUID
   *
   * -----------------------------------------------------------------------
   */
  async get(
    id: string,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined = undefined
  ): Promise<T> {
    const data = await this.repository.findOne({
      where: { id: id as any },
      select: selectOptions
    })

    // Valida si la data existe
    if (data === null) {
      throw new NotFoundError(message)
    }
    return data
  }

  async getOne(
    where: FindOptionsWhere<T>,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined = undefined
  ): Promise<T> {
    const data = await this.repository.findOne({ where, select: selectOptions })

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
  async update(
    id: string,
    body: QueryDeepPartialEntity<T>,
    message: string
  ): Promise<T> {
    // Find the data
    const entity = await this.get(id, message)

    // Update data
    const data = await this.repository.save({ ...entity, ...body })
    return data
  }

  /*
   * -----------------------------------------------------------------------
   * Elimina un modelo por su id
   *
   * -----------------------------------------------------------------------
   */
  async remove(id: string, message: string): Promise<void> {
    // Find the data
    await this.get(id, message, ['id'])

    // Remove data
    await this.repository.delete(id)
  }
}
