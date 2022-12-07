import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import DriverVehicle from 'App/Models/DriverVehicle';

export default class DriverVehiclesController {

    public async index(ctx:HttpContextContract){
        let drivers_vehicles:DriverVehicle[]=await DriverVehicle.query()
        return drivers_vehicles;
    }

    public async store({request}:HttpContextContract){
        const body=request.body();
        const drivers_vehicle:DriverVehicle=await DriverVehicle.create(body);
        return drivers_vehicle;
    }

    public async show({params}:HttpContextContract) {
        return DriverVehicle.findOrFail(params.id);
    }

    public async update({params,request}:HttpContextContract) {
        const body=request.body();
        const drivers_vehicle:DriverVehicle=await DriverVehicle.findOrFail(params.id);
        drivers_vehicle.vehicle_id=body.driver_id;
        drivers_vehicle.driver_id=body.driver_id;
        // const input_date = body.use_date;
        // const d = new Date(input_date);
        // body.use_date = d;
        // drivers_vehicle.use_date=body.use_date;
        return drivers_vehicle.save();
    }

    public async getOwnerVehicles({ params }: HttpContextContract) {
        let vehicles = await await Database.rawQuery
        (`SELECT dv.vehicle_id, dv.driver_id, dv.use_date,
            v.license_plate 
            FROM driver_vehicles dv
            JOIN vehicles v on dv.vehicle_id = v.id
            JOIN drivers d on dv.driver_id = d.id
            WHERE dv.driver_id = ${params.driver_id};`
        );
        return vehicles[0];
    }

    public async getDriverVehicles({ params }: HttpContextContract) {
        const vehicles = await Database.rawQuery(`SELECT dv.vehicle_id, v.id, v.license_plate FROM driver_vehicles dv
        JOIN vehicles v on v.id = dv.vehicle_id
        WHERE dv.driver_id = ${params.driver_id};`);
        return vehicles[0]
    }


    public async destroy({params}:HttpContextContract) {
        const role_permission:DriverVehicle=await DriverVehicle.findOrFail(params.id);
        return role_permission.delete();
    }
}
