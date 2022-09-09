import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Parking from "App/Models/Parking";


export default class ParkingsController {
  public async index(ctx: HttpContextContract) {
    let parkings: Parking[] = await Parking.query().preload('parking_spots').preload('parking_owner')
    return parkings
  }
  public async store({ request }: HttpContextContract) {
    const body = request.body()
    const parking: Parking = await Parking.create(body)
    return parking
  }

  public async show({ params }: HttpContextContract) {
    return Parking.findOrFail(params.id)
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const parking: Parking = await Parking.findOrFail(params.id)
    parking.name = body.name
    parking.address = body.address
    parking.telephone = body.telephone
    parking.number_spaces = body.number_spaces
    parking.open_hours = body.open_hours

    return parking.save()
  }

  public async destroy({ params }: HttpContextContract) {
    const the_parking :Parking = await Parking.findOrFail(params.id)
    return the_parking.delete()
  }
}
