import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Parking from './Parking';
import User from './User';

export default class ParkingRating extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rating: number

  @column()
  public comment: string

  @column()
  parking_id: number

  @column()
  user_id: number

  @belongsTo(()=> Parking,{
    foreignKey:'parking_id',
  })
  public parking: BelongsTo<typeof Parking>

  @belongsTo(()=> User,{
    foreignKey:'user_id',
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
