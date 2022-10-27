import { test } from '@japa/runner'
import { assert } from '@japa/assert'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import PermissionsRole from 'App/Models/PermissionsRole'

test.group('Role-Permisos', () => {
  test('List one Role-Permisos', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('permission-roles/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains(
      //   {
      //     id: 1,
      //     role_id: 1,
      //     permission_id: 1,
      //     created_at: "2022-09-29T21:01:54.000-05:00",
      //     updated_at: "2022-09-29T21:01:54.000-05:00"
      // }
      {
        id: 1,
        role_id: 1,
        permission_id: 1,
        created_at: '2022-10-27T00:56:18.000-05:00',
        updated_at: '2022-10-27T00:56:18.000-05:00',
      }
    )
  })

  test('List all Roles-Permisos', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Role testing)
    const admin = await User.find(1)
    const response = await client.get('permission-roles').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        role_id: 1,
        permission_id: 1,
        created_at: '2022-10-27T00:56:18.000-05:00',
        updated_at: '2022-10-27T00:56:18.000-05:00',
      },
    ])
  })

  test('Create a Role-Permission', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_role = await PermissionsRole.query().orderBy('id', 'desc').first()
    let last_id = last_role.id

    // Creación nuevo permiso
    const response = await client
      .post('permission-roles')
      .json({
        role_id: 2,
        permission_id: 2,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_role = await PermissionsRole.findByOrFail('id', response.response._body.id)
    assert.isAbove(new_role.id, last_id)
    assert.equal(new_role.role_id, 2)

    // Eliminación para no dejar basura en la base de datos
    new_role.delete()
  })

  test('Edit a Role-Permission', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_role = await PermissionsRole.query().orderBy('id', 'desc').first()
    let last_id = last_role.id

    // Creación nuevo permiso
    const response = await client
      .post('permission-roles')
      .json({
        role_id: 2,
        permission_id: 3,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_role = await PermissionsRole.findByOrFail('id', response.response._body.id)
    assert.isAbove(new_role.id, last_id)
    assert.equal(new_role.role_id, 2)

    //Edición del rol-permiso
    const edit_response = await client
      .put(`/permission-roles/${new_role.id}`)
      .json({
        role_id: 3,
        permission_id: 3,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de edición
    const edited_role = await PermissionsRole.findByOrFail('role_id', 2)
    assert.equal(edited_role.role_id, new_role.role_id)
    assert.equal(edited_role.id, new_role.id)

    // Eliminación para no dejar basura en la base de datos
    new_role.delete()
  })

  test('Delete a Role-Permisos', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de permisos
    let number_of_roles_resp = await PermissionsRole.query().count('* as total')
    let number_of_roles = number_of_roles_resp[0].$extras.total

    // Creación de nuevo permiso
    const response = await client
      .post('permission-roles')
      .json({
        role_id: 2,
        permission_id: 1,
      })
      .loginAs(admin)
    response.assertStatus(200)

    const new_role = await PermissionsRole.findByOrFail('id', response.response._body.id)
    //Eliminación del permiso
    const destroy_response = await client.delete(`permission-roles/${new_role.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de permisos
    let new_number_of_roles_resp = await PermissionsRole.query().count('* as total')
    let new_number_of_roles = new_number_of_roles_resp[0].$extras.total
    //assert.equal(number_of_roles, new_number_of_roles)
  })
})
