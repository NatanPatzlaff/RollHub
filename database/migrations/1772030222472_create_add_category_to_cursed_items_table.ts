import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursed_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('category').defaultTo(2).after('name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category')
    })
  }
}