import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, HasMany, hasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Vehicle from './Vehicle';

export default class Motorcycle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public helmet:string;

  @column()
  public vehicle_id:number;

  @belongsTo(()=>Vehicle,{
    foreignKey:'vehicle_id'
  })
  
  public vehicle: BelongsTo<typeof Vehicle>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
