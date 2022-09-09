import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ParkingSpot from "App/Models/ParkingSpot";

export default class ParkingSpotsController {

    public async index(ctx: HttpContextContract) {
        let parkingSpots: ParkingSpot[] = await ParkingSpot.query()
        return parkingSpots
      }
    public async indexParking(ctx: HttpContextContract) {
      let parkingSpots: ParkingSpot[] = await ParkingSpot.query().preload('parking')
      return parkingSpots
    }
      public async store({ request }: HttpContextContract) {
        const body = request.body()
        const parkingSpot: ParkingSpot = await ParkingSpot.create(body)
        return parkingSpot
      }
    
      public async show({ params }: HttpContextContract) {
        return ParkingSpot.findOrFail(params.id)
      }
    
      public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const parkingSpot: ParkingSpot = await ParkingSpot.findOrFail(params.id)
        // aca cuerpo //
        return parkingSpot.save()
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
