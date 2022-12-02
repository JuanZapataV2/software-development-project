import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Parking from './Parking';

export default class ParkingSpot extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public occupied:number;

  @column()
  public code:string;

  @column()
  public location:string;

  @column()
  public observations:string;

  @column()
  public parking_id:number;

  @belongsTo(()=> Parking,{
    foreignKey:'parking_id',
  })
  public parking: BelongsTo<typeof Parking>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  
}
