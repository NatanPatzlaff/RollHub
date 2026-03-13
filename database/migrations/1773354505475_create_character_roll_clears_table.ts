import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_roll_clears'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('character_id')
        .unsigned()
        .references('id')
        .inTable('characters')
        .onDelete('CASCADE')
        .unique()
        .notNullable()
      table.timestamp('cleared_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}