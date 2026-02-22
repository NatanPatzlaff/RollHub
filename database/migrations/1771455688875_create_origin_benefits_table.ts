import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'origin_benefits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('origin_id').unsigned().references('origins.id').onDelete('CASCADE')
      table.integer('skill_id').unsigned().references('skills.id').onDelete('CASCADE').nullable()
      table.integer('ability_id').unsigned().references('abilities.id').onDelete('CASCADE').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}