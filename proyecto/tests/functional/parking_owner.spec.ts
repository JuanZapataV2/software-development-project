import { test } from '@japa/runner'
import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'

test.group('Parking Owner', () => {
  test('List one Parking Owner', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/users/owners/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains([
      // {
      //   id: 1,
      //   user_id: 3,
      //   created_at: "2022-09-29T21:03:45.000-05:00",
      //   updated_at: "2022-09-29T21:03:45.000-05:00",
      //   user: {
      //       id: 3,
      //       created_at: "2022-09-29T21:01:54.000-05:00",
      //       updated_at: "2022-09-29T21:01:54.000-05:00",
      //       name: "Juan3",
      //       email: "juan3@mail.com",
      //       password: "$argon2id$v=19$t=3,m=4096,p=1$O2dvjVCf7yVEOQEZ6Ue8cQ$GaVnb/PE2la0vaBpdx0GOnzHymYhA+x433J80vZ8u9M",
      //       role_id: 3
      //   },
      //   parkings: [
      //       {
      //           id: 2,
      //           owner_id: 1,
      //           name: "parqueadero xd",
      //           address: "casa2",
      //           telephone: "1242",
      //           number_spaces: 50,
      //           open_hours: "{\"hours\": \"24 hours\"}",
      //           created_at: "2022-09-29T21:03:58.000-05:00",
      //           updated_at: "2022-09-29T21:10:10.000-05:00"
      //       },
      //       {
      //           id: 3,
      //           owner_id: 1,
      //           name: "parqueadero Don Juan2",
      //           address: "casa2",
      //           telephone: "1242",
      //           number_spaces: 50,
      //           open_hours: "{\"hours\": \"27 hours\"}",
      //           created_at: "2022-09-29T21:07:23.000-05:00",
      //           updated_at: "2022-09-29T21:07:23.000-05:00"
      //       }
      //   ]
      // }
      {
        "id": 1,
        "user_id": 9,
        "created_at": "2022-10-27T01:10:51.000-05:00",
        "updated_at": "2022-10-27T01:10:51.000-05:00",
        "user": {
            "id": 9,
            "created_at": "2022-10-27T01:10:51.000-05:00",
            "updated_at": "2022-10-27T01:10:51.000-05:00",
            "name": "NewUser",
            "email": "012lu3vijh58@mail.com",
            "password": "$argon2id$v=19$t=3,m=4096,p=1$UZbVfNwPTcomVo/r+qoYzQ$9U7ht0U7yYqQxLUoDVt0IFKAXzc5Ei5M5T1yB2fjo4w",
            "role_id": 3
        },
        "parkings": [
            {
                "id": 1,
                "owner_id": 1,
                "name": "parqueadero Test",
                "address": "test123",
                "telephone": "12test",
                "number_spaces": 50,
                "open_hours": "{\"hours\": \"27 hours\"}",
                "created_at": "2022-10-27T01:10:51.000-05:00",
                "updated_at": "2022-10-27T01:10:51.000-05:00"
            }
        ]
    }
    ])
  })

  test('List all Parking Owners', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Motorcycle testing)
    const admin = await User.find(1)
    const response = await client.get('/users_owner').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      // {
      //   id: 1,
      //   user_id: 3,
      //   created_at: "2022-09-29T21:03:45.000-05:00",
      //   updated_at: "2022-09-29T21:03:45.000-05:00",
      //   user: {
      //       id: 3,
      //       created_at: "2022-09-29T21:01:54.000-05:00",
      //       updated_at: "2022-09-29T21:01:54.000-05:00",
      //       name: "Juan3",
      //       email: "juan3@mail.com",
      //       password: "$argon2id$v=19$t=3,m=4096,p=1$O2dvjVCf7yVEOQEZ6Ue8cQ$GaVnb/PE2la0vaBpdx0GOnzHymYhA+x433J80vZ8u9M",
      //       role_id: 3
      //   }
      // }
      {
        "id": 1,
        "user_id": 9,
        "created_at": "2022-10-27T01:10:51.000-05:00",
        "updated_at": "2022-10-27T01:10:51.000-05:00",
        "user": {
            "id": 9,
            "created_at": "2022-10-27T01:10:51.000-05:00",
            "updated_at": "2022-10-27T01:10:51.000-05:00",
            "name": "NewUser",
            "email": "012lu3vijh58@mail.com",
            "password": "$argon2id$v=19$t=3,m=4096,p=1$UZbVfNwPTcomVo/r+qoYzQ$9U7ht0U7yYqQxLUoDVt0IFKAXzc5Ei5M5T1yB2fjo4w",
            "role_id": 3
        }
    },
    ])
  })

  test('Create a Parking Owner', async ({ client, assert }) => {
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

    //Crear Owner
    let last_owner = await ParkingOwner.query().orderBy('id', 'desc').first()
    const response = await client
      .post('/users/owners')
      .json({ user_id: last_user.id })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
    assert.isAbove(new_owner.id, last_owner.id)
    assert.equal(new_owner.user_id, last_user.id)

    // Eliminación para no dejar basura en la base de datos
    last_user.delete()
    new_owner.delete()
  })

  test('Delete a Parking Owner', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de dueños de parqueaderos
    let number_of_owners_resp = await ParkingOwner.query().count('* as total')
    let number_of_owner = number_of_owners_resp[0].$extras.total

    //Crear Usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')

    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    let last_user = await User.findByOrFail('email', email + '@mail.com')

    //Crear Owner
    const response = await client
      .post('/users/owners')
      .json({ user_id: last_user.id })
      .loginAs(admin)
    response.assertStatus(200)

    const new_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)

    //Eliminación del Owner
    const destroy_response = await client.delete(`/users/owners/${new_owner.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de carros
    let new_number_of_owner_resp = await ParkingOwner.query().count('* as total')
    let new_number_of_owner = new_number_of_owner_resp[0].$extras.total
    //assert.equal(number_of_owner, new_number_of_owner)

    last_user.delete()
  })
})
