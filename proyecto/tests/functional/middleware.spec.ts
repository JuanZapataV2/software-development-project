import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Middleware', () => {
  test('View users as admin', async ({ client, assert }) => {
    // Write your test here
    // Obtener ultimo id

    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'NewAdmin',
      email: email + '@mail.com',
      password: '1234',
      role_id: 1,
    })
    response.assertStatus(200)

    // Verificación de creación
    const admin = await User.findByOrFail('email', email + '@mail.com')
    assert.equal(admin.role_id, 1)

    // Listar los usuarios como admin

    const list_response = await client.get('/users').loginAs(admin)

    list_response.assertStatus(200)
    list_response.assertBodyContains([
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

    // Eliminación para no dejar basura en la base de datos
    admin.delete()
  })

  test('View users as guest', async ({ client, assert }) => {
    // Write your test here
    // Obtener ultimo id

    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'NewGuest',
      email: email + '@mail.com',
      password: '1234',
      role_id: 2,
    })
    response.assertStatus(200)

    // Verificación de creación
    const guest = await User.findByOrFail('email', email + '@mail.com')
    assert.equal(guest.role_id, 2)

    // Listar los usuarios como admin

    const list_response = await client.get('/users').loginAs(guest)

    list_response.assertStatus(401)

    // Eliminación para no dejar basura en la base de datos
    guest.delete()
  })

  test('User edits itself', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)
    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
      profile: {
        phone: '0154889',
        facebook_url: 'facebook.com',
        instagram_url: 'instagram.com',
      },
    })
    response.assertStatus(200)

    // Verificación de creación
    const user = await User.findByOrFail('id', response.response._body.id)
    assert.equal(user.role_id, 3)

    // Editar su propio perfil
    const edit_response = await client
      .put(`/users/${user.id}`)
      .json({
        name: 'NewUserEdited',
        password: '12345',
      })
      .loginAs(admin)

    // Verificación de edición
    const edited_user = await User.findByOrFail('email', email + '@mail.com')
    edit_response.assertStatus(200)
    assert.equal(edited_user.name, 'NewUserEdited')

    // Eliminación para no dejar basura en la base de datos
    user.delete()
  })

  test('User tries to edit another user', async ({ client, assert }) => {
    // Write your test here

    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
      profile: {
        phone: '301425',
        facebook_url: 'facebook.com',
        instagram_url: 'instagram.com',
      },
    })
    response.assertStatus(200)

    // Verificación de creación
    const user = await User.findByOrFail('email', email + '@mail.com')
    assert.equal(user.role_id, 3)

    //Creación otro usuario
    let email2 = (Math.random() * 10).toString(36).replace('.', '')
    const response2 = await client.post('/register').json({
      name: 'OtherUser',
      email: email2 + '@mail.com',
      password: '1234',
      role_id: 3,
    })
    response2.assertStatus(200)

    // Verificación de creación
    const other_user = await User.findByOrFail('email', email2 + '@mail.com')
    assert.equal(other_user.role_id, 3)

    // Intentar editar el perfil del otro
    const edit_response = await client
      .put(`/users/${other_user.id}`)
      .json({
        name: 'OtherUserTest',
        password: '12345',
      })
      .loginAs(user)

    // Verificación de que no se editó
    const edited_user = await User.findByOrFail('email', email2 + '@mail.com')
    edit_response.assertStatus(401)
    assert.equal(edited_user.name, 'OtherUser')

    // Eliminación para no dejar basura en la base de datos
    user.delete()
    other_user.delete()
  })
})
