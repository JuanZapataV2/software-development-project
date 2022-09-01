import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DriverVehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehicle_id: number


  @column()
  public driver_id: number

  @column()
  public use_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
