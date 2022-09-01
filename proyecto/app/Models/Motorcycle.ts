import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Vehicle from './Vehicle';

export default class Motorcycle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public helmet:string;

  @hasMany(()=>Vehicle,{
    foreignKey:'vehicle_id'
  })
  
  public vehicles: HasMany<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
