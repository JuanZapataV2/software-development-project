// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Vehicle from '../../Models/Vehicle';
import Database from '@ioc:Adonis/Lucid/Database'
export default class VehiclesController {


    public async index(ctx: HttpContextContract) {
        let vehicles: Vehicle[] = await Vehicle.query().preload('drivers')
        return vehicles;
    }


    /**
     * Almacena la información de un vehículo
     */
    public async store({ request }: HttpContextContract) {
        const body = request.body()
        body.license_plate = body.license_plate
        const new_vehicle = await Vehicle.create(body)
        return new_vehicle
    }
    /**
     * Muestra la información de un solo vehículo
     */
    public async show({ params }: HttpContextContract) {
        let vehicle = await Vehicle.query().where("id",params.id).preload('drivers');
        return vehicle
    }

    public async findByPlate({ params }: HttpContextContract) {
        const new_vehicle = await Vehicle.query().where("license_plate",params.license_plate).preload('cars').preload('motorcycles');
        return new_vehicle[0]
    }

    public async getDriverVehicles({ params }: HttpContextContract) {
        const vehicles = await Database.rawQuery(`SELECT dv.vehicle_id, v.id, v.license_plate FROM driver_vehicles dv
        JOIN vehicles v on v.id = dv.vehicle_id
        WHERE dv.driver_id = ${params.driver_id};`);
        return vehicles
    }

    /**
     * Actualiza la información de un vehículo basado
     * en el identificador y nuevos parámetros
     */
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const the_vehicle:Vehicle = await Vehicle.findOrFail(params.id)
        the_vehicle.license_plate = body.license_plate
        return the_vehicle.save()
    }

    /**
     * Elimina a un vehículo basado en el identificador
     */
    public async destroy({ params }: HttpContextContract) {
        const the_vehicle:Vehicle = await Vehicle.findOrFail(params.id)
        return the_vehicle.delete()
    }
}
