import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'combats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('campaign_id').unsigned().references('id').inTable('campaigns').onDelete('CASCADE')
      table.integer('round').defaultTo(1)
      table.boolean('active').defaultTo(true)
      table.timestamp('started_at').nullable()

      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now())
      table
        .timestamp('updated_at', { useTz: true })
        .nullable()
        .defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}