import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_rolls'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('dice_values').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}