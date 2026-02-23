import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Tabela de Armas
    this.schema.createTable('weapons', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category').notNullable() // 0, 1, 2, 3 ou 4
      table.string('type').notNullable() // Simples, Tático, Pesado
      table.string('weapon_type').nullable() // Corpo a corpo, Arma de fogo, etc
      table.string('damage').notNullable() // "1d6", "2d10", etc
      table.string('damage_type').nullable() // Balístico, Corte, Impacto, Perfuração
      table.string('critical').nullable() // "19", "18", etc
      table.string('critical_multiplier').defaultTo('2x') // 2x, 3x, etc
      table.string('range').nullable() // Curto, Médio, Longo, Extremo ou em metros
      table.integer('ammo_capacity').nullable() // Capacidade de munição
      table.string('ammo_type').nullable() // Tipo de munição
      table.integer('spaces').defaultTo(1) // Espaços ocupados
      table.text('description').nullable()
      table.json('special').nullable() // Propriedades especiais (automática, duas mãos, etc)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Tabela de Proteções
    this.schema.createTable('protections', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category').notNullable() // 0, 1, 2, 3 ou 4
      table.string('type').notNullable() // Leve, Pesado
      table.integer('defense_bonus').defaultTo(0) // Bônus de defesa
      table.integer('dodge_penalty').defaultTo(0) // Penalidade de esquiva (valor negativo)
      table.integer('spaces').defaultTo(1) // Espaços ocupados
      table.text('description').nullable()
      table.json('special').nullable() // Propriedades especiais (resistências, etc)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Tabela de Itens Gerais
    this.schema.createTable('general_items', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category').notNullable() // 0, 1, 2, 3 ou 4
      table.string('type').nullable() // Operacional, Explosivo, etc
      table.integer('spaces').defaultTo(1) // Espaços ocupados
      table.text('description').nullable()
      table.json('effects').nullable() // Bônus em perícias, usos especiais, etc

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Tabela de Itens Amaldiçoados
    this.schema.createTable('cursed_items', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('element').nullable() // Elemento paranormal associado
      table.string('item_type').nullable() // Tipo base (arma, proteção, acessório, etc)
      table.integer('spaces').defaultTo(1) // Espaços ocupados
      table.text('description').nullable()
      table.json('benefits').nullable() // Benefícios do item
      table.json('curses').nullable() // Maldições/desvantagens

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('cursed_items')
    this.schema.dropTable('general_items')
    this.schema.dropTable('protections')
    this.schema.dropTable('weapons')
  }
}