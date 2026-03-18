import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_ammunitions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
      table.integer('ammunition_id').unsigned().references('id').inTable('ammunitions').onDelete('CASCADE')
      table.integer('quantity').defaultTo(1)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}