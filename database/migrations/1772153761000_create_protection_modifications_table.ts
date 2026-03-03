import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('protection_modifications', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category').notNullable()
      table.string('type').notNullable()
      table.integer('element').nullable()
      table.text('description').nullable()
      table.json('special_properties').nullable()
      table.integer('defense_bonus').nullable()
      table.json('protection_type_restriction').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('character_general_item_modifications', (table) => {
      table.increments('id')
      table.integer('character_general_item_id').unsigned().references('id').inTable('character_general_items').onDelete('CASCADE')
      table.integer('modification_id').unsigned().references('id').inTable('protection_modifications').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('character_general_item_modifications')
    this.schema.dropTable('protection_modifications')
  }
}
