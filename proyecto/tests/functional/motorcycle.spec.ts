import { test } from '@japa/runner'
import Motorcycle from 'App/Models/Motorcycle'
import User from 'App/Models/User'
import Vehicle from 'App/Models/Vehicle'

test.group('Motorcycle', () => {
  test('List one Motorcycle', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/vehicles/motorcycle/2').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains([
      //   {
      //     id: 3,
      //     vehicle_id: 2,
      //     helmet: "bb222",
      //     created_at: "2022-10-18T11:20:50.000-05:00",
      //     updated_at: "2022-10-18T11:20:50.000-05:00",
      //     vehicle: {
      //         id: 2,
      //         license_plate: "bb222",
      //         created_at: "2022-10-18T11:20:36.000-05:00",
      //         updated_at: "2022-10-18T11:20:36.000-05:00"
      //     }
      // }
      {
        id: 2,
        vehicle_id: 19,
        helmet: 'bb222',
        created_at: '2022-10-27T19:15:31.000-05:00',
        updated_at: '2022-10-27T19:15:31.000-05:00',
        vehicle: {
          id: 19,
          license_plate: 'bb222',
          created_at: '2022-10-27T19:12:37.000-05:00',
          updated_at: '2022-10-27T19:12:37.000-05:00',
        },
      },
    ])
  })

  test('List all Motorcycles', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Motorcycle testing)
    const admin = await User.find(1)
    const response = await client.get('/vehicles_motorcycle').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      //   {
      //     id: 3,
      //     vehicle_id: 2,
      //     helmet: "bb222",
      //     created_at: "2022-10-18T11:20:50.000-05:00",
      //     updated_at: "2022-10-18T11:20:50.000-05:00",
      //     vehicle: {
      //         id: 2,
      //         license_plate: "bb222",
      //         created_at: "2022-10-18T11:20:36.000-05:00",
      //         updated_at: "2022-10-18T11:20:36.000-05:00"
      //     }
      // }
      {
        id: 2,
        vehicle_id: 19,
        helmet: 'bb222',
        created_at: '2022-10-27T19:15:31.000-05:00',
        updated_at: '2022-10-27T19:15:31.000-05:00',
        vehicle: {
          id: 19,
          license_plate: 'bb222',
          created_at: '2022-10-27T19:12:37.000-05:00',
          updated_at: '2022-10-27T19:12:37.000-05:00',
        },
      },
    ])
  })

  test('Create a Motorcycle', async ({ client, assert }) => {
    const admin = await User.find(1)

    //Crear Vehiculo
    let license_plate = 'zzz999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    //Crear carro
    let last_moto = await Motorcycle.query().orderBy('id', 'desc').first()
    let last_moto_id = last_moto.id
    let helmet = 'testing'
    const response = await client
      .post('/vehicles/motorcycle')
      .json({
        helmet: helmet,
        vehicle_id: new_vehicle.id,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificaci??n de creaci??n
    const new_moto = await Motorcycle.findByOrFail('vehicle_id', new_vehicle.id)
    assert.isAbove(new_moto.id, last_moto_id)
    assert.equal(new_moto.vehicle_id, new_vehicle.id)

    // Eliminaci??n para no dejar basura en la base de datos
    new_vehicle.delete()
    new_moto.delete()
  })

  test('Edit a Motorcycle', async ({ client, assert }) => {
    const admin = await User.find(1)

    //Crear Vehiculo
    let license_plate = 'zzz999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    //Crear moto
    let last_moto = await Motorcycle.query().orderBy('id', 'desc').first()
    let last_moto_id = last_moto.id
    let helmet = 'testing'
    const response = await client
      .post('/vehicles/motorcycle')
      .json({
        helmet: helmet,
        vehicle_id: new_vehicle.id,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificaci??n de creaci??n
    const new_moto = await Motorcycle.findByOrFail('vehicle_id', new_vehicle.id)
    assert.isAbove(new_moto.id, last_moto_id)
    assert.equal(new_moto.vehicle_id, new_vehicle.id)

    //Edici??n de moto
    const edit_response = await client
      .put(`/vehicles/motorcycle/${new_moto.id}`)
      .json({
        helmet: 'new874',
      })
      .loginAs(admin)

    edit_response.assertStatus(200)

    // Verificaci??n de edici??n
    const edited_moto = await Motorcycle.findByOrFail('id', new_moto.id)
    assert.equal(new_moto.id, edited_moto.id)
    assert.equal(edited_moto.helmet, 'new874')

    // Eliminaci??n para no dejar basura en la base de datos
    new_vehicle.delete()
    new_moto.delete()
  })

  test('Edit a Motorcycle', async ({ client, assert }) => {
    const admin = await User.find(1)

    //Crear Vehiculo
    let license_plate = 'zzz999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    //Crear carro
    let last_moto = await Motorcycle.query().orderBy('id', 'desc').first()
    let last_moto_id = last_moto.id
    let helmet = 'testing'
    const response = await client
      .post('/vehicles/motorcycle')
      .json({
        helmet: helmet,
        vehicle_id: new_vehicle.id,
      })
      .loginAs(admin)

    response.assertStatus(200)

    // Verificaci??n de creaci??n
    const new_moto = await Motorcycle.findByOrFail('vehicle_id', new_vehicle.id)
    assert.isAbove(new_moto.id, last_moto_id)
    assert.equal(new_moto.vehicle_id, new_vehicle.id)

    // Eliminaci??n para no dejar basura en la base de datos
    new_vehicle.delete()
    new_moto.delete()
  })

  test('Delete a Motorcycle', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Crear Vehiculo
    let license_plate = 'zzz999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    //N??mero inicial de carros
    let number_of_motos_resp = await Motorcycle.query().count('* as total')
    let number_of_motos = number_of_motos_resp[0].$extras.total

    // Creaci??n de nuevo carros
    let helmet = 'testing'
    const response = await client
      .post('vehicles/motorcycle')
      .json({
        helmet: helmet,
        vehicle_id: new_vehicle.id,
      })
      .loginAs(admin)
    response.assertStatus(200)

    const new_moto = await Motorcycle.findByOrFail('vehicle_id', new_vehicle.id)
    //Eliminaci??n del carros
    const destroy_response = await client
      .delete(`/vehicles/motorcycle/${new_moto.id}`)
      .loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparaci??n de n??mero de carros
    let new_number_of_motos_resp = await Motorcycle.query().count('* as total')
    let new_number_of_motos = new_number_of_motos_resp[0].$extras.total
    assert.equal(number_of_motos, new_number_of_motos)

    new_vehicle.delete()
  })
})
