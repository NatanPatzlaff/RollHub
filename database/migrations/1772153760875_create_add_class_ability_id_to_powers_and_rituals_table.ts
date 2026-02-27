import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('character_paranormal_powers', (table) => {
      table
        .integer('character_class_ability_id')
        .unsigned()
        .references('character_class_abilities.id')
        .onDelete('CASCADE')
        .nullable()
    })

    this.schema.alterTable('character_rituals', (table) => {
      table
        .integer('character_class_ability_id')
        .unsigned()
        .references('character_class_abilities.id')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable('character_paranormal_powers', (table) => {
      table.dropColumn('character_class_ability_id')
    })
    this.schema.alterTable('character_rituals', (table) => {
      table.dropColumn('character_class_ability_id')
    })
  }
}