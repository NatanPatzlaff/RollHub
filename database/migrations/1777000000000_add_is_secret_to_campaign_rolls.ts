import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_rolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_secret').defaultTo(false).after('is_gm')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_secret')
    })
  }
}
