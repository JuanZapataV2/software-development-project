import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Motorcycle from '../../Models/Motorcycle';

export default class MotorcyclesController {

    //TODO: La respuesta siempre resulta vacía :(
    public async index(ctx: HttpContextContract) {
        let motorcycles: Motorcycle[] = await Motorcycle.query().preload('vehicle')
        return motorcycles;
    }

    /**
     * Almacena la información de un moto
     */
    public async store({ request }: HttpContextContract) {
        const body = request.body()
        body.vehicle_id = body.vehicle_id
        body.helmet = body.helmet
        const new_motorcycle = await Motorcycle.create(body)
        return new_motorcycle
    }
    /**
     * Muestra la información de un solo moto
     */
    public async show({ params }: HttpContextContract) {
        let motorcycle = await Motorcycle.query().where("id",params.id).preload('vehicle');
        return motorcycle
    }

    /**
     * Actualiza la información de un moto basado
     * en el identificador y nuevos parámetros
     */
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const the_motorcycle:Motorcycle = await Motorcycle.findOrFail(params.id)
        the_motorcycle.helmet = body.helmet
        the_motorcycle.vehicle_id = body.vehicle_id
        return the_motorcycle.save()
    }

    /**
     * Elimina a un moto basado en el identificador
     */
    public async destroy({ params }: HttpContextContract) {
        const the_motorcycle:Motorcycle = await Motorcycle.findOrFail(params.id)
        return the_motorcycle.delete()
    }
}
