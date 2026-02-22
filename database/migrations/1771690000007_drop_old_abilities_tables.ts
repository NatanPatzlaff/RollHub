import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.dropTableIfExists('character_abilities')
    this.schema.dropTableIfExists('abilities')
  }

  async down() {
    // Recreate abilities table
    this.schema.createTable('abilities', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('type').notNullable()
      table.json('effects').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Recreate character_abilities pivot
    this.schema.createTable('character_abilities', (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('characters.id').onDelete('CASCADE')
      table.integer('ability_id').unsigned().references('abilities.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }
}
