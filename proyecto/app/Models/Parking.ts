import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, column, belongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import ParkingOwner from './ParkingOwner';
import ParkingSpot from './ParkingSpot';
import ParkingRating from './ParkingRating';

export default class Parking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public address:string;

  @column()
  public number_spaces:number;

  @column()
  public name:string;

  @column()
  public telephone:string;

  @column()
  public open_hours:JSON;

  @column()
  public owner_id:number;

  @belongsTo(()=> ParkingOwner,{
    foreignKey:'owner_id',
  })
  public parking_owner: BelongsTo<typeof ParkingOwner>

  @hasMany(()=>ParkingSpot,{
    foreignKey:'parking_id'
  })
  public parking_spots: HasMany<typeof ParkingSpot>

  @hasMany(()=>ParkingRating,{
    foreignKey:'parking_id'
  })
  public ratings: HasMany<typeof ParkingRating>
}
