import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class WeaponModificationsSeeder extends BaseSeeder {
  async run() {
    await db.from('weapon_modifications').delete()
    const now = DateTime.now().toSQL()
    const mods = [
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
        name: 'Compensador',
        category: 1,
        type: 'Acessório',
        description: 'Sistema de amortecimento que anula a penalidade em testes de ataque por disparar rajadas.',
        special_properties: JSON.stringify({ ignore_auto_penalty: true }),
        weapon_type_restriction: JSON.stringify(['Automática']),
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
      {
        name: 'Mira Laser',
        category: 1,
        type: 'Acessório',
        description: 'Laser que ajuda em disparos letais; aumenta a margem de ameaça em +2.',
        critical_bonus: 2,
        weapon_type_restriction: JSON.stringify(['Arma de fogo']),
        created_at: now,
      },
      {
        name: 'Mira Telescópica',
        category: 1,
        type: 'Acessório',
        description: 'Luneta para disparos de longa distância. Aumenta o alcance da arma em uma categoria e permite usar Ataque Furtivo em qualquer alcance.',
        range_bonus: 1,
        special_properties: JSON.stringify({ sneak_attack_any_range: true }),
        weapon_type_restriction: JSON.stringify(['Arma de fogo']),
        created_at: now,
      },
      {
        name: 'Silenciador',
        category: 1,
        type: 'Acessório',
        description: 'Reduz em –2d a penalidade em Furtividade para se esconder no mesmo turno em que atacou.',
        special_properties: JSON.stringify({ stealth_penalty_reduction: 2 }),
        weapon_type_restriction: JSON.stringify(['Arma de fogo']),
        created_at: now,
      },
      {
        name: 'Visão de Calor',
        category: 1,
        type: 'Acessório',
        description: 'Sistema eletrônico infravermelho; permite ignorar qualquer camuflagem do alvo ao disparar.',
        special_properties: JSON.stringify({ ignore_camouflage: true }),
        created_at: now,
      },
      {
        name: 'Dum Dum',
        category: 1,
        type: 'Munição',
        description: 'Balas feitas para se expandir no impacto; aumenta o multiplicador de crítico em +1.',
        critical_multiplier_bonus: '+1x',
        weapon_type_restriction: JSON.stringify(['Munição']),
        created_at: now,
      },
      {
        name: 'Explosiva',
        category: 1,
        type: 'Munição',
        description: 'Balas que explodem ao atingir o alvo; aumenta o dano causado em +2d6.',
        damage_bonus: '+2d6',
        weapon_type_restriction: JSON.stringify(['Munição']),
        created_at: now,
      },
    ]
    await db.table('weapon_modifications').multiInsert(mods)
    console.log(`✅ ${mods.length} modificações inseridas com sucesso!`)
  }
}
