import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'general_items'
  protected pivotTableName = 'character_general_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('skill_bonus_name').nullable()
      table.integer('skill_bonus_value').nullable()
      table.boolean('skill_bonus_is_choosable').defaultTo(false)
    })

    this.schema.alterTable(this.pivotTableName, (table) => {
      table.string('chosen_skill_bonus_name').nullable()
      table.integer('chosen_skill_bonus_value').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.pivotTableName, (table) => {
      table.dropColumn('chosen_skill_bonus_name')
      table.dropColumn('chosen_skill_bonus_value')
    })
    
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('skill_bonus_name')
      table.dropColumn('skill_bonus_value')
      table.dropColumn('skill_bonus_is_choosable')
    })
  }
}
