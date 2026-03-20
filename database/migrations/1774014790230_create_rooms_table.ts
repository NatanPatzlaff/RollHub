import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('mission_id').unsigned().references('id').inTable('missions').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('state', ['unvisited', 'active', 'explored']).defaultTo('unvisited')

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}