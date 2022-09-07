import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, manyToMany, ManyToMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Driver from './Driver';
import Car from './Car';
import Motorcycle from './Motorcycle';

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public license_plate:string;

  @hasMany(()=> Car,{
    foreignKey:'vehicle_id',
  })
  public cars: HasMany<typeof Car>

  @hasMany(()=> Motorcycle,{
    foreignKey:'vehicle_id',
  })
  public motorcycles: HasMany<typeof Motorcycle>

  @manyToMany(() => Driver, {
    pivotTable: 'driver_vehicles', //Nombre tabla pivote
    pivotForeignKey:'vehicle_id',
    pivotRelatedForeignKey:'driver_id',
  })

  public drivers: ManyToMany<typeof Driver>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //@column()
  //public user:User;

  
}
