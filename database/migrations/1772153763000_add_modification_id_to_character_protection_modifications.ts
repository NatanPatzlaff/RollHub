import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'character_protection_modifications'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('modification_id').unsigned().references('id').inTable('protection_modifications').onDelete('CASCADE').nullable().after('character_protection_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('modification_id')
    })
  }
}
