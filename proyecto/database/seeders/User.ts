import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'


export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name:"Juan",
        email:"juan@mail.com",
        password:"1234",
        role_id:1
      },
      {
        name:"Juan2",
        email:"juan2@mail.com",
        password:"1234",
        role_id:2
      },
      {
        name:"Juan3",
        email:"juan3@mail.com",
        password:"1234",
        role_id:3
      },
      {
        name:"Juan4",
        email:"juan4@mail.com",
        password:"1234",
        role_id:1
      },
    ])
  }
}
