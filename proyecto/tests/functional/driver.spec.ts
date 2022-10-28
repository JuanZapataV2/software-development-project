import { test } from '@japa/runner'
import Driver from 'App/Models/Driver'
import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'

test.group('Driver', () => {
  test('List one Driver', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/users/drivers/14').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains([
      // {
      //     id: 1,
      //     user_id: 3,
      //     created_at: "2022-10-21T16:49:35.000-05:00",
      //     updated_at: "2022-10-21T16:49:35.000-05:00",
      //     user: {
      //         id: 3,
      //         created_at: "2022-09-29T21:01:54.000-05:00",
      //         updated_at: "2022-09-29T21:01:54.000-05:00",
      //         name: "Juan3",
      //         email: "juan3@mail.com",
      //         password: "$argon2id$v=19$t=3,m=4096,p=1$O2dvjVCf7yVEOQEZ6Ue8cQ$GaVnb/PE2la0vaBpdx0GOnzHymYhA+x433J80vZ8u9M",
      //         role_id: 3
      //     },
      //     vehicles: []
      // }
      {
        id: 14,
        user_id: 16,
        created_at: '2022-10-27T19:54:27.000-05:00',
        updated_at: '2022-10-27T19:54:27.000-05:00',
        user: {
          id: 16,
          created_at: '2022-10-27T19:04:41.000-05:00',
          updated_at: '2022-10-27T19:04:41.000-05:00',
          name: 'NewOwner',
          email: '2z5pbkuh8v5@mail.com',
          password:
            '$argon2id$v=19$t=3,m=4096,p=1$ErRYZeyQG1sWmn235RbR6w$Yhhe4mzhf9M6J5n91EVDj32GFVG309BZa8E9EsCAlZo',
          role_id: 3,
        },
        vehicles: [],
      },
    ])
  })

  test('List all Drivers', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and Motorcycle testing)
    const admin = await User.find(1)
    const response = await client.get('/users_driver').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      //   {
      //     id: 1,
      //     user_id: 3,
      //     created_at: "2022-10-21T16:49:35.000-05:00",
      //     updated_at: "2022-10-21T16:49:35.000-05:00",
      //     user: {
      //         id: 3,
      //         created_at: "2022-09-29T21:01:54.000-05:00",
      //         updated_at: "2022-09-29T21:01:54.000-05:00",
      //         name: "Juan3",
      //         email: "juan3@mail.com",
      //         password: "$argon2id$v=19$t=3,m=4096,p=1$O2dvjVCf7yVEOQEZ6Ue8cQ$GaVnb/PE2la0vaBpdx0GOnzHymYhA+x433J80vZ8u9M",
      //         role_id: 3
      //     }
      // }
      {
        id: 14,
        user_id: 16,
        created_at: '2022-10-27T19:54:27.000-05:00',
        updated_at: '2022-10-27T19:54:27.000-05:00',
        user: {
          id: 16,
          created_at: '2022-10-27T19:04:41.000-05:00',
          updated_at: '2022-10-27T19:04:41.000-05:00',
          name: 'NewOwner',
          email: '2z5pbkuh8v5@mail.com',
          password:
            '$argon2id$v=19$t=3,m=4096,p=1$ErRYZeyQG1sWmn235RbR6w$Yhhe4mzhf9M6J5n91EVDj32GFVG309BZa8E9EsCAlZo',
          role_id: 3,
        },
      },
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

    if (last_user.id) {
      //Crear driver
      let last_driver = await Driver.query().orderBy('id', 'desc').first()
      const response = await client
        .post('/users/drivers')
        .json({ user_id: last_user.id })
        .loginAs(admin)

      response.assertStatus(200)

      // Verificación de creación
      const new_driver = await Driver.findByOrFail('user_id', last_user.id)
      if (new_driver) {
        assert.isAbove(new_driver.id, last_driver.id)
        assert.equal(new_driver.user_id, last_user.id)
      }
    }
  })

  test('Edit a Driver', async ({ client, assert }) => {
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

    if (last_user.id) {
      //Crear driver
      let last_driver = await Driver.query().orderBy('id', 'desc').first()
      const response = await client
        .post('/users/drivers')
        .json({ user_id: last_user.id })
        .loginAs(admin)

      response.assertStatus(200)

      // Verificación de creación
      const new_driver = await Driver.findByOrFail('user_id', last_user.id)
      if (new_driver) {
        assert.isAbove(new_driver.id, last_driver.id)
        assert.equal(new_driver.user_id, last_user.id)

        const edit_response = await client
          .put(`/users/drivers/${new_driver.id}`)
          .json({ user_id: last_user.id })
          .loginAs(admin)

        edit_response.assertStatus(200)

        // Verificación de creación
        const edit_driver = await Driver.findByOrFail('user_id', last_user.id)
        if (edit_driver) {
          assert.equal(edit_driver.id, new_driver.id)
        }
      }
    }
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
    const response = await client
      .post('/users/drivers')
      .json({ user_id: last_user.id })
      .loginAs(admin)
    response.assertStatus(200)

    const new_driver = await Driver.findByOrFail('id', response.response._body.id)

    //Eliminación del Driver
    if (new_driver) {
      const destroy_response = await client.delete(`/users/drivers/${new_driver.id}`).loginAs(admin)
      destroy_response.assertStatus(200)

      if (destroy_response) {
        let new_number_of_driver_resp = await Driver.query().count('* as total')
        let new_number_of_driver = new_number_of_driver_resp[0].$extras.total
        //assert.equal(number_of_driver, new_number_of_driver)

        //last_user.delete()
      }
    }
    //Comparación de número de drivers
  })
})
