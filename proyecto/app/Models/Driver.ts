import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle';
import User from './User';

export default class Driver extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id:number;

  @hasMany(()=>User,{
    foreignKey:'user_id'
  })
  public users: HasMany<typeof User>

  
  @manyToMany(() => Vehicle, {
    pivotTable: 'driver_vehicles', //Nombre tabla pivote
    pivotForeignKey:'driver_id',
    pivotRelatedForeignKey:'vehicle_id',
  })

  public vehicles: ManyToMany<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
