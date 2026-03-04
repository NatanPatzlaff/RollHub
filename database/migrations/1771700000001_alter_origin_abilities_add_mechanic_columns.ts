import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'origin_abilities'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Tipo da habilidade: ativa, passiva, reação, livre
      table.string('type').nullable().defaultTo(null)
      // Custo em PE (string para comportar valores variáveis como "2 PE por nível")
      table.string('pe_cost').nullable().defaultTo(null)
      // Alcance (ex: "Pessoal", "Curto", "30m")
      table.string('range').nullable().defaultTo(null)
      // Tempo de execução (ex: "Ação", "Ação Bônus", "Reação", "1 minuto")
      table.string('cast_time').nullable().defaultTo(null)
      // Duração (ex: "Instantâneo", "1 cena", "Permanente")
      table.string('duration').nullable().defaultTo(null)
      // Alvo (ex: "Você", "1 criatura", "Área: 9m de raio")
      table.string('target').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
      table.dropColumn('pe_cost')
      table.dropColumn('range')
      table.dropColumn('cast_time')
      table.dropColumn('duration')
      table.dropColumn('target')
    })
  }
}
