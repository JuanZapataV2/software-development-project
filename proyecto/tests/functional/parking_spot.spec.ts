import { test } from '@japa/runner'
import Parking from 'App/Models/Parking'

import ParkingSpot from 'App/Models/ParkingSpot'
import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'
test.group('Parking spot', () => {
  test('List a parking spot', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/parkingSpot/2').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains({
      id: 2,
      parking_id: 1,
      code: 'c1',
      observations: 'New spot',
      created_at: '2022-10-27T14:48:22.000-05:00',
      updated_at: '2022-10-27T14:48:22.000-05:00',
    })
  })

  test('List all parking spots', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/parkingSpot').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 2,
        parking_id: 1,
        code: 'c1',
        observations: 'New spot',
        created_at: '2022-10-27T14:48:22.000-05:00',
        updated_at: '2022-10-27T14:48:22.000-05:00',
      },
    ])
  })

  test('Create a parking spot', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación dueño parqueadero
    let email_owner = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewOwner',
      email: email_owner + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Creación de parqueadero
    let last_user = await User.findByOrFail('email', email_owner + '@mail.com')
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
          // Verificación de creación
          const new_parking = await Parking.findByOrFail('id', response.response._body.id)
          assert.isAbove(new_parking.id, last_parking.id)
          assert.equal(new_parking.owner_id, last_owner.id)

          //Creación rating
          const spot_response = await client
            .post('/parkingSpot')
            .json({
              parking_id: new_parking.id,
              code: 'c1',
              observations: 'New spot',
            })
            .loginAs(admin)
          spot_response.assertStatus(200)
          if (spot_response) {
            // Verificación de creación
            const new_spot = await ParkingSpot.findByOrFail('id', spot_response.response._body.id)
            assert.equal(new_spot.code, 'c1')

            // Eliminación para no dejar basura en la base de datos
            new_parking.delete()
            new_spot.delete()
            last_user.delete()
            last_owner.delete()
          }
        }
      }
    }
  })

  test('Edit a parking spot', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación dueño parqueadero
    let email_owner = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewOwner',
      email: email_owner + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Creación de parqueadero
    let last_user = await User.findByOrFail('email', email_owner + '@mail.com')
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
          // Verificación de creación
          const new_parking = await Parking.findByOrFail('id', response.response._body.id)
          assert.isAbove(new_parking.id, last_parking.id)
          assert.equal(new_parking.owner_id, last_owner.id)

          //Creación rating
          const spot_response = await client
            .post('/parkingSpot')
            .json({
              parking_id: new_parking.id,
              code: 'c1',
              observations: 'New spot',
            })
            .loginAs(admin)
          spot_response.assertStatus(200)
          if (spot_response) {
            // Verificación de creación
            const new_spot = await ParkingSpot.findByOrFail('id', spot_response.response._body.id)
            assert.equal(new_spot.code, 'c1')

            //Edición del parking spot
            const edit_response = await client
              .put(`/parkingSpot/${new_spot.id}`)
              .json({
                code: 'b2',
                observations: 'New spot edited',
              })
              .loginAs(admin)
            edit_response.assertStatus(200)
            if (edit_response) {
              // Verificación de edición
              const edited_spot = await ParkingSpot.findByOrFail('id', new_spot.id)

              assert.equal(new_spot.id, edited_spot.id)
              assert.equal(edited_spot.code, 'b2')
              assert.notEqual(edited_spot.observations, new_spot.observations)

              // Eliminación para no dejar basura en la base de datos
              new_parking.delete()
              new_spot.delete()
              last_user.delete()
              last_owner.delete()
            }
          }
        }
      }
    }
  })

  test('Delete a parking rating', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación dueño parqueadero
    let email_owner = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewOwner',
      email: email_owner + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Creación de parqueadero
    let last_user = await User.findByOrFail('email', email_owner + '@mail.com')
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
          // Verificación de creación
          const new_parking = await Parking.findByOrFail('id', response.response._body.id)
          assert.isAbove(new_parking.id, last_parking.id)
          assert.equal(new_parking.owner_id, last_owner.id)

          //Creación rating
          const spot_response = await client
            .post('/parkingSpot')
            .json({
              parking_id: new_parking.id,
              code: 'c1',
              observations: 'New spot',
            })
            .loginAs(admin)
          spot_response.assertStatus(200)
          if (spot_response) {
            // Verificación de creación
            const new_spot = await ParkingSpot.findByOrFail('id', spot_response.response._body.id)
            assert.equal(new_spot.code, 'c1')
            const destroy_response = await client
              .delete(`/parkingSpot/${new_spot.id}`)
              .loginAs(admin)
            destroy_response.assertStatus(200)
            // Eliminación para no dejar basura en la base de datos
            new_parking.delete()
            new_spot.delete()
            last_user.delete()
            last_owner.delete()
          }
        }
      }
    }
  })
})
