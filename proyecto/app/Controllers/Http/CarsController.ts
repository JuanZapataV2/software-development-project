// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Car from '../../Models/Car';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class CarsController {
    
    public async index(ctx: HttpContextContract) {
        let cars: Car[] = await Car.query().preload('vehicle')
        console.log("Pepe"+cars);
        return cars;
    }

    /**
     * Almacena la información de un automovil
     */
    public async store({ request }: HttpContextContract) {
        const body = request.body()
        body.type = body.type
        body.vehicle_id = body.vehicle_id
        const new_car = await Car.create(body)
        return new_car
    }
    /**
     * Muestra la información de un solo automovil
     */
    public async show({ params }: HttpContextContract) {
        let car = await Car.query().where("id",params.id).preload('vehicle');
        return car
    }

    /**
     * Actualiza la información de un automovil basado
     * en el identificador y nuevos parámetros
     */
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const the_car:Car = await Car.findOrFail(params.id)
        the_car.type = body.type
        the_car.vehicle_id = body.vehicle_id
        return the_car.save()
    }

    /**
     * Elimina a un automovil basado en el identificador
     */
    public async destroy({ params }: HttpContextContract) {
        const the_car:Car = await Car.findOrFail(params.id)
        return the_car.delete()
    }


}
