import {
  type ModelStatic,
  type Model,
  type Optional,
  type Attributes,
  type WhereAttributeHash
} from 'sequelize'
import { type Options } from '../types/options'
import { type QueryCount } from '../types/query_count'
import { type MakeNullishOptional } from 'sequelize/types/utils'
import { type ValuesUpdate } from '../types/values_update'
import { type QueryUpdate } from '../types/query_update'
import { type BaseModelAttributes } from '../interfaces/base_model_attributes'
import { type BaseModelCreation } from '../types/base_model_creation'

interface IRepository<
  TAttributes extends BaseModelAttributes,
  TCreation extends Optional<TAttributes, BaseModelCreation>,
  T extends Model<TAttributes, TCreation>
> {
  getAll: () => Promise<T[]>
  get: (options?: Options<T>) => Promise<T[]>
  getOne: (options?: Options<T>) => Promise<T | null>
  getAndCount: (options: Options<T>) => Promise<QueryCount<T>>
  count: (options: Options<T>) => Promise<number>
  getById: (id: string, options?: Options<T>) => Promise<T | null>
  create: (body: MakeNullishOptional<T['_creationAttributes']>) => Promise<T>
  update: (
    id: WhereAttributeHash<Attributes<T>['id']>,
    body: ValuesUpdate<T>
  ) => Promise<QueryUpdate<T>>
  remove: (id: WhereAttributeHash<Attributes<T>['id']>) => Promise<number>
}

export default class Repository<
  TAttributes extends BaseModelAttributes,
  TCreation extends Optional<TAttributes, BaseModelCreation>,
  T extends Model<TAttributes, TCreation>
> implements IRepository<TAttributes, TCreation, T>
{
  private readonly model: ModelStatic<T>

  constructor(model: ModelStatic<T>) {
    this.model = model
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un array de todos los valores de un modelo
   *
   * -----------------------------------------------------------------------
   */
  async getAll(): Promise<T[]> {
    return await this.model.findAll()
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un array de todos los valores de un modelo por condicional
   *
   * -----------------------------------------------------------------------
   */
  async get(options?: Options<T>): Promise<T[]> {
    return await this.model.findAll(options)
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un objeto del valor de un modelo por condicional
   *
   * -----------------------------------------------------------------------
   */

  async getOne(options?: Options<T>): Promise<T | null> {
    return await this.model.findOne(options)
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un array de todos los valores de un modelo por condicional
   * y devuelve filas y cantidad de registros encontrados
   *
   * -----------------------------------------------------------------------
   */
  async getAndCount(options: Options<T>): Promise<QueryCount<T>> {
    return await this.model.findAndCountAll(options)
  }

  async count(options: Options<T>): Promise<number> {
    return await this.model.count(options)
  }

  /*
   * -----------------------------------------------------------------------
   * Obtiene un objeto de un modelo según su UUID
   *
   * -----------------------------------------------------------------------
   */
  async getById(id: string, options?: Options<T>): Promise<T | null> {
    return await this.model.findByPk(id, options)
  }

  /*
   * -----------------------------------------------------------------------
   * Crea un nuevo registro en la base de datos
   *
   * -----------------------------------------------------------------------
   */
  async create(
    body: MakeNullishOptional<T['_creationAttributes']>
  ): Promise<T> {
    return await this.model.create(body)
  }

  /*
   * -----------------------------------------------------------------------
   * Actualiza un registro de la base de datos según su UUID
   *
   * -----------------------------------------------------------------------
   */
  async update(
    id: WhereAttributeHash<Attributes<T>['id']>,
    body: ValuesUpdate<T>
  ): Promise<QueryUpdate<T>> {
    return await this.model.update(body, {
      where: { id },
      returning: true
    })
  }

  /*
   * -----------------------------------------------------------------------
   * Elimina un registro de la base de datos según su UUID
   *
   * -----------------------------------------------------------------------
   */
  async remove(id: WhereAttributeHash<Attributes<T>['id']>): Promise<number> {
    return await this.model.destroy({ where: { id } })
  }
}
