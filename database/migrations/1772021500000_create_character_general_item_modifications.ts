import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'character_general_item_modifications'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('character_general_item_id')
                .unsigned()
                .references('id')
                .inTable('character_general_items')
                .onDelete('CASCADE')
            table
                .integer('modification_id')
                .unsigned()
                .references('id')
                .inTable('protection_modifications')
                .onDelete('CASCADE')
            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).nullable()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
