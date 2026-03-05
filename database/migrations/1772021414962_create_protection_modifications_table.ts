import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'protection_modifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category').notNullable().defaultTo(1)
      table.string('type').notNullable() // Melhoria, Maldição
      table.string('element').nullable()
      table.string('description', 1000).nullable()
      table.json('special_properties').nullable()
      table.integer('defense_bonus').nullable()
      table.string('protection_type_restriction').nullable() // '["Pesada"]', '["Leve"]'

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}