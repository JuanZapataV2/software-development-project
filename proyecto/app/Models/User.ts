import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile';
import Role from './Role';
import Driver from './Driver';
import ParkingOwner from './ParkingOwner';
import ParkingRating from './ParkingRating';
import Reservation from './Reservation';
import ApiToken from './ApiToken';
import Hash from '@ioc:Adonis/Core/Hash';

export default class User extends BaseModel {
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

  @belongsTo(()=> Role,{
    foreignKey:'role_id',
  })
  public role: BelongsTo<typeof Role>

  @hasMany(()=> Driver,{
    foreignKey:'user_id',
  })
  public drivers: HasMany<typeof Driver> //Not sure about this, please review it

  @hasMany(() => ParkingRating,{
    foreignKey:'parking_id' //Nombre clave propagada de la entidad
  })
  public user_ratings: HasMany<typeof ParkingRating>

  @hasMany(() => Reservation,{
    foreignKey:'driver_id' //Nombre clave propagada de la entidad
  })
  public user_reservations: HasMany<typeof Reservation>

  @hasMany(()=> ParkingOwner,{
    foreignKey:'user_id',
  })
  public parking_owners: HasMany<typeof ParkingOwner>

  @hasMany(() => ApiToken,{
    foreignKey: 'user_id',
    })
    public usuarios: HasMany<typeof ApiToken>

  @beforeSave()
    public static async hashPassword (el_usuario: User) {
      if (el_usuario.$dirty.password) {
        el_usuario.password = await Hash.make(el_usuario.password)
      }
    }
  
}
