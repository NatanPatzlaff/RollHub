import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ammunitions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('category').defaultTo(1)
      table.integer('spaces').defaultTo(1)
      table.string('duration').nullable() // ex: "2 Cenas", "1 Missão", "1 Disparo"
      table.json('weapon_type_restriction').nullable() // armas compatíveis

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
