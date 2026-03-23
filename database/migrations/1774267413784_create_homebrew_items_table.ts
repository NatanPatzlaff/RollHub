import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'homebrew_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('item_type', ['weapon', 'protection', 'ammunition', 'general']).notNullable()
      table.integer('created_by_user_id').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()

      // Arma
      table.string('damage').nullable()
      table.string('damage_type').nullable()
      table.string('range').nullable()

      // Proteção
      table.integer('defense_bonus').nullable()
      table.integer('penalty').nullable()

      // Munição
      table.string('caliber').nullable()
      table.integer('quantity_per_box').nullable()

      // Geral
      table.integer('category').nullable()

      // Comuns
      table.string('weight').nullable()
      table.string('price').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}