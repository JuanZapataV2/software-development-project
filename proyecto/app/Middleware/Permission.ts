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

    let new_url = "/"+parts[1]
    const user_id = auth.user?.id
    const user_role_id = auth.user?.role_id

    let has_permissions:boolean 
    
    
    has_permissions = await this.verifyPermissions(user_role_id, new_url, method)
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
