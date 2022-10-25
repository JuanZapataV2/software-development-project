import { test } from '@japa/runner'
import Parking from 'App/Models/Parking'

import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'


test.group('Parking', () => {
  test('List parking', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/parking/2').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains({
      id: 2,
      owner_id: 1,
      name: "parqueadero xd",
      address: "casa2",
      telephone: "1242",
      number_spaces: 50,
      open_hours: "{\"hours\": \"24 hours\"}",
      created_at: "2022-09-29T21:03:58.000-05:00",
      updated_at: "2022-09-29T21:10:10.000-05:00"
  })
  })

  test('List all parkings', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/parking').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 2,
        owner_id: 1,
        name: "parqueadero xd",
        address: "casa2",
        telephone: "1242",
        number_spaces: 50,
        open_hours: "{\"hours\": \"24 hours\"}",
        created_at: "2022-09-29T21:03:58.000-05:00",
        updated_at: "2022-09-29T21:10:10.000-05:00",
        parking_spots: [
            {
                id: 2,
                parking_id: 2,
                code: "c1",
                observations: "",
                created_at: "2022-10-24T20:03:35.000-05:00",
                updated_at: "2022-10-24T20:03:35.000-05:00"
            }
        ],
        parking_owner: {
            id: 1,
            user_id: 3,
            created_at: "2022-09-29T21:03:45.000-05:00",
            updated_at: "2022-09-29T21:03:45.000-05:00"
        }
    },
    ])
  })

  test('Create a parking', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Crear parking owner
    let last_user = await User.findByOrFail('email', email + '@mail.com')
    await client.post('/users/owners').json({user_id: last_user.id }).loginAs(admin)
    let last_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)

    let last_parking = await Parking.query().orderBy('id', 'desc').first()
      const response = await client.post('/parking').json({
        owner_id: last_user.id,
        name:"parqueadero Test",
        address:"test",
        telephone:"12test",
        number_spaces:50,
        open_hours: {"hours":"27 hours"} 
      }).loginAs(admin)
      response.assertStatus(200)

    // Verificación de creación
    const new_parking = await User.findByOrFail('name', 'parqueadero Test')
    assert.isAbove(new_parking.id, last_parking.id)
    assert.equal(new_parking.owner_id, last_user.id)

    // Eliminación para no dejar basura en la base de datos
    last_user.delete()
    last_owner.delete()
    new_parking.delete()
  })

  test('Delete a parking', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de usuarios
    let number_of_parkings_resp = await Parking.query().count('* as total')
    let number_of_parkings = number_of_parkings_resp[0].$extras.total

    // Creación nuevo usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 3,
    })

    //Crear parking owner
    let last_user = await User.findByOrFail('email', email + '@mail.com')
    await client.post('/users/owners').json({user_id: last_user.id }).loginAs(admin)
    let last_owner = await ParkingOwner.findByOrFail('user_id', last_user.id)

      const response = await client.post('/parking').json({
        owner_id: last_user.id,
        name:"parqueadero Test",
        address:"test",
        telephone:"12test",
        number_spaces:50,
        open_hours: {"hours":"27 hours"} 
      }).loginAs(admin)
      response.assertStatus(200)


    const new_parking = await User.findByOrFail('name', 'parqueadero Test')

    //Eliminación del parking
    const destroy_response = await client.delete(`/parking/${new_parking.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de usuarios
    let new_number_of_parkings_resp = await Parking.query().count('* as total')
    let new_number_of_parkings = new_number_of_parkings_resp[0].$extras.total
    assert.equal(number_of_parkings, new_number_of_parkings)

    // Eliminación para no dejar basura en la base de datos
    last_user.delete()
    last_owner.delete()
  })
})
