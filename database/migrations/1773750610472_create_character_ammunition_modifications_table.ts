import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_ammunition_modifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('character_ammunition_id').unsigned().references('id').inTable('character_ammunitions').onDelete('CASCADE').index('idx_char_ammo_id')
      table.integer('modification_id').unsigned().references('id').inTable('weapon_modifications').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}