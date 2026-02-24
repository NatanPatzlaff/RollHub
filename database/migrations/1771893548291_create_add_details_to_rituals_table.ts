import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rituals'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('resistance').nullable().after('duration')
      table.text('discente').nullable().after('description')
      table.text('verdadeiro').nullable().after('discente')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}