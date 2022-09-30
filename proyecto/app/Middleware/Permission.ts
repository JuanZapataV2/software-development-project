import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PermissionRole from '../Models/PermissionsRole'
import Permission from '../Models/Permission'
//import User from 'App/Models/User'
//import Role from 'App/Models/Role'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class PermissionGuard {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    const url = request.url()
    const method = request.method()
    const parts = url.split('/')

    let new_url = "/"+parts[1]
    const user_id = auth.user?.id
    const user_role_id = auth.user?.role_id

    let has_permissions:boolean 
    console.log("lanza:",request.url(),user_role_id, new_url, method)
    has_permissions = await this.verifyPermissions(user_role_id, new_url, method)

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
    console.log("Permiso otorgado")
    await next()
  
  }

  protected async verifyPermissions(user_role_id, url, method):Promise<boolean>{
    let role_permissions = await PermissionRole.query().where('role_id', '=', user_role_id)
    for(let i=0;i<role_permissions.length;i++){
      let permission = await Permission.find(role_permissions[i].permission_id)
      if (permission?.url == url && permission?.method == method.toUpperCase()) 
        return true
    }
    return false
  }

  // getUrlParts(parts){
  //   let url_route = "/"+parts[1];

  // }
}
