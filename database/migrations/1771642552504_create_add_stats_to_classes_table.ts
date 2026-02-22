import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'classes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('base_hp').notNullable().defaultTo(0)
      table.integer('hp_per_level').notNullable().defaultTo(0)
      table.string('hp_attribute').notNullable().defaultTo('vigor')
      table.integer('base_pe').notNullable().defaultTo(0)
      table.integer('pe_per_level').notNullable().defaultTo(0)
      table.string('pe_attribute').notNullable().defaultTo('presence')
      table.integer('base_sanity').notNullable().defaultTo(0)
      table.integer('sanity_per_level').notNullable().defaultTo(0)
      table.string('proficiencies').nullable()
      table.string('trained_skills_rules').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('base_hp')
      table.dropColumn('hp_per_level')
      table.dropColumn('hp_attribute')
      table.dropColumn('base_pe')
      table.dropColumn('pe_per_level')
      table.dropColumn('pe_attribute')
      table.dropColumn('base_sanity')
      table.dropColumn('sanity_per_level')
      table.dropColumn('proficiencies')
      table.dropColumn('trained_skills_rules')
    })
  }
}