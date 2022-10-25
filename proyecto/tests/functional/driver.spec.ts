import { test } from '@japa/runner'
import Driver from 'App/Models/Driver'
import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'

test.group('Driver', () => {
    test('List one Driver', async ({ client }) => {
      // Write your test here
      //Obtener al admin para usar su token (log)
      const admin = await User.find(1)
      const response = await client.get('/users/drivers/1').loginAs(admin)
      response.assertStatus(200)
      response.assertBodyContains([
        {
            id: 1,
            user_id: 3,
            created_at: "2022-10-21T16:49:35.000-05:00",
            updated_at: "2022-10-21T16:49:35.000-05:00",
            user: {
                id: 3,
                created_at: "2022-09-29T21:01:54.000-05:00",
                updated_at: "2022-09-29T21:01:54.000-05:00",
                name: "Juan3",
                email: "juan3@mail.com",
                password: "$argon2id$v=19$t=3,m=4096,p=1$O2dvjVCf7yVEOQEZ6Ue8cQ$GaVnb/PE2la0vaBpdx0GOnzHymYhA+x433J80vZ8u9M",
                role_id: 3
            },
            vehicles: []
        }
      ]
      )
    })
  
    test('List all Drivers', async ({ client }) => {
      // Write your test here
      //Getting admin user (for auth and Motorcycle testing)
      const admin = await User.find(1)
      const response = await client.get('/users_driver').loginAs(admin)
  
      response.assertStatus(200)
      response.assertBodyContains([
        {
          id: 1,
          user_id: 3,
          created_at: "2022-10-21T16:49:35.000-05:00",
          updated_at: "2022-10-21T16:49:35.000-05:00",
          user: {
              id: 3,
              created_at: "2022-09-29T21:01:54.000-05:00",
              updated_at: "2022-09-29T21:01:54.000-05:00",
              name: "Juan3",
              email: "juan3@mail.com",
              password: "$argon2id$v=19$t=3,m=4096,p=1$O2dvjVCf7yVEOQEZ6Ue8cQ$GaVnb/PE2la0vaBpdx0GOnzHymYhA+x433J80vZ8u9M",
              role_id: 3
          } 
      }
      ])
    })
  
    test('Create a Driver', async ({ client, assert }) => {
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

  
      //Crear driver
      let last_driver = await Driver.query().orderBy('id', 'desc').first()
      const response = await client.post('/users/drivers').json({user_id: last_user.id }).loginAs(admin)
  
      response.assertStatus(200)
  
      // Verificación de creación
      const new_driver = await Driver.findByOrFail('user_id', last_user.id)
      assert.isAbove(new_driver.id, last_driver.id)
      assert.equal(new_driver.user_id, last_user.id)
  
      // Eliminación para no dejar basura en la base de datos
      last_user.delete()
      new_driver.delete()
    })
  
    test('Delete a Driver', async ({ client, assert }) => {
      // Write your test here
      const admin = await User.find(1)

      //Número inicial de dueños de parqueaderos
      let number_of_drivers_resp = await Driver.query().count('* as total')
      let number_of_driver = number_of_drivers_resp[0].$extras.total
  
      //Crear Usuario
      let email = (Math.random() * 10).toString(36).replace('.', '')
      
      await client.post('/register').json({
        name: 'NewUserTest',
        email: email + '@mail.com',
        password: '1234',
        role_id: 4,
      })
       
      let last_user = await User.findByOrFail('email', email + '@mail.com')
  
      //Crear Driver
      const response = await client.post('/users/drivers').json({user_id: last_user.id }).loginAs(admin)
      response.assertStatus(200)

      const new_driver = await Driver.findByOrFail('user_id', last_user.id)

      //Eliminación del Driver
      const destroy_response = await client.delete(`/users/drivers/${new_driver.id}`).loginAs(admin)
      destroy_response.assertStatus(200)
  
      //Comparación de número de drivers
      let new_number_of_driver_resp = await Driver.query().count('* as total')
      let new_number_of_driver = new_number_of_driver_resp[0].$extras.total
      assert.equal(number_of_driver, new_number_of_driver)

      last_user.delete()

    })
})
