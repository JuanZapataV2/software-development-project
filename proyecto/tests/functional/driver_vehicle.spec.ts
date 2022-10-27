import { test } from '@japa/runner'
import Driver from 'App/Models/Driver'
import DriverVehicle from 'App/Models/DriverVehicle'
import User from 'App/Models/User'
import Vehicle from 'App/Models/Vehicle'

test.group('Driver vehicle', () => {
  ;+test('List one Driver-vehicle', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/driver-vehicles/4').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains(
      //   {
      //     id: 1,
      //     vehicle_id: 1,
      //     driver_id: 1,
      //     use_date: "2022-08-09T05:00:00.000Z",
      //     created_at: "2022-10-21T17:14:10.000-05:00",
      //     updated_at: "2022-10-21T17:14:10.000-05:00"
      // }
      {
        id: 4,
        vehicle_id: null,
        driver_id: null,
        use_date: '2022-08-09T05:00:00.000Z',
        created_at: '2022-10-27T01:10:50.000-05:00',
        updated_at: '2022-10-27T01:10:50.000-05:00',
      }
    )
  })

  test('List all Driver-vehicle', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Motorcycle testing)
    const admin = await User.find(1)
    const response = await client.get('/driver-vehicles').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      //   {
      //     id: 1,
      //     vehicle_id: 1,
      //     driver_id: 1,
      //     use_date: "2022-08-09T05:00:00.000Z",
      //     created_at: "2022-10-21T17:14:10.000-05:00",
      //     updated_at: "2022-10-21T17:14:10.000-05:00"
      // }
      {
        id: 4,
        vehicle_id: null,
        driver_id: null,
        use_date: '2022-08-09T05:00:00.000Z',
        created_at: '2022-10-27T01:10:50.000-05:00',
        updated_at: '2022-10-27T01:10:50.000-05:00',
      },
    ])
  })

  test('Create a Driver-vehicle', async ({ client, assert }) => {
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

    //Crear Driver
    await client.post('/users/drivers').json({ user_id: last_user.id }).loginAs(admin)
    let new_driver = await Driver.findByOrFail('user_id', last_user.id)

    // Creación nuevo vehiculo
    let license_plate = 'tes999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    let new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    const last_driverVehicle = await DriverVehicle.query().orderBy('id', 'desc').first()

    const response = await client
      .post('/driver-vehicles')
      .json({
        vehicle_id: new_vehicle.id,
        driver_id: new_driver.id,
        use_date: '08-09-2022 00:00:00',
      })
      .loginAs(admin)
    response.assertStatus(200)

    // Verificación de creación
    const new_driverVehicle = await DriverVehicle.findByOrFail('driver_id', new_driver.id)
    assert.isAbove(new_driverVehicle.id, last_driverVehicle.id)
    assert.equal(new_driverVehicle.driver_id, new_driver.id)

    // Eliminación para no dejar basura en la base de datos
    last_user.delete()
    new_driver.delete()
    new_vehicle.delete()
    new_driverVehicle.delete()
  })

  test('Edit a Driver-vehicle', async ({ client, assert }) => {
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

    //Crear Driver
    await client.post('/users/drivers').json({ user_id: last_user.id }).loginAs(admin)
    let new_driver = await Driver.findByOrFail('user_id', last_user.id)

    // Creación nuevo vehiculo
    let license_plate = 'tes999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    let new_vehicle = await Vehicle.findByOrFail('license_plate', license_plate)

    const last_driverVehicle = await DriverVehicle.query().orderBy('id', 'desc').first()

    const response = await client
      .post('/driver-vehicles')
      .json({
        vehicle_id: new_vehicle.id,
        driver_id: new_driver.id,
        use_date: '08-09-2022 00:00:00',
      })
      .loginAs(admin)
    response.assertStatus(200)

    // Verificación de creación
    const new_driverVehicle = await DriverVehicle.findByOrFail('driver_id', new_driver.id)
    assert.isAbove(new_driverVehicle.id, last_driverVehicle.id)
    assert.equal(new_driverVehicle.driver_id, new_driver.id)

    // Edición driver-vehicle
    const edit_response = await client
      .put(`/driver-vehicles/${new_driverVehicle.id}`)
      .json({
        use_date: '09-09-2022 00:00:00',
      })
      .loginAs(admin)
    edit_response.assertStatus(200)

    // Verificación de creación
    const edited_driverVehicle = await DriverVehicle.findByOrFail('id', new_driverVehicle.id)
    assert.equal(new_driverVehicle.id, edited_driverVehicle.id)

    // Eliminación para no dejar basura en la base de datos
    last_user.delete()
    new_driver.delete()
    new_vehicle.delete()
    new_driverVehicle.delete()
  })

  test('Delete a Driver-vehicle', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    //Número inicial de drivers-vehicles
    let number_of_drivers_resp = await DriverVehicle.query().count('* as total')
    let number_of_driver = number_of_drivers_resp[0].$extras.total

    //Crear Usuario
    let email = (Math.random() * 10).toString(36).replace('.', '')

    await client.post('/register').json({
      name: 'NewUser',
      email: email + '@mail.com',
      password: '1234',
      role_id: 4,
    })

    let last_user = await User.findByOrFail('email', email + '@mail.com')

    //Crear Driver
    let new_driver = await Driver.query().orderBy('id', 'desc').first()
    await client.post('/users/drivers').json({ user_id: last_user.id }).loginAs(admin)

    // Creación nuevo vehiculo
    let license_plate = 'tes999'
    await client.post('/vehicles').json({ license_plate: license_plate }).loginAs(admin)
    let new_vehicle = await Vehicle.query().orderBy('id', 'desc').first()

    const response = await client
      .post('/driver-vehicles')
      .json({
        vehicle_id: new_vehicle.id,
        driver_id: new_driver.id,
        use_date: '08-09-2022 00:00:00',
      })
      .loginAs(admin)
    response.assertStatus(200)

    const new_driverVehicle = await DriverVehicle.findByOrFail('driver_id', new_driver.id)

    //Eliminación del driver V
    const destroy_response = await client
      .delete(`/driver-vehicles/${new_driverVehicle.id}`)
      .loginAs(admin)
    destroy_response.assertStatus(200)

    //Comparación de número de driver V
    let new_number_of_driver_resp = await DriverVehicle.query().count('* as total')
    let new_number_of_driver = new_number_of_driver_resp[0].$extras.total
    //assert.equal(number_of_driver, new_number_of_driver)

    last_user.delete()
    new_vehicle.delete()
    new_driver.delete()
  })
})
