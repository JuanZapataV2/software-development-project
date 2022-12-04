import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Driver from '../../Models/Driver';

export default class DriversController {

    //TODO: La respuesta siempre resulta vacía :(
    public async index(ctx: HttpContextContract) {
        let drivers: Driver[] = await Driver.query().preload('user');
        return drivers;
    }

    /**
     * Almacena la información de un conductor
     */
    public async store({ request }: HttpContextContract) {
        const body = request.body();
        body.user_id = body.user_id;
        let user = await User.query().where("id",body.user_id);
        if(user){
            const new_driver = await Driver.create(body);
            return new_driver;
        } else {
            return "Invalid user";
        }
    }

    /**
     * Muestra la información de un solo conductor
     */
    public async show({ params }: HttpContextContract) {
        let driver = await Driver.query().where("id",params.id).preload('user').preload('vehicles');
        return driver
    }

    public async getById({ params }: HttpContextContract) {
        let driver = await Driver.query().where("user_id",params.id).preload('user').preload('vehicles');
        return driver[0]
    }

    /**
     * Actualiza la información de un conductor basado
     * en el identificador y nuevos parámetros
     */
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const the_driver:Driver = await Driver.findOrFail(params.id)
        the_driver.user_id = body.user_id
        let user = await User.query().where("id",body.user_id);
        if(user){
            return the_driver.save()
        } else {
            return "Invalid user";
        }
    }

    /**
     * Elimina a un conductor basado en el identificador
     */
    public async destroy({ params }: HttpContextContract) {
        const the_driver:Driver = await Driver.findOrFail(params.id)
        return the_driver.delete()
    }
}
