import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role';

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url:string;

  @column()
  public method:string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Role, {
    pivotTable: 'permissions_roles', //Nombre tabla pivote
    pivotForeignKey:'permission_id',
    pivotRelatedForeignKey:'role_id',
  })
  public roles: ManyToMany<typeof Role>
}
