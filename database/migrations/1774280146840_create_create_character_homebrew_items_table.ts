import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_character_homebrew_items'

  async up() {
    this.schema.createTable('character_homebrew_items', (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
      table.integer('homebrew_item_id').unsigned().references('id').inTable('homebrew_items').onDelete('CASCADE')
      table.integer('quantity').defaultTo(1)
      table.text('notes').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable('character_homebrew_items')
  }
}