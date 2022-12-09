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

      public async finish({ params }: HttpContextContract) {
        const reservation: Reservation = await Reservation.findOrFail(params.res_id)
        reservation.state = 2;
        return reservation.save();
      }

      
      public async getByUser({ params }: HttpContextContract) {
        const reservations: Reservation[] = await Reservation.query().where("driver_id",params.driver_id).preload('driver').preload('parking_spot');
        return reservations;
      }

      
      public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const reservation: Reservation = await Reservation.findOrFail(params.id)
        reservation.parking_spot_id = body.parking_spot_id;
        reservation.vehicle_id = body.vehicle_id;
        reservation.price = body.price;
        reservation.start_date = body.start_date;
        reservation.end_date = body.end_date;
        reservation.observations = body.observations;
        reservation.state = body.state;
        return reservation.save()
      }
    
      public async destroy({ params }: HttpContextContract) {
        const the_reservation :Reservation = await Reservation.findOrFail(params.id)
        return the_reservation.delete()
      }




}
