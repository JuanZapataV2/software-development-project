import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RolePermission from 'App/Models/PermissionsRole'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await RolePermission.createMany([
      {
        role_id:1,
        permission_id: 1
      },
      {
        role_id:1,
        permission_id: 2
      },
      {
        role_id:2,
        permission_id: 1
      },
      {
        role_id:2,
        permission_id: 2
      },
      {
        role_id:3,
        permission_id: 1
      }
    ])
  }
}
