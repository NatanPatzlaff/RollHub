import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_rolls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('campaign_id')
        .unsigned()
        .references('id')
        .inTable('campaigns')
        .onDelete('CASCADE')
      table
        .integer('character_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('characters')
        .onDelete('SET NULL')
      table.string('player_name').notNullable() // Nome do jogador
      table.string('action').notNullable() // ex: "Ataque: Acha", "Ocultismo"
      table.string('roll_expression').notNullable() // ex: "1d20+10"
      table.integer('result').notNullable() // Resultado final
      table.boolean('is_critical').defaultTo(false)
      table.boolean('is_fail').defaultTo(false)
      table.boolean('is_gm').defaultTo(false)
      table.timestamp('rolled_at', { useTz: true }).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
