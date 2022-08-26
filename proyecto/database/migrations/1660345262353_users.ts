import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('name', 60).notNullable()
      table.string('email', 254).notNullable() 
      table.string('password', 255).notNullable().unique()
      table.integer('role_id', 255).unsigned().references('roles.id')
      
      //.onDelete('CASCADE') No se hace así porque elimina todos los usuarios
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
