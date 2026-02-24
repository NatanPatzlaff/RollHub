import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class WeaponModificationsSeeder extends BaseSeeder {
  async run() {
    await db.from('weapon_modifications').delete()
    const now = DateTime.now().toSQL()
    
    const mods = [
      // --- MELHORIAS ---
      {
        name: 'Certeira',
        category: 1,
        type: 'Melhoria',
        description: 'Fabricada para ser mais precisa e balanceada; fornece +2 nos testes de ataque.',
        attack_bonus: 2,
        created_at: now,
      },
      {
        name: 'Cruel',
        category: 1,
        type: 'Melhoria',
        description: 'Lâmina especialmente afiada ou material denso; fornece +2 nas rolagens de dano.',
        damage_bonus: '+2',
        created_at: now,
      },
      {
        name: 'Discreta',
        category: 1,
        type: 'Melhoria',
        description: 'Pode ser desmontável ou retrátil. Fornece +5 em testes de Crime para ser ocultada e reduz o espaço ocupado em 1.',
        special_properties: JSON.stringify({ crime_bonus: 5, space_reduction: 1 }),
        created_at: now,
      },
      {
        name: 'Perigosa',
        category: 1,
        type: 'Melhoria',
        description: 'Lâmina afiada ou fabricação maciça; aumenta a margem de ameaça em +2.',
        critical_bonus: 2,
        created_at: now,
      },
      {
        name: 'Tática',
        category: 1,
        type: 'Melhoria',
        description: 'Cabo texturizado ou bandoleira; permite sacar a arma como uma ação livre.',
        special_properties: JSON.stringify({ free_draw: true }),
        created_at: now,
      },
      {
        name: 'Alongada',
        category: 1,
        type: 'Melhoria',
        description: 'Com um cano mais longo que aumenta a precisão; fornece +2 nos testes de ataque.',
        attack_bonus: 2,
        weapon_type_restriction: JSON.stringify(['Arma de fogo']),
        created_at: now,
      },
      {
        name: 'Calibre Grosso',
        category: 1,
        type: 'Melhoria',
        description: 'Modificada para disparar munição maior; aumenta o dano em mais um dado do mesmo tipo (ex: 2d6 vira 3d6). Exige munição específica.',
        damage_bonus: '+1d',
        weapon_type_restriction: JSON.stringify(['Arma de fogo']),
        created_at: now,
      },
      {
        name: 'Ferrolho Automático',
        category: 1,
        type: 'Melhoria',
        description: 'Modifica o mecanismo para disparar várias vezes; a arma se torna automática.',
        special_properties: JSON.stringify({ automatic: true }),
        weapon_type_restriction: JSON.stringify(['Arma de fogo']),
        created_at: now,
      },

      // --- MALDIÇÕES ---
      // CONHECIMENTO
      {
        name: 'Antielemento',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'Letal contra criaturas de um elemento. Gaste 2 PE e acerte o ataque para causar +4d8 de dano.',
        created_at: now,
      },
      {
        name: 'Ritualística',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'Armazena um ritual na arma para ser descarregado como ação livre ao acertar um ataque.',
        created_at: now,
      },
      {
        name: 'Senciente',
        category: 4,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'A arma flutua e ataca por conta própria. Custo: 2 PE para imbuir + 1 PE por turno para manter.',
        created_at: now,
      },
      // ENERGIA
      {
        name: 'Empuxo',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'A arma pode ser arremessada, causa +1 dado de dano e volta voando para você. (Corpo a corpo apenas)',
        created_at: now,
      },
      {
        name: 'Energética',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'Gaste 2 PE para converter o dano em Energia. Fornece +5 no ataque e ignora RD.',
        created_at: now,
      },
      {
        name: 'Vibrante',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'Recebe Ataque Extra. Se já tiver, o custo da habilidade diminui em -1 PE.',
        created_at: now,
      },
      // MORTE
      {
        name: 'Consumidora',
        category: 2,
        type: 'Maldição',
        element: 'Morte',
        description: 'Drena entropia. Gaste 2 PE para deixar o alvo imóvel por uma rodada ao acertar.',
        created_at: now,
      },
      {
        name: 'Erosiva',
        category: 2,
        type: 'Maldição',
        element: 'Morte',
        description: 'Acelera o envelhecimento: +1d8 de dano de Morte. Gaste 2 PE por 2d4 de dano extra por 2 rodadas.',
        created_at: now,
      },
      {
        name: 'Repulsora',
        category: 2,
        type: 'Maldição',
        element: 'Morte',
        description: 'Aura que fornece +2 de Defesa. Ao bloquear, gaste 2 PE para ganhar +5 adicional na Defesa.',
        created_at: now,
      },
      // SANGUE
      {
        name: 'Lancinante',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'Ferimentos terríveis: +1d8 de dano de Sangue (multiplicado em críticos).',
        created_at: now,
      },
      {
        name: 'Predadora',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'Anula penalidades por camuflagem/cobertura leves, aumenta alcance em uma categoria e duplica a margem de ameaça.',
        created_at: now,
      },
      {
        name: 'Sanguinária',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'Causa sangramento cumulativo. Críticos drenam sangue (alvo fraco + 2d10 PV temporários).',
        created_at: now,
      },
    ]

    await db.table('weapon_modifications').multiInsert(mods)
    console.log(`✅ ${mods.length} modificações (Melhorias e Maldições) inseridas com sucesso!`)
  }
}
