import { test } from '@japa/runner'

test.group('Security', () => {
  test('Log in with right credentials', async ({ client, assert }) => {
    // Write your test here
    // Obtener ultimo id

    // Ingreso de credenciales validas
    const response = await client.post('/login').json({
      email: 'juan@mail.com',
      password: '1234',
    })

    // Verificación de token
    response.assertStatus(200)
    assert.typeOf(response.response._body.token.token, 'string')
    assert.equal(response.response._body.token.type, 'bearer')
  })

  test('Log in with wrong credentials', async ({ client, assert }) => {
    // Write your test here
    // Obtener ultimo id

    // Ingreso de credenciales validas
    const response = await client.post('/login').json({
      email: 'juan@mail.com',
      password: '123456',
    })

    // No debe entrar
    response.assertStatus(401)
  })

  test('Log out', async ({ client, assert }) => {
    // Write your test here
    const response = await client.post('/login').json({
      email: 'juan@mail.com',
      password: '1234',
    })

    // Verificación de INGRESO
    response.assertStatus(200)
    // Ingreso de credenciales validas
    const response2 = await client
      .post('/logout')
      .json({
        email: 'juan@mail.com',
      })
      .bearerToken(response.response._body.token.token)

    // No debe entrar
    response2.assertStatus(200)
  })

  test('Restore password', async ({ client, assert }) => {
    // Write your test here
    const response = await client.post('/forgot').json({
      email: 'juan@mail.com',
    })

    // Verificación de envío de token
    response.assertStatus(200)
  })
})
