import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('character_homebrew_items', (table) => {
      table.enum('status', ['active', 'pending', 'rejected']).defaultTo('active').notNullable()
      table.string('rejection_reason').nullable()
    })

    this.schema.alterTable('campaigns', (table) => {
      table.boolean('require_item_approval').defaultTo(false).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable('character_homebrew_items', (table) => {
      table.dropColumn('status')
      table.dropColumn('rejection_reason')
    })

    this.schema.alterTable('campaigns', (table) => {
      table.dropColumn('require_item_approval')
    })
  }
}