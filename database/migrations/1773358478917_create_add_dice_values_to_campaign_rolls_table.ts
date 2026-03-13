import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_rolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('dice_values').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('dice_values')
    })
  }
}