import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, column, belongsTo } from '@ioc:Adonis/Lucid/Orm';
import User from './User'

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public user_id: number

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public token: string

  @column.dateTime()
  public expires_at: DateTime

  @belongsTo(() => User ,{
  localKey: 'user_id',
  })

public rol: BelongsTo <typeof User>;

}



