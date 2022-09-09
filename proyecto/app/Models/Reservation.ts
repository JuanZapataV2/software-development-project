import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Driver from './Driver';
import ParkingSpot from './ParkingSpot';
import Vehicle from './Vehicle';

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public state:number;

  @column()
  public start_date:DateTime;

  @column()
  public end_date:DateTime;

  @column()
  public driver_id:number;

  @belongsTo(()=> Driver,{
    foreignKey:'driver_id',
  })
  public driver: BelongsTo<typeof Driver>

  @column()
  public parking_spot_id:number;

  @belongsTo(()=> ParkingSpot,{
    foreignKey:'parking_spot_id',
  })
  public parking_spot: BelongsTo<typeof ParkingSpot>

  @column()
  public vehicle_id:number;

  @hasOne(() => Vehicle,{
    foreignKey: 'vehicle_id'
  })
  public vehicle: HasOne<typeof Vehicle>


  @column()
  public observations:string;

  @column()
  public price:number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

 
  
}
