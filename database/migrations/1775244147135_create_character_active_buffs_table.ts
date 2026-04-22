import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_active_buffs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('character_id').unsigned()
        .references('characters.id').onDelete('CASCADE')
      table.string('buff_type').notNullable() 
        // 'ritual' | 'ability'
      table.string('buff_id').notNullable() 
        // id único do buff (ex: 'Armadura de Sangue-1234567890')
      table.string('label').notNullable()
      table.json('data').notNullable() 
        // objeto completo do buff serializado
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}