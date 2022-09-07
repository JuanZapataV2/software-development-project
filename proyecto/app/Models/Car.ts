import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle';

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type:number;

  @column()
  public vehicle_id:number;

  @belongsTo(()=>Vehicle,{
    foreignKey:'vehicle_id'
  })
  
  public vehicle: BelongsTo<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
