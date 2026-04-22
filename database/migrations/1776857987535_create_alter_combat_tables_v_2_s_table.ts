import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('combat_participants', (table) => {
      table.integer('hp_max').notNullable().defaultTo(0)
      // I'll ensure monster_id is linked to the new monsters table
      // Since it already exists as a column in the model, I'll just add the reference if it's missing or alter it
      table.integer('monster_id').unsigned().references('id').inTable('monsters').onDelete('SET NULL').nullable().alter()
    })

    this.schema.alterTable('combats', (table) => {
      table.integer('current_participant_id').unsigned().references('id').inTable('combat_participants').onDelete('SET NULL').nullable()
    })
  }

  public async down() {
    this.schema.alterTable('combats', (table) => {
      table.dropColumn('current_participant_id')
    })
    
    this.schema.alterTable('combat_participants', (table) => {
      table.dropColumn('hp_max')
      table.integer('monster_id').nullable().alter()
    })
  }
}