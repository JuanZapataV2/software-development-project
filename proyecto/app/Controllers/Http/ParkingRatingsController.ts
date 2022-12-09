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

  public async getParkingReviews({ params }: HttpContextContract) {
    const revs: ParkingRating[] = await ParkingRating.query().where("parking_id",params.parking_id).preload('parking').preload('user');
    return revs;
  }

  public async show({ params }: HttpContextContract) {
    return ParkingRating.findOrFail(params.id)
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const parkingRating: ParkingRating = await ParkingRating.findOrFail(params.id)
    parkingRating.comment = body.comment;
    parkingRating.rating = body.rating;
    return parkingRating.save()
  }

  public async destroy({ params }: HttpContextContract) {
    const parkingRating :ParkingRating = await ParkingRating.findOrFail(params.id)
    return parkingRating.delete()
  }
  }