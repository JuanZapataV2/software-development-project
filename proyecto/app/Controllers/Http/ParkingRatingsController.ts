import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ParkingRating from "App/Models/ParkingRating";


export default class ParkingRatingsController {

  public async index(ctx: HttpContextContract) {
    let parkingRatings: ParkingRating[] = await ParkingRating.query().preload('parking').preload('user')
    return parkingRatings
  }
  public async store({ request }: HttpContextContract) {
    const body = request.body()
    const parkingRating: ParkingRating = await ParkingRating.create(body)
    return parkingRating
  }

  public async show({ params }: HttpContextContract) {
    return ParkingRating.findOrFail(params.id)
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const parkingRating: ParkingRating = await ParkingRating.findOrFail(params.id)
    // aca cuerpo //
    return parkingRating.save()
  }

  public async destroy({ params }: HttpContextContract) {
    // let users = await Parking.query().where('id', params.id)
    // if (users) {
    //   return {
    //     error: 'El rol tiene usuarios asociados',
    //     users: users,
    //   }
    // } else {
    //   const role: Parking = await Parking.findOrFail(params.id)
    //   return role.delete()
    // }
    }
  }