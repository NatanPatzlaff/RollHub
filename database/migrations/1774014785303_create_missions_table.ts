import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'missions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('campaign_id').unsigned().references('id').inTable('campaigns').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('status', ['inactive', 'active', 'completed']).defaultTo('inactive')
      
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}