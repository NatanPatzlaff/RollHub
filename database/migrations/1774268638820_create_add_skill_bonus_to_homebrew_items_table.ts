import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'homebrew_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('skill_bonus').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('skill_bonus')
    })
  }
}