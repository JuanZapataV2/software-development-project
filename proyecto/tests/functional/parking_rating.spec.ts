import { test } from '@japa/runner'

import Parking from 'App/Models/Parking'

import ParkingRating from 'App/Models/ParkingRating'
import ParkingOwner from 'App/Models/ParkingOwner'
import User from 'App/Models/User'

test.group('Parking rating', () => {
  test('List a parking rating', async ({ client }) => {
    // Write your test here
    //Obtener al admin para usar su token (log)
    const admin = await User.find(1)
    const response = await client.get('/parkingRating/1').loginAs(admin)
    response.assertStatus(200)
    response.assertBodyContains({
      id: 1,
      comment: 'muy organizado',
      rating: 5,
      user_id: 2,
      parking_id: 1,
      created_at: '2022-10-27T13:59:46.000-05:00',
      updated_at: '2022-10-27T13:59:46.000-05:00',
    })
  })

  test('List all parking ratings', async ({ client }) => {
    // Write your test here
    //Getting admin user (for auth and permission testing)
    const admin = await User.find(1)
    const response = await client.get('/parkingRating').loginAs(admin)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: 1,
        comment: 'muy organizado',
        rating: 5,
        user_id: 2,
        parking_id: 1,
        created_at: '2022-10-27T13:59:46.000-05:00',
        updated_at: '2022-10-27T13:59:46.000-05:00',
        user: {
          id: 2,
          created_at: '2022-10-27T00:56:18.000-05:00',
          updated_at: '2022-10-27T00:56:18.000-05:00',
          name: 'Juan2',
          email: 'juan2@mail.com',
          password:
            '$argon2id$v=19$t=3,m=4096,p=1$Ap9xynvwbUwESAn4IiyuIw$259aOm1kK4cUqf40OcIs5uRpFx0sefKTQcZIl6kgqtA',
          role_id: 2,
        },
        parking: {
          id: 1,
          owner_id: 1,
          name: 'parqueadero Test',
          address: 'test123',
          telephone: '12test',
          number_spaces: 50,
          open_hours: '{"hours": "27 hours"}',
          created_at: '2022-10-27T01:10:51.000-05:00',
          updated_at: '2022-10-27T01:10:51.000-05:00',
        },
      },
    ])
  })

  test('Create a parking rating', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación nuevo usuario
    let email_user = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email_user + '@mail.com',
      password: '1234',
      role_id: 2,
    })

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
    let rating_user = await User.findByOrFail('email', email_user + '@mail.com')
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
          const rating_response = await client
            .post('/parkingRating')
            .json({
              comment: 'muy organizado',
              rating: 5,
              user_id: rating_user.id,
              parking_id: new_parking.id,
            })
            .loginAs(admin)
          rating_response.assertStatus(200)
          if (rating_response) {
            // Verificación de creación
            const new_rating = await ParkingRating.findByOrFail(
              'id',
              rating_response.response._body.id
            )
            assert.equal(new_rating.rating, 5)

            // Eliminación para no dejar basura en la base de datos
            new_parking.delete()
            new_rating.delete()
            last_user.delete()
            last_owner.delete()
            rating_user.delete()
          }
        }
      }
    }
  })

  test('Edit a parking rating', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación nuevo usuario
    let email_user = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email_user + '@mail.com',
      password: '1234',
      role_id: 2,
    })

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
    let rating_user = await User.findByOrFail('email', email_user + '@mail.com')
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
          const rating_response = await client
            .post('/parkingRating')
            .json({
              comment: 'muy organizado',
              rating: 5,
              user_id: rating_user.id,
              parking_id: new_parking.id,
            })
            .loginAs(admin)
          rating_response.assertStatus(200)
          if (rating_response) {
            // Verificación de creación
            const new_rating = await ParkingRating.findByOrFail(
              'id',
              rating_response.response._body.id
            )
            assert.equal(new_rating.rating, 5)

            //Eduición del rating
            const edit_response = await client
              .put(`/parkingRating/${new_rating.id}`)
              .json({
                comment: 'Cambie de oponion',
                rating: 4,
              })
              .loginAs(admin)
            edit_response.assertStatus(200)
            if (edit_response) {
              // Verificación de edición
              const edited_rating = await ParkingRating.findByOrFail('id', new_rating.id)

              assert.equal(new_rating.id, edited_rating.id)
              assert.equal(edited_rating.comment, 'Cambie de oponion')
              assert.isBelow(edited_rating.rating, new_rating.rating)

              // Eliminación para no dejar basura en la base de datos
              new_parking.delete()
              new_rating.delete()
              last_user.delete()
              last_owner.delete()
              rating_user.delete()
            }
          }
        }
      }
    }
  })

  test('Delete a parking rating', async ({ client, assert }) => {
    // Write your test here
    const admin = await User.find(1)

    // Creación nuevo usuario
    let email_user = (Math.random() * 10).toString(36).replace('.', '')
    await client.post('/register').json({
      name: 'NewUser',
      email: email_user + '@mail.com',
      password: '1234',
      role_id: 2,
    })

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
    let rating_user = await User.findByOrFail('email', email_user + '@mail.com')
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
          const rating_response = await client
            .post('/parkingRating')
            .json({
              comment: 'muy organizado',
              rating: 5,
              user_id: rating_user.id,
              parking_id: new_parking.id,
            })
            .loginAs(admin)
          rating_response.assertStatus(200)
          if (rating_response) {
            // Verificación de creación
            const new_rating = await ParkingRating.findByOrFail(
              'id',
              rating_response.response._body.id
            )
            assert.equal(new_rating.rating, 5)
            const destroy_response = await client
              .delete(`/parkingRating/${new_rating.id}`)
              .loginAs(admin)
            destroy_response.assertStatus(200)
          }

          // Eliminación para no dejar basura en la base de datos
          new_parking.delete()
          rating_user.delete()
          last_user.delete()
          last_owner.delete()
        }
      }
    }
  })
})
