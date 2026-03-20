import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_npcs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_monster').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_monster')
    })
  }
}