import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_stats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('characters.id').onDelete('CASCADE')
      table.integer('max_hp').defaultTo(0)
      table.integer('current_hp').defaultTo(0)
      table.integer('max_sanity').defaultTo(0)
      table.integer('current_sanity').defaultTo(0)
      table.integer('max_pe').defaultTo(0)
      table.integer('current_pe').defaultTo(0)

      table.integer('defense_misc').defaultTo(0)
      table.integer('defense_temp').defaultTo(0)
      table.integer('dodge_misc').defaultTo(0)
      table.integer('dodge_temp').defaultTo(0)
      table.integer('block_dr_misc').defaultTo(0)
      table.integer('block_dr_temp').defaultTo(0)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}