import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/Usuario'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class UsuersController {
  /**
   * Lista todos los usuarios
   */
  public async index(ctx: HttpContextContract) {
    return User.all()
  }
  /**
   * Almacena la información de un usuario
   */
  public async store({ request }: HttpContextContract) {
    const body = request.body()
    body.password = Encryption.encrypt(body.password)
    const new_user = await User.create(body)
    return new_user
  }
  /**
   * Muestra la información de un solo usuario
   */
  public async show({ params }: HttpContextContract) {
    return User.findOrFail(params.id)
  }
  /**
   * Actualiza la información de un usuario basado
   * en el identificador y nuevos parámetros
   */
  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const the_user = await User.findOrFail(params.id)
    the_user.name = body.nombre
    the_user.email = body.correo
    the_user.password = Encryption.encrypt(body.password)
    return the_user.save()
  }
  /**
   * Elimina a un usuario basado en el identificador
   */
  public async destroy({ params }: HttpContextContract) {
    const el_usuario = await User.findOrFail(params.id)
    return el_usuario.delete()
  }
}
