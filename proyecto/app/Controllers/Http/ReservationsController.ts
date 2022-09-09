import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Reservation from "App/Models/Reservation";

export default class ReservationsController {

    public async index(ctx: HttpContextContract) {
        let reservations: Reservation[] = await Reservation.query().preload('driver').preload('parking_spot')
        return reservations
      }
      public async indexVehicle(ctx: HttpContextContract) {
        let reservations: Reservation[] = await Reservation.query().preload('driver').preload('parking_spot').preload('vehicle')
        return reservations
      }
      public async store({ request }: HttpContextContract) {
        const body = request.body()
        const reservation: Reservation = await Reservation.create(body)
        return reservation
      }
    
      public async show({ params }: HttpContextContract) {
        return Reservation.findOrFail(params.id)
      }
    
      public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const reservation: Reservation = await Reservation.findOrFail(params.id)
        // aca cuerpo //
        return reservation.save()
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
