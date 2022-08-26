import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //@column()
  //public user:User;
 
  @column()
  public state:number;

  @column()
  public start_date:DateTime;

  @column()
  public end_date:DateTime;

  @column()
  public proce:number;

  @column()
  public observation:String;
}
