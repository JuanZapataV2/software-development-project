// import type { HttpContextContract } from
'@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import ApiToken from 'App/Models/ApiToken'
import User from 'App/Models/User'
import EmailService from 'App/Services/EmailService'
import PlantillaSeguridad from 'App/Services/EmailTemplates/SecurityTemplate'

export default class SecuritiesController {
  async login({ auth, request, response }) {
    
    const email = request.input('email')
    const password = request.input('password')
    const el_User = await User.query().where('email', email).firstOrFail()
    if (await Hash.verify(el_User.password, password)) {
      //Generación token
      const token = await auth.use('api').generate(el_User, {
        expiresIn: '60 mins',
      })
      let plantilla_email: PlantillaSeguridad = new PlantillaSeguridad()
      let html = plantilla_email.newLogin()
      let el_servicio_email: EmailService = new EmailService()
      el_servicio_email.sendEmail(email, 'Nuevo Inicio de Sesión', html)
      //Obtiene los datos correspondientes a la relación
      await el_User.load('role')
      el_User.password = ''
      return {
        token: token,
        User: el_User,
      }
    } else {
      return response.unauthorized('Credenciales inválidas')
    }
  }
  async logout({ auth }) {
    await auth.use('api').revoke()
    return {
      revoked: true,
    }
  }
  async forgotPassword({ auth, request }) {
    let respuesta: Object = {}
    const email = request.input('email')

    const el_User = await User.query().where('email', email).firstOrFail()
    if (!el_User) {
      respuesta = {
        status: 'error',
        message: 'El email no está registrado en la plataforma',
      }
    } else {
      const token = await auth.use('api').generate(el_User, {
        expiresIn: '60 mins',
      })
      let plantilla_email: PlantillaSeguridad = new PlantillaSeguridad()
      let html = plantilla_email.forgotPassword(token.token)
      let el_servicio_email: EmailService = new EmailService()
      el_servicio_email.sendEmail(email, 'Solicitud restablecimiento de contraseña', html)
      respuesta = {
        status: 'success',
        message: 'Revisar el email',
      }
    }
    return respuesta
  }
  async resetPassword({ auth, request }) {
    let respuesta: Object = {}
    try {
      await auth.use('api').authenticate()
      auth.use('api').isAuthenticated
    } catch (error) {
      return {
        status: 'error',
        message: 'Token corrupto',
      }
    }
    const el_User = await User.findBy('email', auth.user!.email)
    if (!el_User) {
      respuesta = {
        status: 'error',
        message: 'Este User no existe',
      }
    } else {
      el_User.password = request.input('password')
      await el_User.save()
      await auth.use('api').revoke()
      respuesta = {
        status: 'success',
        message: 'La contraseña se ha restaurado correctamente',
      }
    }
    return respuesta
  }
}
