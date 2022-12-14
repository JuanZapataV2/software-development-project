import User from 'App/Models/User'
import { assert } from '@japa/assert'
import { test } from '@japa/runner'

test.group('User', () => {
  test('List user', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/users/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains([
      // {
      //   id: 1,
      //   created_at: "2022-09-29T21:01:54.000-05:00",
      //   updated_at: "2022-09-29T21:01:54.000-05:00",
      //   name: "Juan",
      //   email: "juan@mail.com",
      //   password: "$argon2id$v=19$t=3,m=4096,p=1$0dB8LjvFdNpNB5AWYDYnSw$5bNVMpmM7QB230FLfBR4mzktA9AToOva43NTRUTpFkY",
      //   role_id: 1,
      //   profile: {
      //     id: 1,
      //     user_id: 1,
      //     phone: "3002525",
      //     facebook_url: "facebook.com",
      //     instagram_url: "instagram/yo.com",
      //     created_at: "2022-10-24T18:53:34.000-05:00",
      //     updated_at: "2022-10-24T18:54:19.000-05:00"
      //   }
      // },
      {
        id: 1,
        created_at: '2022-10-27T19:04:25.000-05:00',
        updated_at: '2022-10-27T19:04:25.000-05:00',
        name: 'Juan',
        email: 'juan@mail.com',
        password:
          '$argon2id$v=19$t=3,m=4096,p=1$Gx6nzFBQYI5eicZperXhBg$Ll+23FblkBJhCZWfQ3nUjL5fWTCFY5nkY1YmLeU183g',
        role_id: 1,
        profile: {
          id: 1,
          user_id: 1,
          phone: '3002525',
          facebook_url: 'facebook.com',
          instagram_url: 'instagram.com',
          created_at: '2022-10-27T19:08:26.000-05:00',
          updated_at: '2022-10-27T19:08:26.000-05:00',
        },
      },
    ])
  })

  test('List all users', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/users').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      // {
      //   id: 1,
      //   created_at: "2022-09-29T21:01:54.000-05:00",
      //   updated_at: "2022-09-29T21:01:54.000-05:00",
      //   name: "Juan",
      //   email: "juan@mail.com",
      //   password: "$argon2id$v=19$t=3,m=4096,p=1$0dB8LjvFdNpNB5AWYDYnSw$5bNVMpmM7QB230FLfBR4mzktA9AToOva43NTRUTpFkY",
      //   role_id: 1,
      //   role: {
      //       id: 1,
      //       name: "admin",
      //       created_at: "2022-09-29T21:01:54.000-05:00",
      //       updated_at: "2022-09-29T21:01:54.000-05:00"
      //   },
      //   profile: {
      //     id: 1,
      //     user_id: 1,
      //     phone: "3002525",
      //     facebook_url: "facebook.com",
      //     instagram_url: "instagram/yo.com",
      //     created_at: "2022-10-24T18:53:34.000-05:00",
      //     updated_at: "2022-10-24T18:54:19.000-05:00"
      //   }
      // },
      {
        id: 1,
        created_at: '2022-10-27T19:04:25.000-05:00',
        updated_at: '2022-10-27T19:04:25.000-05:00',
        name: 'Juan',
        email: 'juan@mail.com',
        password:
          '$argon2id$v=19$t=3,m=4096,p=1$Gx6nzFBQYI5eicZperXhBg$Ll+23FblkBJhCZWfQ3nUjL5fWTCFY5nkY1YmLeU183g',
        role_id: 1,
        role: {
          id: 1,
          name: 'admin',
          created_at: '2022-10-27T19:04:25.000-05:00',
          updated_at: '2022-10-27T19:04:25.000-05:00',
        },
        profile: {
          id: 1,
          user_id: 1,
          phone: '3002525',
          facebook_url: 'facebook.com',
          instagram_url: 'instagram.com',
          created_at: '2022-10-27T19:08:26.000-05:00',
          updated_at: '2022-10-27T19:08:26.000-05:00',
        },
      },
    ])
  })

  test('Create a user', async ({ client, assert }) => {
    // Write your test here
    // Obtener ultimo id
    let last_user = await User.query().orderBy('id', 'desc').first()
    let last_id = last_user.id

    // Creaci??n nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })
    response.assertStatus(200)

    // Verificaci??n de creaci??n
    const new_user = await User.findByOrFail('email', email + '@mail.com')
    assert.isAbove(new_user.id, last_id)
    assert.equal(new_user.email, email + '@mail.com')

    // Eliminaci??n para no dejar basura en la base de datos
    new_user.delete()
  })

  test('Edit a user', async ({ client, assert }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)

    let previous_user
    let last_user = await User.query().orderBy('id', 'desc').first()
    let last_id = last_user.id

    // Creaci??n del usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'Test edit user',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })

    // Edici??n del usuario
    const new_user = await User.findBy('email', email + '@mail.com')
    let new_id = new_user.id

    const edit_response = await client
      .put(`/users/${new_user.id}`)
      .json({
        name: 'EditTestEdited',
        password: '12345',
      })
      .loginAs(admin)

    // Verificaci??n de edici??n
    const edited_user = await User.findByOrFail('email', email + '@mail.com')
    edit_response.assertStatus(200)
    assert.equal(edited_user.name, 'EditTestEdited')

    // Eliminaci??n para no dejar basura en la base de datos
    new_user.delete()
  })

  test('Delete a user', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //N??mero inicial de usuarios
    let number_of_users_resp = await User.query().count('* as total')
    let number_of_users = number_of_users_resp[0].$extras.total

    // Creaci??n de nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'DeletUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })
    response.assertStatus(200)

    const new_user = await User.findByOrFail('email', email + '@mail.com')

    //Eliminaci??n del usuario
    const destroy_response = await client.delete(`/users/${new_user.id}`).loginAs(admin)
    destroy_response.assertStatus(200)
    if (destroy_response) {
      //Comparaci??n de n??mero de usuarios
      let new_number_of_users_resp = await User.query().count('* as total')
      let new_number_of_users = new_number_of_users_resp[0].$extras.total
      //assert.equal(number_of_users, new_number_of_users)
    }
  })
})
