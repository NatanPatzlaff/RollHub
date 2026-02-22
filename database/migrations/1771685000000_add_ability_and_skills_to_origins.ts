import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'origins'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('ability_name').nullable()
      table.text('ability_description').nullable()
      table.json('trained_skills').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ability_name')
      table.dropColumn('ability_description')
      table.dropColumn('trained_skills')
    })
  }
}
