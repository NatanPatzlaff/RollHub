import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_notes'
  
  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_private').defaultTo(false)
      table.integer('user_id').unsigned().references('id').inTable('users').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_private')
      table.dropColumn('user_id')
    })
  }
}