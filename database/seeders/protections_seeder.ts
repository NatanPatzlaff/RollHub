import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ProtectionsSeeder extends BaseSeeder {
  async run() {
    await db.from('protections').delete()
    const now = DateTime.now().toSQL()

    await db.table('protections').multiInsert([
      {
        name: 'Proteção Leve',
        category: 1,
        type: 'Leve',
        defense_bonus: 5,
        spaces: 2,
        description: 'Jaqueta de couro pesada ou um colete de kevlar. Essa proteção é tipicamente usada por seguranças e policiais.',
        created_at: now,
      },
      {
        name: 'Proteção Pesada',
        category: 2,
        type: 'Pesada',
        defense_bonus: 10,
        spaces: 5,
        description: 'Equipamento usado por forças especiais da polícia e pelo exército. Consiste de capacete, ombreiras, joelheiras e caneleiras, além de um colete com várias camadas de kevlar. Fornece resistência a balístico, corte, impacto e perfuração 2. Impõe –5 em testes de perícias que sofrem penalidade de carga.',
        created_at: now,
      },
      {
        name: 'Escudo',
        category: 1,
        type: 'Escudo',
        defense_bonus: 2,
        spaces: 2,
        description: 'Um escudo medieval ou moderno, como aqueles usados por tropas de choque. Precisa ser empunhado em uma mão e fornece Defesa +2. Bônus na Defesa fornecido por um escudo acumula com o de uma proteção. Para efeitos de proficiência e penalidade por não proficiência, escudos contam como proteção pesada.',
        created_at: now,
      },
    ])
  }
}
