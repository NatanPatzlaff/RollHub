import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_paranormal_powers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('character_id')
        .unsigned()
        .references('characters.id')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('paranormal_power_id')
        .unsigned()
        .references('paranormal_powers.id')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
