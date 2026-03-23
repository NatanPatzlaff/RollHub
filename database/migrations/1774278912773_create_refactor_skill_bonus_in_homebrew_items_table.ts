import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'homebrew_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('skill_bonus')
      table.string('skill_bonus_name').nullable()
      table.integer('skill_bonus_value').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('skill_bonus').nullable()
      table.dropColumn('skill_bonus_name')
      table.dropColumn('skill_bonus_value')
    })
  }
}