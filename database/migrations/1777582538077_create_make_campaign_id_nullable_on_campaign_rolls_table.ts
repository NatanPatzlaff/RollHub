import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_rolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('campaign_id').unsigned().nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('campaign_id').unsigned().notNullable().alter()
    })
  }
}