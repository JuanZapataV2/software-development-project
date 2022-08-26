import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permit from '../../Models/Permit';

export default class PermissionsController {

    public async index(ctx:HttpContextContract){
        let permisos:Permit[]=await Permit.query().preload('roles')
            return permisos;
        }
        public async store({request}:HttpContextContract){
            const body=request.body();
            const permission:Permit=await Permit.create(body);
            return permission;
        }

        public async show({params}:HttpContextContract) {
            return Permit.findOrFail(params.id);
        }


        public async update({params,request}:HttpContextContract) {
            const body=request.body();
            const permission:Permit=await Permit.findOrFail(params.id);
            permission.url=body.url;
            permission.method=body.metod;
            return permission.save();
        }

        public async destroy({params}:HttpContextContract) {
            const permission:Permit=await Permit.findOrFail(params.id);
            return permission.delete();
        }

}
