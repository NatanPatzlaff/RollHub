import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Armas do personagem (instância única de cada arma no inventário)
    this.schema.createTable('character_weapons', (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
      table.integer('weapon_id').unsigned().references('id').inTable('weapons').onDelete('CASCADE')
      table.string('custom_name').nullable() // Nome personalizado (ex: "Minha Katana Amaldiçoada")
      table.boolean('is_equipped').defaultTo(false)
      table.integer('current_ammo').nullable() // Munição atual carregada
      table.text('notes').nullable() // Anotações do jogador

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Modificações aplicadas em cada arma do personagem
    this.schema.createTable('character_weapon_modifications', (table) => {
      table.increments('id')
      table.integer('character_weapon_id').unsigned().references('id').inTable('character_weapons').onDelete('CASCADE')
      table.integer('modification_id').unsigned().references('id').inTable('weapon_modifications').onDelete('CASCADE').nullable()
      table.integer('curse_id').unsigned().references('id').inTable('item_curses').onDelete('CASCADE').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Proteções do personagem
    this.schema.createTable('character_protections', (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
      table.integer('protection_id').unsigned().references('id').inTable('protections').onDelete('CASCADE')
      table.string('custom_name').nullable()
      table.boolean('is_equipped').defaultTo(false)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Modificações/maldições aplicadas em proteções
    this.schema.createTable('character_protection_modifications', (table) => {
      table.increments('id')
      table.integer('character_protection_id').unsigned().references('id').inTable('character_protections').onDelete('CASCADE')
      table.integer('curse_id').unsigned().references('id').inTable('item_curses').onDelete('CASCADE').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Itens gerais do personagem
    this.schema.createTable('character_general_items', (table) => {
      table.increments('id')
      table.integer('character_id').unsigned().references('id').inTable('characters').onDelete('CASCADE')
      table.integer('general_item_id').unsigned().references('id').inTable('general_items').onDelete('CASCADE')
      table.integer('quantity').defaultTo(1)
      table.text('notes').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('character_general_items')
    this.schema.dropTable('character_protection_modifications')
    this.schema.dropTable('character_protections')
    this.schema.dropTable('character_weapon_modifications')
    this.schema.dropTable('character_weapons')
  }
}