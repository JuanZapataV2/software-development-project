import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PermissionRole from '../Models/PermissionsRole'
import Permission from '../Models/Permission'
import User from 'App/Models/User'
//import Role from 'App/Models/Role'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class PermissionGuard {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    const url = request.url()
    const method = request.method()
    const parts = url.split('/')

    let new_url = '/' + parts[1]
    const user_id = auth.user?.id
    let user_url_id
    if (parts[2] != undefined) user_url_id = parts[2]
    else user_url_id = -1

    const user_role_id = auth.user?.role_id

    let has_permissions: boolean

    has_permissions = await this.verifyPermissions(
      user_role_id,
      new_url,
      method,
      user_id,
      user_url_id
    )
    // if(parts[2] != undefined)
    //   has_permissions = await this.isSameUser(parts[1],parts[2],user_id)
    if (!has_permissions) {
      /**
       * The user doesnt have the right permissions for its request
       */
      throw new AuthenticationException(
        'Missing right permissions',
        'E_MISSINGS_PERMISSIONS',
        this.redirectTo
      )
    }

    // The user has permission
    await next()
  }

  protected async verifyPermissions(
    user_role_id,
    url,
    method,
    user_id,
    user_url_id
  ): Promise<boolean> {
    //Verificación de que el usuario haga cosas sobre si mismo
    let user = await User.findOrFail(user_id)
    console.log("user.role_id", user.role_id)
    if (user.role_id == 1) {
      return true
    } else if (user_url_id != -1 && url == '/users' && user.id == user_url_id) {
      return true
    }

    let role_permissions = await PermissionRole.query().where('role_id', '=', user.role_id)
    for (let i = 0; i < role_permissions.length; i++) {
      let permission = await Permission.find(role_permissions[i].permission_id)
      if (permission?.url == url && permission?.method == method.toUpperCase()) return true
    }

    return false
  }

  // protected async isSameUser(url, user_url_id,user_id):Promise<boolean>{
  //   if(url == "users"){
  //     let user = await User.findOrFail(user_url_id)
  //     if(user.role_id == 1){
  //       return true
  //     }else {
  //       if(user.id == user_id)
  //         return true
  //       else
  //         return false
  //     }
  //   }
  // }

  // getUrlParts(parts){
  //   let url_route = "/"+parts[1];

  // }
}
