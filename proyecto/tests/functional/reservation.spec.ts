import { test } from '@japa/runner'
import Parking from 'App/Models/Parking'

import ParkingSpot from 'App/Models/ParkingSpot'
import ParkingOwner from 'App/Models/ParkingOwner'
import Reservation from 'App/Models/Reservation'
import User from 'App/Models/User'
import Vehicle from 'App/Models/Vehicle'
import Driver from 'App/Models/Driver'

test.group('Reservation', () => {
  test('List a reservation', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/reservation/11').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains({
      id: 11,
      driver_id: 14,
      parking_spot_id: 5,
      vehicle_id: 19,
      price: 1200,
      start_date: '2022-09-09T19:42:51.000Z',
      end_date: '2022-09-09T19:42:51.000Z',
      observations: 'ya casi llego',
      state: 1,
      created_at: '2022-10-27T20:01:12.000-05:00',
      updated_at: '2022-10-27T20:01:12.000-05:00',
    })
  })

  test('List all reservations', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/reservation').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 11,
        driver_id: 14,
        parking_spot_id: 5,
        vehicle_id: 19,
        price: 1200,
        start_date: '2022-09-09T19:42:51.000Z',
        end_date: '2022-09-09T19:42:51.000Z',
        observations: 'ya casi llego',
        state: 1,
        created_at: '2022-10-27T20:01:12.000-05:00',
        updated_at: '2022-10-27T20:01:12.000-05:00',
        parking_spot: {
          id: 5,
          parking_id: 9,
          code: 'c1',
          observations: 'New spot',
          created_at: '2022-10-27T19:13:54.000-05:00',
          updated_at: '2022-10-27T19:13:54.000-05:00',
        },
        driver: {
          id: 14,
          user_id: 16,
          created_at: '2022-10-27T19:54:27.000-05:00',
          updated_at: '2022-10-27T19:54:27.000-05:00',
        },
      },
    ])
  })

  test('Create a reservation', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación usuario nuevo
    let email_driver = (Math.random() * 10).toString(36).replace('.', '')
    const user_response = await client.post('/register').json({
      name: 'NewTestDriver',
      email: email_driver + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    // Verificación de creación
    const new_user = await User.findByOrFail('id', user_response.response._body.id)

    //Creación del conductor
    const driver_response = await client
      .post('/users/drivers')
      .json({ user_id: new_user.id })
      .loginAs(admin)
    driver_response.assertStatus(200)
    const driver = await Driver.findByOrFail('id', driver_response.response._body.id)

    //Creación del vehiculo
    let license_plate = 'dri134'

    const vehicle_response = await client
      .post('/vehicles')
      .json({
        license_plate: license_plate,
      })
      .loginAs(admin)

    vehicle_response.assertStatus(200)

    // Verificación de creación
    const new_vehicle = await Vehicle.findByOrFail('id', vehicle_response.response._body.id)

    //Creación de parqueadero
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
    let parking_owner
    if (last_user) {
      await client.post('/users/owners').json({ user_id: last_user.id }).loginAs(admin)
      parking_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
      if (parking_owner) {
        const response = await client
          .post('/parking')
          .json({
            owner_id: parking_owner.id,
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

          //Creación spot
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

            //Creación de la reservación
            const reservation_response = await client
              .post('/reservation')
              .json({
                driver_id: driver.id,
                parking_spot_id: new_spot.id,
                vehicle_id: new_vehicle.id,
                price: 1200,
                start_date: '2022-09-09T14:42:51.000-05:00',
                end_date: '2022-09-09T14:42:51.000-05:00',
                observations: 'Voy en camino',
                state: 1,
              })
              .loginAs(admin)
            reservation_response.assertStatus(200)
            if (reservation_response) {
              const new_reservation = await Reservation.findByOrFail(
                'id',
                reservation_response.response._body.id
              )
              assert.equal(new_reservation.parking_spot_id, new_spot.id)
              assert.equal(new_reservation.driver_id, driver.id)
              assert.typeOf(new_reservation.start_date, 'date')

              // Eliminación para no dejar basura en la base de datos
              new_reservation.delete()
              new_spot.delete()
              new_parking.delete()
              parking_owner.delete()
              new_vehicle.delete()
              driver.delete()
              new_user.delete()
            }
          }
        }
      }
    }
  })

  test('Edit a reservation', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación usuario nuevo
    let email_driver = (Math.random() * 10).toString(36).replace('.', '')
    const user_response = await client.post('/register').json({
      name: 'NewTestDriver',
      email: email_driver + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    // Verificación de creación
    const new_user = await User.findByOrFail('id', user_response.response._body.id)

    //Creación del conductor
    const driver_response = await client
      .post('/users/drivers')
      .json({ user_id: new_user.id })
      .loginAs(admin)
    driver_response.assertStatus(200)
    const driver = await Driver.findByOrFail('id', driver_response.response._body.id)

    //Creación del vehiculo
    let license_plate = 'dri134'

    const vehicle_response = await client
      .post('/vehicles')
      .json({
        license_plate: license_plate,
      })
      .loginAs(admin)

    vehicle_response.assertStatus(200)

    // Verificación de creación
    const new_vehicle = await Vehicle.findByOrFail('id', vehicle_response.response._body.id)

    //Creación de parqueadero
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
    let parking_owner
    if (last_user) {
      await client.post('/users/owners').json({ user_id: last_user.id }).loginAs(admin)
      parking_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
      if (parking_owner) {
        const response = await client
          .post('/parking')
          .json({
            owner_id: parking_owner.id,
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

          //Creación spot
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

            //Creación de la reservación
            const reservation_response = await client
              .post('/reservation')
              .json({
                driver_id: driver.id,
                parking_spot_id: new_spot.id,
                vehicle_id: new_vehicle.id,
                price: 1200,
                start_date: '2022-09-09T14:42:51.000-05:00',
                end_date: '2022-09-09T14:42:51.000-05:00',
                observations: 'Voy en camino',
                state: 1,
              })
              .loginAs(admin)
            reservation_response.assertStatus(200)
            if (reservation_response) {
              const new_reservation = await Reservation.findByOrFail(
                'id',
                reservation_response.response._body.id
              )
              assert.equal(new_reservation.parking_spot_id, new_spot.id)
              assert.equal(new_reservation.driver_id, driver.id)
              assert.typeOf(new_reservation.start_date, 'date')

              //Edición de la reservación
              const edit_response = await client
                .put(`/reservation/${new_reservation.id}`)
                .json({
                  price: 2000,
                  start_date: '2022-09-09T15:42:51.000-05:00',
                  end_date: '2022-09-09T14:42:51.000-05:00',
                  observations: 'Ya llegue',
                  state: 2,
                })
                .loginAs(admin)
              edit_response.assertStatus(200)

              // Verificación de edición
              const edited_reservation = await Reservation.findByOrFail('id', new_reservation.id)

              assert.isAbove(edited_reservation.price, new_reservation.price)
              assert.equal(edited_reservation.observations, 'Ya llegue')

              // Eliminación para no dejar basura en la base de datos
              new_reservation.delete()
              new_spot.delete()
              new_parking.delete()
              parking_owner.delete()
              new_vehicle.delete()
              driver.delete()
              new_user.delete()
            }
          }
        }
      }
    }
  })

  test('Delete a reservation', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación usuario nuevo
    let email_driver = (Math.random() * 10).toString(36).replace('.', '')
    const user_response = await client.post('/register').json({
      name: 'NewTestDriver',
      email: email_driver + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    // Verificación de creación
    const new_user = await User.findByOrFail('id', user_response.response._body.id)

    //Creación del conductor
    const driver_response = await client
      .post('/users/drivers')
      .json({ user_id: new_user.id })
      .loginAs(admin)
    driver_response.assertStatus(200)
    const driver = await Driver.findByOrFail('id', driver_response.response._body.id)

    //Creación del vehiculo
    let license_plate = 'dri134'

    const vehicle_response = await client
      .post('/vehicles')
      .json({
        license_plate: license_plate,
      })
      .loginAs(admin)

    vehicle_response.assertStatus(200)

    // Verificación de creación
    const new_vehicle = await Vehicle.findByOrFail('id', vehicle_response.response._body.id)

    //Creación de parqueadero
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
    let parking_owner
    if (last_user) {
      await client.post('/users/owners').json({ user_id: last_user.id }).loginAs(admin)
      parking_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)
      if (parking_owner) {
        const response = await client
          .post('/parking')
          .json({
            owner_id: parking_owner.id,
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

          //Creación spot
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

            //Creación de la reservación
            const reservation_response = await client
              .post('/reservation')
              .json({
                driver_id: driver.id,
                parking_spot_id: new_spot.id,
                vehicle_id: new_vehicle.id,
                price: 1200,
                start_date: '2022-09-09T14:42:51.000-05:00',
                end_date: '2022-09-09T14:42:51.000-05:00',
                observations: 'Voy en camino',
                state: 1,
              })
              .loginAs(admin)
            reservation_response.assertStatus(200)
            if (reservation_response) {
              const new_reservation = await Reservation.findByOrFail(
                'id',
                reservation_response.response._body.id
              )

              if (new_reservation) {
                const destroy_response = await client
                  .delete(`/reservation/${new_reservation.id}`)
                  .loginAs(admin)
                destroy_response.assertStatus(200)

                // Eliminación para no dejar basura en la base de datos
                new_reservation.delete()
                new_spot.delete()
                new_parking.delete()
                parking_owner.delete()
                new_vehicle.delete()
                driver.delete()
                new_user.delete()
              }
            }
          }
        }
      }
    }
  })
})
