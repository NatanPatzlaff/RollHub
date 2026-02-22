import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trail_progressions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('trail_id').unsigned().references('trails.id').onDelete('CASCADE')
      table.integer('nex').notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.string('type').notNullable()
      table.integer('reference_id').unsigned().nullable()
      table.json('effects').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}