import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, HasMany, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
export default class DriverVehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehicle_id: number


  @column()
  public driver_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
