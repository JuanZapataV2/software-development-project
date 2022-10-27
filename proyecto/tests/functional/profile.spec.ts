import { test } from '@japa/runner'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

test.group('Profile', () => {
  test('List one Profile', async ({ client }) => {
    // Write your test heretest('List one Car', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/profiles/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains(
      //  {
      //     id: 1,
      //     user_id: 1,
      //     phone: "3002525",
      //     facebook_url: "facebook.com",
      //     instagram_url: "instagram/yo.com",
      //     created_at: "2022-10-24T18:53:34.000-05:00",
      //     updated_at: "2022-10-24T18:54:19.000-05:00"
      //   }
      {
        id: 1,
        user_id: 1,
        phone: '3002525',
        facebook_url: 'facebook.com',
        instagram_url: 'instagram.com',
        created_at: '2022-10-27T00:57:47.000-05:00',
        updated_at: '2022-10-27T00:57:47.000-05:00',
      }
    )
  })

  test('List all Profiles', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Car testing)
    const admin = await User.find(1)
    const response = await client.get('/profiles').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      // {
      //   id: 1,
      //   user_id: 1,
      //   phone: "3002525",
      //   facebook_url: "facebook.com",
      //   instagram_url: "instagram/yo.com",
      //   created_at: "2022-10-24T18:53:34.000-05:00",
      //   updated_at: "2022-10-24T18:54:19.000-05:00"
      // }
      {
        id: 1,
        user_id: 1,
        phone: '3002525',
        facebook_url: 'facebook.com',
        instagram_url: 'instagram.com',
        created_at: '2022-10-27T00:57:47.000-05:00',
        updated_at: '2022-10-27T00:57:47.000-05:00',
      },
    ])
  })

  test('Create a Profile', async ({ client, assert }) => {
    const admin = await User.find(1)

    //Crear Usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')

    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })

    let last_user = await User.findByOrFail('email', email + '@mail.com')

    //Crear perfil
    let last_profile = await Profile.query().orderBy('id', 'desc').first()
    let last_profile_id = last_profile.id
    const response = await client
      .post('/profiles')
      .json({
        user_id: last_user.id,
        phone: '00000',
        facebook_url: email,
        instagram_url: email,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_profile = await Profile.findByOrFail('user_id', last_user.id)
    assert.isAbove(new_profile.id, last_profile_id)
    assert.equal(new_profile.user_id, last_user.id)

    // Eliminación para no dejar basura en la base de datos
    last_user.delete()
    new_profile.delete()
  })

  test('Delete a profile', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Crear Usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')

    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })

    let last_user = await User.findByOrFail('email', email + '@mail.com')

    //Número inicial de perfiles
    let number_of_profiles_resp = await Profile.query().count('* as total')
    let number_of_profiles = number_of_profiles_resp[0].$extras.total

    //Crear perfil
    let last_profile = await Profile.query().orderBy('id', 'desc').first()
    const response = await client
      .post('/profiles')
      .json({
        user_id: last_user.id,
        phone: '00000',
        facebook_url: email,
        instagram_url: email,
      })
      .loginAs(admin)
    response.assertStatus(200)

    const new_profile = await Profile.findByOrFail('user_id', last_user.id)
    //Eliminación del perfil
    const destroy_response = await client.delete(`/profiles/${new_profile.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de perfiles
    let new_number_of_profiles_resp = await Profile.query().count('* as total')
    let new_number_of_profiles = new_number_of_profiles_resp[0].$extras.total
    assert.equal(number_of_profiles, new_number_of_profiles)

    last_user.delete()
  })
})
