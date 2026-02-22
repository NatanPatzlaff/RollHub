import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'class_progressions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('class_id').unsigned().references('classes.id').onDelete('CASCADE')
      table.integer('nex').notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.string('type').notNullable() // ABILITY, ATTRIBUTE_BUFF, etc
      table.integer('reference_id').unsigned().nullable() // FK to abilities or skills if applicable
      table.json('effects').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}