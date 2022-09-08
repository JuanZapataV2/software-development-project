import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'driver_vehicles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vehicle_id').unsigned().references('vehicles.id').onDelete('SET NULL')
      table.integer('driver_id').unsigned().references('drivers.id').onDelete('SET NULL')
      table.date('use_date')
      table.unique(['vehicle_id','driver_id','use_date'])
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
