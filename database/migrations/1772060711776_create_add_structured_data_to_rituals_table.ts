import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rituals'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('normal_pe').nullable()
      table.integer('discente_pe').nullable()
      table.integer('verdadeiro_pe').nullable()
      table.string('normal_damage').nullable()
      table.string('discente_damage').nullable()
      table.string('verdadeiro_damage').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('normal_pe')
      table.dropColumn('discente_pe')
      table.dropColumn('verdadeiro_pe')
      table.dropColumn('normal_damage')
      table.dropColumn('discente_damage')
      table.dropColumn('verdadeiro_damage')
    })
  }
}