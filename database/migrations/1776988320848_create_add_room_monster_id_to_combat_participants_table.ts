import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'combat_participants'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('room_monster_id').unsigned().nullable().references('id').inTable('room_monsters').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('room_monster_id')
    })
  }
}