import { test } from '@japa/runner'
import { assert } from '@japa/assert'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

test.group('Permission', () => {
  test('List one Permission', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/permission/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains(
      // {
      //   id: 1,
      //   url: "/users",
      //   method: "GET",
      //   created_at: "2022-09-29T21:01:54.000-05:00",
      //   updated_at: "2022-09-29T21:01:54.000-05:00"
      // },
      {
        id: 1,
        url: '/users',
        method: 'GET',
        created_at: '2022-10-27T19:04:24.000-05:00',
        updated_at: '2022-10-27T19:04:24.000-05:00',
      }
    )
  })

  test('List all Permissions', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/permission').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      //   {
      //     id: 1,
      //     url: "/users",
      //     method: "GET",
      //     created_at: "2022-09-29T21:01:54.000-05:00",
      //     updated_at: "2022-09-29T21:01:54.000-05:00",
      //     roles: [
      //         {
      //             id: 1,
      //             name: "admin",
      //             created_at: "2022-09-29T21:01:54.000-05:00",
      //             updated_at: "2022-09-29T21:01:54.000-05:00"
      //         },
      //         {
      //             id: 3,
      //             name: "parkingOwner",
      //             created_at: "2022-09-29T21:01:54.000-05:00",
      //             updated_at: "2022-09-29T21:01:54.000-05:00"
      //         },
      //         {
      //             id: 4,
      //             name: "driver",
      //             created_at: "2022-09-29T21:01:54.000-05:00",
      //             updated_at: "2022-09-29T21:01:54.000-05:00"
      //         }
      //     ]
      // },
      {
        id: 1,
        url: '/users',
        method: 'GET',
        created_at: '2022-10-27T19:04:24.000-05:00',
        updated_at: '2022-10-27T19:04:24.000-05:00',
        roles: [
          {
            id: 1,
            name: 'admin',
            created_at: '2022-10-27T19:04:25.000-05:00',
            updated_at: '2022-10-27T19:04:25.000-05:00',
          },
        ],
      },
    ])
  })

  test('Create a Permission', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_permission = await Permission.query().orderBy('id', 'desc').first()
    let last_id = last_permission.id
    let url = '/testing'

    // Creación nuevo permiso
    const response = await client
      .post('/permission')
      .json({
        url: url,
        method: 'GET',
      })
      .loginAs(admin)
    response.assertStatus(200)

    // Verificación de creación
    const new_permisson = await Permission.findByOrFail('url', url)
    //assert.isAbove(new_permisson.id, last_id)
    assert.equal(new_permisson.url, url)

    // Eliminación para no dejar basura en la base de datos
    new_permisson.delete()
  })

  test('Edit a Permission', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_permission = await Permission.query().orderBy('id', 'desc').first()
    let last_id = last_permission.id
    let url = '/testing'

    // Creación nuevo permiso
    const response = await client
      .post('/permission')
      .json({
        url: url,
        method: 'GET',
      })
      .loginAs(admin)
    response.assertStatus(200)

    // Verificación de creación
    const new_permisson = await Permission.findByOrFail('id', response.response._body.id)
    assert.equal(new_permisson.url, url)

    //Edición del permiso
    const edit_response = await client
      .put(`/permission/${new_permisson.id}`)
      .json({
        url: '/VEHICLES',
        method: 'PUT',
      })
      .loginAs(admin)
    edit_response.assertStatus(200)

    // Verificación de creación
    const edited_permisson = await Permission.findByOrFail('id', new_permisson.id)
    assert.equal(new_permisson.id, edited_permisson.id)
    assert.equal(edited_permisson.url, '/VEHICLES')

    // Eliminación para no dejar basura en la base de datos
    new_permisson.delete()
  })

  test('Delete a Permission', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de permisos
    let number_of_permissions_resp = await Permission.query().count('* as total')
    let number_of_permissions = number_of_permissions_resp[0].$extras.total

    // Creación de nuevo permiso
    let url = '/testing'
    const response = await client
      .post('/permission')
      .json({
        url: url,
        method: 'GET',
      })
      .loginAs(admin)
    response.assertStatus(200)

    const new_permisson = await Permission.findByOrFail('url', url)
    //Eliminación del permiso
    const destroy_response = await client.delete(`/permission/${new_permisson.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de permisos
    let new_number_of_permissions_resp = await Permission.query().count('* as total')
    let new_number_of_permissions = new_number_of_permissions_resp[0].$extras.total
    //assert.equal(number_of_permissions, new_number_of_permissions)
  })
})
