import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Profile from '../../Models/Profile';
import EmailService from 'App/Services/EmailService';

export default class UsuersController {
  /**
   * Lista todos los usuarios
   */
  public async index(ctx: HttpContextContract) {
    let users: User[] = await User.query().preload('role').preload('profile')
    return users;
  }
  /**
   * Almacena la información de un usuario
   */
  public async store({ request }: HttpContextContract) {
    const body = request.body()
    //body.password = Encryption.encrypt(body.password)
    const new_user = await User.create(body)
    return new_user
  }
  /**
   * Muestra la información de un solo usuario
   */
  public async show({ params }: HttpContextContract) {
    let user = await User.query().where("id",params.id).preload('profile');
    return user
  }
  /**
   * Actualiza la información de un usuario basado
   * en el identificador y nuevos parámetros
   */
  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const the_user:User = await User.findOrFail(params.id)
    the_user.name = body.name
    the_user.email = body.email
    the_user.password = Encryption.encrypt(body.password)
    the_user.role_id = body.role_id;

    if(body.profile){
      body.profile.user_id=params.id;
      await this.setProfile(body.profile);
    }
    return the_user.save()
  }

  public async setProfile(profile_info){
    const user_profile=await
    Profile.findBy('user_id',profile_info.user_id );
    if(user_profile){
      user_profile.phone=profile_info.phone;
      user_profile.facebook_url=profile_info.facebook_url;
      user_profile.instagram_url=profile_info.instagram_url;
      await user_profile.save();
    }else{
    await Profile.create(profile_info);
    }
  }
  /**
   * Elimina a un usuario basado en el identificador
   */
  public async destroy({ params }: HttpContextContract) {
    const el_usuario:User = await User.findOrFail(params.id)
    return el_usuario.delete()
  }


  public async testEmail({params, request}: HttpContextContract){
    const body = request.body()
    let theEmailService:EmailService=new EmailService();
    theEmailService.sendEmail(body.email,"Nuevo Inicio de Sesión","Usted acaba de iniciar sesión en el sistema.")
  }
}
