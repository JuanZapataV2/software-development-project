import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PermissionRole from '../Models/PermissionRole';
import Permission from '../Models/Permission';

export default class Permission {
  public async handle({auth, request, response}: HttpContextContract, next: () => Promise<void>) {
    console.log(request);
    let url = request.url();
    const method = request.method();
    const parts = url.split("/");

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }

  private 
}
