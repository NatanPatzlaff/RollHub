import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Itens amaldiçoados do personagem
    this.schema.createTable('character_cursed_items', (table) => {
      table.increments('id')
      table
        .integer('character_id')
        .unsigned()
        .references('id')
        .inTable('characters')
        .onDelete('CASCADE')
      table
        .integer('cursed_item_id')
        .unsigned()
        .references('id')
        .inTable('cursed_items')
        .onDelete('CASCADE')
      table.integer('quantity').defaultTo(1)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('character_cursed_items')
  }
}
