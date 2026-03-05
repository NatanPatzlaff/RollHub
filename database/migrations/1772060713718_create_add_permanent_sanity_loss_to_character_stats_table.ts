import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_stats'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('permanent_sanity_loss').defaultTo(0).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('permanent_sanity_loss')
    })
  }
}