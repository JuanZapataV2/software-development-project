 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from "App/Models/Role";
import User from 'App/Models/User';

export default class RolesController {


    public async index(ctx:HttpContextContract){
        let roles:Role[]=await Role.query().preload('permissions')
            return roles;
        }
        public async store({request}:HttpContextContract){
            const body=request.body();
            const role:Role=await Role.create(body);
            return role;
        }

        public async show({params}:HttpContextContract) {
            return Role.findOrFail(params.id);
        }


        public async update({params,request}:HttpContextContract) {
            const body=request.body();
            const role:Role=await Role.findOrFail(params.id);
            role.name=body.name;
            return role.save();
        }

        public async destroy({params}:HttpContextContract) {
            let users= await User.query()
            .where('role_id',params.id)
            if(users){
                return {
                    "error":"El rol tiene usuarios asociados",
                    "users":users
                }
            }else{
                const role:Role=await Role.findOrFail(params.id);
                return role.delete();
            }
        
        }
}
