import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'combats'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('room_id').unsigned().references('id').inTable('rooms').nullable().onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('room_id')
    })
  }
}