import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_monsters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('room_id').unsigned().references('id').inTable('rooms').notNullable().onDelete('CASCADE')
      table.integer('monster_id').unsigned().references('id').inTable('monsters').notNullable().onDelete('CASCADE')
      table.integer('quantity').defaultTo(1)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}