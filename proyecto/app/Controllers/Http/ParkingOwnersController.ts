import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ParkingOwner from '../../Models/ParkingOwner';
import User from '../../Models/User';

export default class ParkingOwnersController {

    //TODO: La respuesta siempre resulta vacía :(
    public async index(ctx: HttpContextContract) {
        let owners: ParkingOwner[] = await ParkingOwner.query().preload('user');
        return owners;
    }

    /**
     * Almacena la información de un dueño de parqueadero
     */
    public async store({ request }: HttpContextContract) {
        const body = request.body();
        body.user_id = body.user_id;
        let user = await User.query().where("id",body.user_id);
        if(user){
            const new_owner = await ParkingOwner.create(body);
            return new_owner;
        } else {
            return "Invalid user";
        }
    }

    /**
     * Muestra la información de un solo dueño de parqueadero
     */
    public async show({ params }: HttpContextContract) {
        let owner = await ParkingOwner.query().where("id",params.id).preload('user').preload('parkings');
        return owner
    }

    /**
     * Actualiza la información de un dueño de parqueadero basado
     * en el identificador y nuevos parámetros
     */
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const the_owner:ParkingOwner = await ParkingOwner.findOrFail(params.id)
        the_owner.user_id = body.user_id
        let user = await User.query().where("id",body.user_id);
        if(user){
            return the_owner.save()
        } else {
            return "Invalid user";
        }
    }

    public async getById({ params }: HttpContextContract) {
        let owner = await ParkingOwner.query().where("user_id",params.id).preload('user');
        return owner[0]
    }

    /**
     * Elimina a un dueño de parqueadero basado en el identificador
     */
    public async destroy({ params }: HttpContextContract) {
        const the_owner:ParkingOwner = await ParkingOwner.findOrFail(params.id)
        return the_owner.delete()
    }
}
