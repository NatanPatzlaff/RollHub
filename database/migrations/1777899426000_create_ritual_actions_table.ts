import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ritual_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('ritual_id')
        .unsigned()
        .references('rituals.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('label').notNullable()
      table.integer('pe_cost').notNullable()
      table.integer('dt').nullable()
      table.text('action_payload').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
