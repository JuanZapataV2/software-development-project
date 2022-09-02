import Env from "@ioc:Adonis/Core/Env"

export default class SecurityTemplate{
    newLogin(){
        let html="<p></p>Se ha registrado un nuevo inicio de sesión</p>";
        return html;
    }

    forgotPassword(token){
        let html="<h1></h1>Sistema Demo-Adonis</h1>";

        html+="<p>Para solicitar el restablecimiento de su contraseña ingrese <a href='"+Env.get('URL_FRONTEND')+"/#/security/change-password/"+token+"'>aquí</a></p>";
        return html;
    }

    resetPassword(token){
        let html="<h1>Sistema Demo-Adonis</h1>";
        html+="<p>Para cambiar su contraseña ingrese <a href='"+Env.get('URL_FRONTEND')+"/#/security/change-password/"+token+"'>aquí</a></p>";
        return html;
        }
}