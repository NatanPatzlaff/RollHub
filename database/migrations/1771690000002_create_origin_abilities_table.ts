import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'origin_abilities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('origin_id')
        .unsigned()
        .references('origins.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.json('effects').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
