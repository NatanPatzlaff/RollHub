import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
      table.integer('item_id').unsigned() // Temporary removal of FK constraint due to migration error
      table.boolean('is_equipped').defaultTo(false)
      table.integer('current_category').nullable()
      table.json('details').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}