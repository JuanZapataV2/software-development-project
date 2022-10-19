import { test } from '@japa/runner'
import Car from 'App/Models/Car'
import User from 'App/Models/User'
import Vehicle from 'App/Models/Vehicle'

test.group('Car', () => {
  test('List one Car', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/vehicles/car/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        vehicle_id: 1,
        type: 1,
        created_at: "2022-10-18T11:16:49.000-05:00",
        updated_at: "2022-10-18T11:16:49.000-05:00",
        vehicle: {
            id: 1,
            license_plate: "abc12a",
            created_at: "2022-09-29T21:04:11.000-05:00",
            updated_at: "2022-09-29T21:04:11.000-05:00"
        }
      }
    ]
    )
  })

  test('List all Cars', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Car testing)
    const admin = await User.find(1)
    const response = await client.get('/vehicles_car').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        vehicle_id: 1,
        type: 1,
        created_at: "2022-10-18T11:16:49.000-05:00",
        updated_at: "2022-10-18T11:16:49.000-05:00",
        vehicle: {
            id: 1,
            license_plate: "abc12a",
            created_at: "2022-09-29T21:04:11.000-05:00",
            updated_at: "2022-09-29T21:04:11.000-05:00"
        }
      }
    ])
  })

  test('Create a Car', async ({ client, assert }) => {
    const admin = await User.find(1)

    //Crear Vehiculo
    let license_plate = "zzz999"
    await client.post('/vehicles').json({license_plate: license_plate}).loginAs(admin)
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    //Crear carro
    let last_car = await Car.query().orderBy('id', 'desc').first()
    let last_car_id = last_car.id
    const response = await client.post('/vehicles/car').json({
        type:1,
        vehicle_id: new_vehicle.id
  }).loginAs(admin)

    response.assertStatus(200)

    // Verificación de creación
    const new_car = await Car.findByOrFail('vehicle_id', new_vehicle.id)
    assert.isAbove(new_car.id, last_car_id)
    assert.equal(new_car.vehicle_id, new_vehicle.id)

    // Eliminación para no dejar basura en la base de datos
    new_vehicle.delete()
    new_car.delete()
  })

  test('Delete a Car', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Crear Vehiculo
    let license_plate = "zzz999"
    await client.post('/vehicles').json({license_plate: license_plate}).loginAs(admin)
    const new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    //Número inicial de carros
    let number_of_cars_resp = await Car.query().count('* as total')
    let number_of_cars = number_of_cars_resp[0].$extras.total

    // Creación de nuevo carros
    const response = await client.post('/vehicles/car').json({
      type:1,
      vehicle_id: new_vehicle.id
    }).loginAs(admin)
    response.assertStatus(200)

    const new_car = await Car.findByOrFail('vehicle_id', new_vehicle.id)
    //Eliminación del carros
    const destroy_response = await client.delete(`/vehicles/car/${new_car.id}`).loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de carros
    let new_number_of_cars_resp = await Car.query().count('* as total')
    let new_number_of_cars = new_number_of_cars_resp[0].$extras.total
    assert.equal(number_of_cars, new_number_of_cars)
  })
})
