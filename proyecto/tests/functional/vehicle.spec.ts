import { test } from '@japa/runner'
import { assert } from '@japa/assert'
import User from 'App/Models/User'
import Vehicle from 'App/Models/vehicle'


test.group('Vehicle', () => {
  test('List one Vehicle', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/vehicles/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        license_plate: "abc12a",
        created_at: "2022-09-29T21:04:11.000-05:00",
        updated_at: "2022-09-29T21:04:11.000-05:00",
        drivers: []
    }
    ]
    )
  })

  test('List all Vehicles', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and vehicle testing)
    const admin = await User.find(1)
    const response = await client.get('/vehicles').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        license_plate: "abc12a",
        created_at: "2022-09-29T21:04:11.000-05:00",
        updated_at: "2022-09-29T21:04:11.000-05:00",
        drivers: []
    }
    ])
  })

  test('Create a Vehicle', async ({ client, assert }) => {
    const admin = await User.find(1)
    // Obtener ultimo id
    let last_vehicle = await Vehicle.query().orderBy('id', 'desc').first()
    let last_id = last_vehicle.id
    let license_plate = "zzz999"

    // Creación nuevo vehiculo
    const response = await client.post('/vehicles').json({
      license_plate: license_plate
  }).loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)
    assert.isAbove(new_vehicle.id, last_id)
    assert.equal(new_vehicle.license_plate, license_plate)

    // Eliminación para no dejar basura en la base de datos
    new_vehicle.delete()
  })

  test('Delete a vehicle', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de permisos
    let number_of_vehicles_resp = await Vehicle.query().count('* as total')
    let number_of_vehicles = number_of_vehicles_resp[0].$extras.total

    // Creación de nuevo vehiculo
    let license_plate = "zzz999"
    const response = await client.post('/vehicles').json({
      license_plate: license_plate
    }).loginAs(admin)
    response.assertStatus(200)

    const new_vehicle = await Vehicle.findByOrFail('name', license_plate)
    //Eliminación del vehiculo
    const destroy_response = await client.delete(`/vehicles/${new_vehicle.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de permisos
    let new_number_of_vehicles_resp = await Vehicle.query().count('* as total')
    let new_number_of_vehicles = new_number_of_vehicles_resp[0].$extras.total
    assert.equal(number_of_vehicles, new_number_of_vehicles)
  })
})
