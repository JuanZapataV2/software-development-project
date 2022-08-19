import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'
import Encryption from '@ioc:Adonis/Core/Encryption'

export default class UsuariosController {
  /**
   * Lista todos los usuarios
   */
  public async index(ctx: HttpContextContract) {
    return Usuario.all()
  }
  /**
   * Almacena la información de un usuario
   */
  public async store({ request }: HttpContextContract) {
    const body = request.body()
    body.contrasena = Encryption.encrypt(body.contrasena)
    const nuevo_usuario = await Usuario.create(body)
    return nuevo_usuario
  }
  /**
   * Muestra la información de un solo usuario
   */
  public async show({ params }: HttpContextContract) {
    return Usuario.findOrFail(params.id)
  }
  /**
   * Actualiza la información de un usuario basado
   * en el identificador y nuevos parámetros
   */
  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const el_usuario = await Usuario.findOrFail(params.id)
    el_usuario.nombre = body.nombre
    el_usuario.correo = body.correo
    el_usuario.contrasena = Encryption.encrypt(body.contrasena)
    return el_usuario.save()
  }
  /**
   * Elimina a un usuario basado en el identificador
   */
  public async destroy({ params }: HttpContextContract) {
    const el_usuario = await Usuario.findOrFail(params.id)
    return el_usuario.delete()
  }
}
