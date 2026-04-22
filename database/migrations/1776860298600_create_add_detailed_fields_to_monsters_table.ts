import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monsters'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('size').nullable()
      table.string('element').nullable()
      table.string('secondary_elements').nullable()
      table.integer('movement').defaultTo(9)
      table.json('alternative_movements').nullable()
      table.integer('nex_immune').defaultTo(0)
      table.string('immunities').nullable()
      table.string('additional_immunities').nullable()
      table.string('vulnerabilities').nullable()
      
      // Skills
      table.integer('perception_dice').defaultTo(1)
      table.integer('perception_bonus').defaultTo(0)
      table.integer('initiative_dice').defaultTo(1)
      table.integer('initiative_bonus').defaultTo(0)
      table.integer('fortitude_dice').defaultTo(1)
      table.integer('fortitude_bonus').defaultTo(0)
      table.integer('reflex_dice').defaultTo(1)
      table.integer('reflex_bonus').defaultTo(0)
      table.integer('will_dice').defaultTo(1)
      table.integer('will_bonus').defaultTo(0)
      table.json('additional_skills').nullable()
      
      // Presença Perturbadora
      table.integer('disturbing_presence_dt').nullable()
      table.string('disturbing_presence_damage').nullable()
      
      // Textos
      table.text('description').nullable()
      table.text('fear_enigma').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns(
        'size', 'element', 'secondary_elements', 'movement', 'alternative_movements',
        'nex_immune', 'immunities', 'additional_immunities', 'vulnerabilities',
        'perception_dice', 'perception_bonus', 'initiative_dice', 'initiative_bonus',
        'fortitude_dice', 'fortitude_bonus', 'reflex_dice', 'reflex_bonus', 
        'will_dice', 'will_bonus', 'additional_skills',
        'disturbing_presence_dt', 'disturbing_presence_damage',
        'description', 'fear_enigma'
      )
    })
  }
}