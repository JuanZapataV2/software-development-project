import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PermissionsRole extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public role_id: number

  @column()
  public permission_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  
}
