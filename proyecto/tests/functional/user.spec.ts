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
      {
        id: 1,
        created_at: '2022-10-07T23:24:15.000-05:00',
        updated_at: '2022-10-07T23:24:15.000-05:00',
        name: 'Juan',
        email: 'juan@mail.com',
        password:
          '$argon2id$v=19$t=3,m=4096,p=1$h+WH2cyrZD70o8riRyI0+A$TyqXU75v1SbprRw6npb8I4lNe8LmUbg90fe1xtmMFjA',
        role_id: 1,
        profile: null,
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
      {
        id: 1,
        created_at: '2022-10-07T23:24:15.000-05:00',
        updated_at: '2022-10-07T23:24:15.000-05:00',
        name: 'Juan',
        email: 'juan@mail.com',
        password:
          '$argon2id$v=19$t=3,m=4096,p=1$h+WH2cyrZD70o8riRyI0+A$TyqXU75v1SbprRw6npb8I4lNe8LmUbg90fe1xtmMFjA',
        role_id: 1,
        role: {
          id: 1,
          name: 'admin',
          created_at: '2022-10-07T23:24:14.000-05:00',
          updated_at: '2022-10-07T23:24:14.000-05:00',
        },
        profile: null,
      },
    ])
  })

  test('Create a user', async ({ client, assert }) => {
    // Write your test here
    // Obtener ultimo id
    let last_user = await User.query().orderBy('id', 'desc').first()
    let last_id = last_user.id

    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })
    response.assertStatus(200)

    // Verificación de creación
    const new_user = await User.findByOrFail('email', email + '@mail.com')
    assert.isAbove(new_user.id, last_id)
    assert.equal(new_user.email, email + '@mail.com')

    // Eliminación para no dejar basura en la base de datos
    new_user.delete()
  })

  test('Edit a user', async ({ client, assert }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)

    let previous_user
    let last_user = await User.query().orderBy('id', 'desc').first()
    let last_id = last_user.id

    // Creación del usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'Test edit user',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })

    // Edición del usuario
    const new_user = await User.findBy('email', email + '@mail.com')
    let new_id = new_user.id

    const edit_response = await client
      .put(`/users/${new_user.id}`)
      .json({
        name: 'EditTestEdited',
        password: '12345',
      })
      .loginAs(admin)

    // Verificación de edición
    const edited_user = await User.findByOrFail('email', email + '@mail.com')
    edit_response.assertStatus(200)
    assert.equal(edited_user.name, 'EditTestEdited')
  })

  test('Delete a user', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de usuarios
    let number_of_users_resp = await User.query().count('* as total')
    let number_of_users = number_of_users_resp[0].$extras.total

    // Creación de nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    const response = await client.post('/register').json({
      name: 'DeletUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })
    response.assertStatus(200)

    const new_user = await User.findByOrFail('email', email + '@mail.com')

    //Eliminación del usuario
    const destroy_response = await client.delete(`/users/${new_user.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de usuarios
    let new_number_of_users_resp = await User.query().count('* as total')
    let new_number_of_users = new_number_of_users_resp[0].$extras.total
    assert.equal(number_of_users, new_number_of_users)
  })
})
