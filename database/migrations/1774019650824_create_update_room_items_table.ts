import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('item_type').nullable()
      table.integer('catalog_item_id').nullable()
      table.boolean('collected').defaultTo(false)
      table.integer('collected_by_character_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('item_type')
      table.dropColumn('catalog_item_id')
      table.dropColumn('collected')
      table.dropColumn('collected_by_character_id')
    })
  }
}