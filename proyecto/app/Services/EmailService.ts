import Env from '@ioc:Adonis/Core/Env'

export default class EmailService {
    sendEmail(emailTo,theSubject,theHTML) {
        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(Env.get('SENDGRID_API_KEY'))
        const msg = {
            to: emailTo, // Change to your recipient
            from: Env.get('SENDGRID_FROM_EMAIL'), 
            subject: theSubject,
            html: theHTML,
        }

        sgMail.send(msg).then(() => {
            console.log('Email sent')
        })

        .catch((error) => {
            console.error(error)
        })
    }
}