import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'parking_ratings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('comment')
      table.float('rating')
      table.integer('user_id').unsigned().references('users.id').onDelete('NO ACTION')
      table.integer('parking_id').unsigned().references('parkings.id').onDelete('NO ACTION')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
