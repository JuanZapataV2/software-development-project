import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission';

export default class extends BaseSeeder {
  public async run () {
    await Permission.createMany([
      {
        url:"/users",
        method: "GET"
      },
      {
        url:"/users",
        method: "PUT"
      },
      {
        url:"/users",
        method: "DELETE"
      }
    ])
    // Write your database queries inside the run method
  }
}
