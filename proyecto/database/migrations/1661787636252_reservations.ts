import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('driver_id').unsigned().references('drivers.id').onDelete('CASCADE')
      table.integer('parking_spot_id').unsigned().references('parking_spots.id').onDelete('CASCADE')
      table.integer('vehicle_id').unsigned().references('vehicles.id').onDelete('CASCADE')
      table.float('price')
      table.datetime('start_date')
      table.datetime('end_date')
      table.string('observations').nullable()
      table.integer('state')
      
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
