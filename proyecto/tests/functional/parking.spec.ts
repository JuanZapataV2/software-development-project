import { test } from '@japa/runner'
import Parking from 'App/Models/Parking'

import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'

test.group('Parking', () => {
  test('List parking', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/parking/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains(
      //     {
      //     id: 2,
      //     owner_id: 1,
      //     name: "parqueadero xd",
      //     address: "casa2",
      //     telephone: "1242",
      //     number_spaces: 50,
      //     open_hours: "{\"hours\": \"24 hours\"}",
      //     created_at: "2022-09-29T21:03:58.000-05:00",
      //     updated_at: "2022-09-29T21:10:10.000-05:00"
      // }
      {
        id: 1,
        owner_id: 1,
        name: 'parqueadero Test',
        address: 'test123',
        telephone: '12test',
        number_spaces: 50,
        open_hours: '{"hours": "27 hours"}',
        created_at: '2022-10-27T19:04:40.000-05:00',
        updated_at: '2022-10-27T19:04:40.000-05:00',
      }
    )
  })

  test('List all parkings', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/parking').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      //   {
      //     id: 2,
      //     owner_id: 1,
      //     name: "parqueadero xd",
      //     address: "casa2",
      //     telephone: "1242",
      //     number_spaces: 50,
      //     open_hours: "{\"hours\": \"24 hours\"}",
      //     created_at: "2022-09-29T21:03:58.000-05:00",
      //     updated_at: "2022-09-29T21:10:10.000-05:00",
      //     parking_spots: [
      //         {
      //             id: 2,
      //             parking_id: 2,
      //             code: "c1",
      //             observations: "",
      //             created_at: "2022-10-24T20:03:35.000-05:00",
      //             updated_at: "2022-10-24T20:03:35.000-05:00"
      //         }
      //     ],
      //     parking_owner: {
      //         id: 1,
      //         user_id: 3,
      //         created_at: "2022-09-29T21:03:45.000-05:00",
      //         updated_at: "2022-09-29T21:03:45.000-05:00"
      //     }
      // },
      {
        id: 1,
        owner_id: 1,
        name: 'parqueadero Test',
        address: 'test123',
        telephone: '12test',
        number_spaces: 50,
        open_hours: '{"hours": "27 hours"}',
        created_at: '2022-10-27T19:04:40.000-05:00',
        updated_at: '2022-10-27T19:04:40.000-05:00',
        parking_spots: [],
        parking_owner: {
          id: 1,
          user_id: 7,
          created_at: '2022-10-27T19:04:40.000-05:00',
          updated_at: '2022-10-27T19:04:40.000-05:00',
        },
      },
    ])
  })

  test('Create a parking', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creaci??n nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Crear parking owner
    let last_user = await User.findByOrFail('email', email + '@mail.com')
    let last_parking = await Parking.query().orderBy('id', 'desc').first()
    let last_owner
    if (last_user) {
      await client.post('/users/owners').json({ user_id: last_user.id }).loginAs(admin)
      last_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
      if (last_owner) {
        const response = await client
          .post('/parking')
          .json({
            owner_id: last_owner.id,
            name: 'parqueadero Test',
            address: 'test123',
            telephone: '12test',
            number_spaces: 50,
            open_hours: { hours: '27 hours' },
          })
          .loginAs(admin)
        response.assertStatus(200)
        if (response) {
          // Verificaci??n de creaci??n
          const new_parking = await Parking.findByOrFail('id', response.response._body.id)
          assert.isAbove(new_parking.id, last_parking.id)
          assert.equal(new_parking.owner_id, last_owner.id)

          // Eliminaci??n para no dejar basura en la base de datos
          last_user.delete()
          last_owner.delete()
          new_parking.delete()
        }
      }
    }
  })

  test('Edit a parking', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creaci??n nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Crear parking owner
    let last_user = await User.findByOrFail('email', email + '@mail.com')
    let last_parking = await Parking.query().orderBy('id', 'desc').first()
    let last_owner
    if (last_user) {
      await client.post('/users/owners').json({ user_id: last_user.id }).loginAs(admin)
      last_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
      if (last_owner) {
        const response = await client
          .post('/parking')
          .json({
            owner_id: last_owner.id,
            name: 'parqueadero Test',
            address: 'test123',
            telephone: '12test',
            number_spaces: 50,
            open_hours: { hours: '27 hours' },
          })
          .loginAs(admin)
        response.assertStatus(200)
        if (response) {
          // Verificaci??n de creaci??n
          const new_parking = await Parking.findByOrFail('id', response.response._body.id)
          assert.isAbove(new_parking.id, last_parking.id)
          assert.equal(new_parking.owner_id, last_owner.id)

          //Edici??n del parqueadero
          const edit_response = await client
            .put(`/parking/${new_parking.id}`)
            .json({
              name: 'parqueadero Test edited',
              address: 'Edited address',
            })
            .loginAs(admin)
          edit_response.assertStatus(200)
          if (edit_response) {
            // Verificaci??n de creaci??n
            const edited_parking = await Parking.findByOrFail('id', new_parking.id)
            assert.equal(new_parking.id, edited_parking.id)
            assert.equal(edited_parking.address, 'Edited address')

            // Eliminaci??n para no dejar basura en la base de datos
            last_user.delete()
            last_owner.delete()
            new_parking.delete()
          }
        }
      }
    }
  })

  test('Delete a parking', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //N??mero inicial de usuarios
    let number_of_parkings_resp = await Parking.query().count('* as total')
    let number_of_parkings = number_of_parkings_resp[0].$extras.total

    // Creaci??n nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Crear parking owner
    let last_user = await User.findByOrFail('email', email + '@mail.com')
    if (last_user) {
      await client.post('/users/owners').json({ user_id: last_user.id }).loginAs(admin)
      let last_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
      const response = await client
        .post('/parking')
        .json({
          owner_id: last_owner.id,
          name: 'parqueadero Test',
          address: 'test',
          telephone: '12test',
          number_spaces: 50,
          open_hours: { hours: '27 hours' },
        })
        .loginAs(admin)
      response.assertStatus(200)
      const new_parking = await Parking.findByOrFail('id', response.response._body.id)

      if (new_parking) {
        //Eliminaci??n del parking
        const destroy_response = await client.delete(`/parking/${new_parking.id}`).loginAs(admin)
        destroy_response.assertStatus(200)

        //Comparaci??n de n??mero de parqueaderos
        if (destroy_response) {
          let new_number_of_parkings_resp = await Parking.query().count('* as total')
          let new_number_of_parkings = new_number_of_parkings_resp[0].$extras.total
          //assert.equal(number_of_parkings, new_number_of_parkings)

          // Eliminaci??n para no dejar basura en la base de datos
          last_user.delete()
          last_owner.delete()
        }
      }
    }
  })
})
