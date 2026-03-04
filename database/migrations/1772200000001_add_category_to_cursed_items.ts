import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Adiciona coluna category à tabela cursed_items para controle de limites por categoria
    this.schema.alterTable('cursed_items', (table) => {
      table.integer('category').defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable('cursed_items', (table) => {
      table.dropColumn('category')
    })
  }
}
