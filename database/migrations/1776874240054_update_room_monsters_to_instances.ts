import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_monsters'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // monster_id agora é opcional (template de origem)
      table.integer('monster_id').unsigned().references('id').inTable('monsters').nullable().alter()
      
      // Dados espelhados do Monster
      table.string('name').nullable()
      table.string('type').nullable()
      table.string('size').nullable()
      table.string('element').nullable()
      table.string('secondary_elements').nullable()
      table.integer('vd').defaultTo(0)
      table.integer('defense').defaultTo(10)
      table.integer('hp_max').nullable()
      table.integer('hp_current').nullable()
      table.integer('movement').defaultTo(9)
      table.json('alternative_movements').nullable()
      table.integer('nex_immune').defaultTo(0)
      table.integer('agi').defaultTo(0)
      table.integer('str').defaultTo(0)
      table.integer('int').defaultTo(0)
      table.integer('pre').defaultTo(0)
      table.integer('vig').defaultTo(0)
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
      table.string('immunities').nullable()
      table.string('additional_immunities').nullable()
      table.string('vulnerabilities').nullable()
      table.integer('disturbing_presence_dt').nullable()
      table.string('disturbing_presence_damage').nullable()
      table.json('attacks').nullable()
      table.json('abilities').nullable()
      table.json('resistances').nullable()
      table.text('description').nullable()
      table.text('fear_enigma').nullable()
      table.text('notes').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('monster_id').unsigned().references('id').inTable('monsters').notNullable().alter()
      
      const columns = [
        'name', 'type', 'size', 'element', 'secondary_elements', 'vd', 'defense', 
        'hp_max', 'hp_current', 'movement', 'alternative_movements', 'nex_immune',
        'agi', 'str', 'int', 'pre', 'vig', 'perception_dice', 'perception_bonus',
        'initiative_dice', 'initiative_bonus', 'fortitude_dice', 'fortitude_bonus',
        'reflex_dice', 'reflex_bonus', 'will_dice', 'will_bonus', 'additional_skills',
        'immunities', 'additional_immunities', 'vulnerabilities', 
        'disturbing_presence_dt', 'disturbing_presence_damage', 'attacks', 'abilities',
        'resistances', 'description', 'fear_enigma', 'notes'
      ]
      columns.forEach(col => table.dropColumn(col))
    })
  }
}
