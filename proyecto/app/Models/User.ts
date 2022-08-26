import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile';
import Rol from './Role';

export default class Usuario extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string;

  @column()
  public role_id:number;

  @column()
  public email:string;

  @column()
  public password:string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Profile,{
    foreignKey: 'user_id'
  })
  public profile: HasOne<typeof Profile>

  @belongsTo(()=> Rol,{
    foreignKey:'role_id',
  })
  public rol: BelongsTo<typeof Rol>


  
}
