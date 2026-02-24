import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('character_rituals', (table) => {
      table.boolean('ignora_limite_conhecimento').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable('character_rituals', (table) => {
      table.dropColumn('ignora_limite_conhecimento')
    })
  }
}
