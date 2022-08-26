import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User';
import Permit from './Permit';

export default class Rol extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name:string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=>User,{
    foreignKey:'role_id'
  })
  public users: HasMany<typeof User>

  @manyToMany(()=> Permit,{
    pivotTable: 'permissions_roles',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'permission_id',
  })
  public permissions: ManyToMany<typeof Permit>

}
