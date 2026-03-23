import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('homebrew_item_id').unsigned().references('id').inTable('homebrew_items').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('homebrew_item_id')
    })
  }
}