import { test } from '@japa/runner'
import { assert } from '@japa/assert'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

test.group('Roles', () => {
  test('List one Role', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/roles/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains(
      // {
      //   id: 1,
      //   name: "admin",
      //   created_at: "2022-09-29T21:01:54.000-05:00",
      //   updated_at: "2022-09-29T21:01:54.000-05:00"
      // }
      {
        id: 1,
        name: 'admin',
        created_at: '2022-10-27T00:56:18.000-05:00',
        updated_at: '2022-10-27T00:56:18.000-05:00',
      }
    )
  })

  test('List all Roles', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Role testing)
    const admin = await User.find(1)
    const response = await client.get('/roles').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains(
      //   {
      //     id: 2,
      //     name: "visitor",
      //     created_at: "2022-09-29T21:01:54.000-05:00",
      //     updated_at: "2022-09-29T21:01:54.000-05:00"
      //  },
      [
        {
          id: 2,
          name: 'visitor',
          created_at: '2022-10-27T00:56:18.000-05:00',
          updated_at: '2022-10-27T00:56:18.000-05:00',
          permissions: [],
        },
      ]
    )
  })

  test('Create a Role', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_role = await Role.query().orderBy('id', 'desc').first()
    let last_id = last_role.id
    let name = 'testing'

    // Creación nuevo rol
    const response = await client
      .post('/roles')
      .json({
        name: name,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_role = await Role.findByOrFail('name', name)
    assert.isAbove(new_role.id, last_id)
    assert.equal(new_role.name, name)

    // Eliminación para no dejar basura en la base de datos
    new_role.delete()
  })

  test('Edit a Role', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_role = await Role.query().orderBy('id', 'desc').first()
    let last_id = last_role.id
    let name = 'testing'

    // Creación nuevo rol
    const response = await client
      .post('/roles')
      .json({
        name: name,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_role = await Role.findByOrFail('name', name)
    assert.isAbove(new_role.id, last_id)
    assert.equal(new_role.name, name)
    //Edición del rol

    const edit_response = await client
      .put(`/roles/${new_role.id}`)
      .json({
        name: 'Edited role',
      })
      .loginAs(admin)

    response.assertStatus(200)

    const edited_role = await Role.findByOrFail('id', new_role.id)
    assert.equal(edited_role.name, 'Edited role')
    assert.notEqual(edited_role.name, new_role.name)

    // Eliminación para no dejar basura en la base de datos
    new_role.delete()
  })

  test('Delete a Role', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de permisos
    let number_of_roles_resp = await Role.query().count('* as total')
    let number_of_roles = number_of_roles_resp[0].$extras.total

    // Creación de nuevo rol
    let name = 'testing'
    const response = await client
      .post('/roles')
      .json({
        name: name,
      })
      .loginAs(admin)
    response.assertStatus(200)

    const new_role = await Role.findByOrFail('id', response.response._body.id)
    //Eliminación del rol
    const destroy_response = await client.delete(`/roles/${new_role.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de permisos
    let new_number_of_roles_resp = await Role.query().count('* as total')
    let new_number_of_roles = new_number_of_roles_resp[0].$extras.total
    //assert.equal(number_of_roles, new_number_of_roles)
  })
})
