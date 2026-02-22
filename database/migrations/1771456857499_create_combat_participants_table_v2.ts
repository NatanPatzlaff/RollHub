import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'combat_participants'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('combat_id').unsigned().references('id').inTable('combats').onDelete('CASCADE')
            table.integer('character_id').unsigned().nullable().references('id').inTable('characters').onDelete('CASCADE')
            table.integer('monster_id').unsigned().nullable()
            table.string('name').notNullable()
            table.integer('initiative').defaultTo(0)
            table.integer('hp_current').nullable()
            table.text('status').nullable()

            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).nullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
