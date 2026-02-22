import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'characters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('class_id').unsigned().references('classes.id').onDelete('CASCADE')
      table.integer('origin_id').unsigned().references('origins.id').onDelete('CASCADE')
      table.integer('trail_id').unsigned().references('trails.id').onDelete('SET NULL').nullable()
      table.integer('nex').defaultTo(5)
      table.integer('xp').defaultTo(0)
      table.string('name').notNullable()
      table.text('lore').nullable()
      table.text('appearance').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}