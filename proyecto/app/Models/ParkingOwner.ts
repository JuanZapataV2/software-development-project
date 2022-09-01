import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Parking from './Parking';

export default class ParkingOwner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public owner_id:number;

  //Revisar herencias
  @hasMany(()=>User,{
    foreignKey:'user_id'
  })
  public users: HasMany<typeof User>

  @hasMany(()=>Parking,{
    foreignKey:'owner_id'
  })
  public parkings: HasMany<typeof Parking>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
