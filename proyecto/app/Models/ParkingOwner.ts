import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Parking from './Parking';

export default class ParkingOwner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public owner_id:number;

  @column()
  public user_id:number;

  //Revisar herencias
  @belongsTo(()=>User,{
    foreignKey:'user_id'
  })
  public user: BelongsTo<typeof User>

  @hasMany(()=>Parking,{
    foreignKey:'owner_id'
  })
  public parkings: HasMany<typeof Parking>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
