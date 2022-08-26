 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PermissionRole from '../../Models/PermissionRole';

export default class RolePermissionsController {

    public async index(ctx:HttpContextContract){
        let role_permission:PermissionRole[]=await PermissionRole.query()
        return role_permission;
    }

    public async store({request}:HttpContextContract){
        const body=request.body();
        const role_permission:PermissionRole=await PermissionRole.create(body);
        return role_permission;
    }
    public async show({params}:HttpContextContract) {
        return PermissionRole.findOrFail(params.id);
    }

    public async update({params,request}:HttpContextContract) {
        const body=request.body();
        const role_permission:PermissionRole=await
        PermissionRole.findOrFail(params.id);
        role_permission.role_id=body.id_rol;
        role_permission.permission_id=body.id_permiso;
        return role_permission.save();
    }
    public async destroy({params}:HttpContextContract) {
        const role_permission:PermissionRole=await
        PermissionRole.findOrFail(params.id);
        return role_permission.delete();
    }
}
