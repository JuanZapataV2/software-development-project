import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from '../../Models/Profile';
import EmailService from '../../Services/EmailService';

export default class ProfilesController {

    public async index(ctx:HttpContextContract){
        let profiles:Profile[]=await Profile.query()
        return profiles;
    }

    public async store({request}:HttpContextContract){
        const body=request.body();
        let theEmailService:EmailService=new EmailService();
        theEmailService.sendEmail(body.email,"Creación de cuenta SmartParking","Usted acaba de crear una nueva cuenta en el sistema.")
        const profile:Profile=await Profile.create(body);
        return profile;
    }

    public async show({params}:HttpContextContract) {
        return Profile.findOrFail(params.id);
    }

    public async update({params,request}:HttpContextContract) {
        const body=request.body();
        const profile:Profile=await Profile.findOrFail(params.id);
        profile.phone=body.phone;
        profile.facebook_url=body.facebook_url;
        profile.instagram_url=body.instagram_url;
        return profile.save();
    }

    public async destroy({params}:HttpContextContract) {
        const profile:Profile=await Profile.findOrFail(params.id);
        return profile.delete();
    }
}
