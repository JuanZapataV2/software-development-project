import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Parking from "App/Models/Parking";


export default class ParkingsController {
  public async index(ctx: HttpContextContract) {
    let parkings: Parking[] = await Parking.query().preload('parking_spots').preload('parking_owner').preload('ratings')
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
    // aca cuerpo //
    return parking.save()
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
