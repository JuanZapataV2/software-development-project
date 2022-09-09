import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DriverVehicle from 'App/Models/DriverVehicle';

export default class DriverVehiclesController {

    public async index(ctx:HttpContextContract){
        let drivers_vehicles:DriverVehicle[]=await DriverVehicle.query()
        return drivers_vehicles;
    }

    public async store({request}:HttpContextContract){
        const body=request.body();
        const input_date = body.use_date;
        const d = new Date(input_date);
        body.use_date = d;
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
        const input_date = body.use_date;
        const d = new Date(input_date);
        body.use_date = d;
        drivers_vehicle.use_date=body.use_date;
        return drivers_vehicle.save();
    }


    public async destroy({params}:HttpContextContract) {
        const role_permission:DriverVehicle=await DriverVehicle.findOrFail(params.id);
        return role_permission.delete();
    }
}
