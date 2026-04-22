import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'monsters'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('campaign_id').unsigned().references('id').inTable('campaigns').onDelete('CASCADE').nullable()
      table.string('name').notNullable()
      table.string('type').nullable()
      table.integer('vd').defaultTo(0)
      table.integer('defense').defaultTo(10)
      table.integer('hp_max').notNullable()
      table.integer('hp_current').notNullable()
      table.integer('agi').defaultTo(0)
      table.integer('str').defaultTo(0)
      table.integer('int').defaultTo(0)
      table.integer('pre').defaultTo(0)
      table.integer('vig').defaultTo(0)
      table.json('attacks').nullable()
      table.json('abilities').nullable()
      table.json('resistances').nullable()
      table.text('notes').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}