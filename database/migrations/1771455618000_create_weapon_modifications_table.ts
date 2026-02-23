import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Catálogo de modificações de armas (acessórios, melhorias, etc)
    this.schema.createTable('weapon_modifications', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('category').notNullable() // Categoria mínima para usar (0, 1, 2, 3, 4)
      table.string('type').notNullable() // Acessório, Melhoria, Munição Especial, etc
      table.text('description').nullable()
      
      // Modificadores de estatísticas (valores que somam/subtraem)
      table.string('damage_bonus').nullable() // "+1d6", "+2", etc
      table.string('damage_type_override').nullable() // Muda tipo de dano (ex: munição de fogo)
      table.integer('critical_bonus').nullable() // Bonus na margem (ex: -1 = de 19 para 18)
      table.string('critical_multiplier_bonus').nullable() // "+1x" = de x2 para x3
      table.integer('range_bonus').nullable() // Aumenta alcance em categorias
      table.integer('ammo_capacity_bonus').nullable() // Aumenta capacidade
      table.integer('attack_bonus').nullable() // Bônus no teste de ataque
      
      // Propriedades especiais que a modificação adiciona
      table.json('special_properties').nullable() // { "silenciada": true, "mira_laser": true }
      
      // Restrições
      table.json('weapon_type_restriction').nullable() // ["Arma de fogo"] - só pode aplicar nesses tipos
      table.integer('spaces').defaultTo(0) // Espaços adicionais que ocupa
      table.integer('price').nullable() // Preço em $

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    // Maldições que podem ser aplicadas em itens (vem de itens amaldiçoados)
    this.schema.createTable('item_curses', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('element').nullable() // Elemento paranormal: 1=Sangue, 2=Conhecimento, 3=Energia, 4=Morte, 5=Medo
      table.text('description').nullable()
      
      // Modificadores (podem ser positivos ou negativos)
      table.string('damage_bonus').nullable()
      table.string('damage_type_override').nullable()
      table.integer('critical_bonus').nullable()
      table.string('critical_multiplier_bonus').nullable()
      table.integer('attack_bonus').nullable()
      table.integer('defense_bonus').nullable()
      
      // Efeitos especiais da maldição
      table.json('benefits').nullable() // Benefícios
      table.json('drawbacks').nullable() // Desvantagens/custos
      
      // Restrições
      table.json('item_type_restriction').nullable() // ["Arma", "Proteção"] - onde pode aplicar

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('item_curses')
    this.schema.dropTable('weapon_modifications')
  }
}
