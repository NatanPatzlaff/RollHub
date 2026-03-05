import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rituals'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('short_description').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('short_description')
    })
  }
}