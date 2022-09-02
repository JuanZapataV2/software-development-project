import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Permission from './Permission';

export default class Role extends BaseModel {
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

  @manyToMany(()=> Permission,{
    pivotTable: 'permissions_roles',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'permission_id',
  })
  public permissions: ManyToMany<typeof Permission>

}
