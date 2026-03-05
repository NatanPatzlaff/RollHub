import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ProtectionModificationSeeder extends BaseSeeder {
  async run() {
    await db.from('protection_modifications').delete()
    const now = DateTime.now().toSQL()

    const mods = [
      // ═══════════════════════════════════════════════════════
      // MELHORIAS DE PROTEÇÃO
      // ═══════════════════════════════════════════════════════
      {
        name: 'Antibombas',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'Quimicamente tratada para resistir ao calor e revestida de preenchimentos para amortecer estilhaços. Acompanha um capacete com viseira para proteger da luz e barulho de explosões. Fornece +5 em testes de resistência contra efeitos de área. Só pode ser aplicada em proteções pesadas.',
        special_properties: JSON.stringify({ area_resistance_bonus: 5 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Pesada']),
        created_at: now,
      },
      {
        name: 'Blindada',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'Reforçada com placas de aço e cerâmica costuradas dentro das camadas de kevlar. Aumenta a resistência a dano para 5 e o espaço ocupado em +1. Só pode ser aplicada em proteções pesadas.',
        special_properties: JSON.stringify({ space_addition: 1, damage_resistance: 5 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Pesada']),
        created_at: now,
      },
      {
        name: 'Discreta',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'Colete compacto feito com kevlar denso para reduzir o volume. Reduz o número de espaços ocupados em 1, fornece +5 em testes de Crime para ser ocultada e permite que você faça esse teste mesmo que não seja treinado na perícia. Só pode ser aplicada em proteções leves.',
        special_properties: JSON.stringify({ space_reduction: 1, crime_bonus: 5 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve']),
        created_at: now,
      },
      {
        name: 'Reforçada',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'Aumenta a Defesa fornecida em +2 e o espaço ocupado em +1. Uma proteção não pode ser reforçada e discreta ao mesmo tempo.',
        special_properties: JSON.stringify({ space_addition: 1 }),
        defense_bonus: 2,
        protection_type_restriction: null,
        created_at: now,
      },

      // ═══════════════════════════════════════════════════════
      // MELHORIAS DE ACESSÓRIOS
      // ═══════════════════════════════════════════════════════
      {
        name: 'Aprimorado',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'O bônus em perícia concedido pelo acessório aumenta para +5. Se o item tiver função adicional, esta modificação poderá ser escolhida uma segunda vez para esta função.',
        special_properties: JSON.stringify({ skill_bonus_upgrade: 5 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Discreto (Acessório)',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'O item é miniaturizado ou disfarçado como outro item inócuo (como um relógio). Reduz o número de espaços ocupados em 1, fornece +5 em testes de Crime para ser ocultado e permite que você faça esse teste mesmo que não seja treinado na perícia.',
        special_properties: JSON.stringify({ space_reduction: 1, crime_bonus: 5, allows_untrained_crime: true }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Função Adicional',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'O acessório fornece +2 em uma perícia adicional à sua escolha, sujeita à aprovação do mestre.',
        special_properties: JSON.stringify({ additional_skill_bonus: 2 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Instrumental',
        category: 1,
        type: 'Melhoria',
        element: null,
        description: 'O acessório pode ser usado como um kit de perícia específico (escolhido ao aplicar esta modificação).',
        special_properties: JSON.stringify({ acts_as_skill_kit: true }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },

      // ═══════════════════════════════════════════════════════
      // MALDIÇÕES DE PROTEÇÃO
      // ═══════════════════════════════════════════════════════

      // ─── CONHECIMENTO ───
      {
        name: 'Abascanta',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'Você recebe +5 em testes de resistência contra rituais. Uma vez por cena, quando você é alvo de um ritual, pode gastar uma reação e PE igual ao custo dele para refleti-lo de volta ao conjurador. As características do ritual (efeitos, DT…) se mantêm, mas você toma quaisquer decisões exigidas por ele.',
        special_properties: JSON.stringify({ ritual_resistance_bonus: 5, reflect_ritual: true }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },
      {
        name: 'Profética',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'A proteção concede vislumbres de um possível futuro imediato. Você recebe resistência a Conhecimento 10 e, quando faz um teste de resistência, pode gastar 2 PE para rolá-lo novamente.',
        special_properties: JSON.stringify({ knowledge_resistance: 10, reroll_resistance_cost: 2 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },
      {
        name: 'Sombria',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'A proteção confunde os sentidos. Você recebe +5 em Furtividade e ignora a penalidade de carga em testes dessa perícia. Além disso, você pode gastar uma ação de movimento e 1 PE para fazer o item adquirir a aparência de uma roupa comum, mas mantendo suas propriedades.',
        special_properties: JSON.stringify({ stealth_bonus: 5, ignore_load_penalty: true, disguise_cost: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },

      // ─── ENERGIA ───
      {
        name: 'Cinética',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'A proteção produz uma barreira invisível que desvia ataques, concedendo +2 em Defesa e resistência a dano 2 (para proteção leve ou escudo) ou 5 (para proteção pesada).',
        special_properties: JSON.stringify({ damage_resistance_light: 2, damage_resistance_heavy: 5 }),
        defense_bonus: 2,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },
      {
        name: 'Lépida',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'A proteção amplifica sua mobilidade, concedendo +10 em testes de Atletismo e +3m de deslocamento. Você pode gastar 2 PE para se mover de forma sobrenatural. Até o final do turno, você ignora terreno difícil, recebe deslocamento de escalada igual a seu deslocamento terrestre e fica imune a dano por queda de até 9m.',
        special_properties: JSON.stringify({ athletics_bonus: 10, movement_bonus: 3, supernatural_movement_cost: 2 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },
      {
        name: 'Voltaica',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'Você recebe resistência a Energia 10 e pode gastar uma ação de movimento e 2 PE para fazer a proteção emitir arcos de Energia até o fim da cena. Se fizer isso, no fim de cada um de seus turnos você causa 2d6 pontos de dano de Energia em todos os seres adjacentes.',
        special_properties: JSON.stringify({ energy_resistance: 10, energy_aura_cost: 2, energy_aura_damage: '2d6' }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },

      // ─── MORTE ───
      {
        name: 'Letárgica',
        category: 2,
        type: 'Maldição',
        element: 'Morte',
        description: 'A proteção desacelera ataques perigosos, concedendo +2 em Defesa. Além disso, você recebe 25% de chance (para proteção leve ou escudo) e 50% de chance (para pesada) de ignorar o dano extra de acertos críticos e ataques furtivos.',
        special_properties: JSON.stringify({ crit_ignore_light: 25, crit_ignore_heavy: 50 }),
        defense_bonus: 2,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },
      {
        name: 'Repulsiva',
        category: 2,
        type: 'Maldição',
        element: 'Morte',
        description: 'Você recebe resistência a Morte 10 e pode gastar uma ação de movimento e 2 PE para cobrir seu corpo com uma camada de Lodo preto até o final da cena. Se fizer isso, qualquer ser que o ataque em corpo a corpo sofre 2d8 pontos de dano de Morte.',
        special_properties: JSON.stringify({ death_resistance: 10, sludge_cost: 2, sludge_damage: '2d8' }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },

      // ─── SANGUE ───
      {
        name: 'Regenerativa',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'A proteção melhora sua capacidade de resistência e regeneração. Você recebe resistência a Sangue 10 e pode gastar uma ação de movimento e 1 PE para recuperar 1d12 pontos de vida.',
        special_properties: JSON.stringify({ blood_resistance: 10, heal_cost: 1, heal_dice: '1d12' }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },
      {
        name: 'Sádica',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'No início de seu turno, você recebe +1 em testes de ataque e rolagens de dano para cada 10 pontos de dano que sofreu desde o fim de seu último turno. Por exemplo, se tiver sofrido 45 pontos de dano, recebe +4 em testes de ataque e rolagens de dano.',
        special_properties: JSON.stringify({ damage_bonus_per_10_taken: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Leve', 'Pesada']),
        created_at: now,
      },

      // ═══════════════════════════════════════════════════════
      // MALDIÇÕES DE ACESSÓRIOS
      // ═══════════════════════════════════════════════════════

      // ─── CONHECIMENTO ───
      {
        name: 'Carisma',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'O acessório gera uma aura que torna você mais carismático e autoconfiante. Você recebe +1 em Presença (este aumento não fornece PE adicionais).',
        special_properties: JSON.stringify({ presence_bonus: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Conjuração',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'O acessório tem um ritual de 1º círculo. Se estiver empunhando o item, você pode conjurar o ritual como se o conhecesse. Caso conheça o ritual, seu custo diminui em –1 PE.',
        special_properties: JSON.stringify({ grants_ritual_circle: 1, pe_discount: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Escudo Mental',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'O acessório gera uma barreira psíquica. Você recebe resistência mental 10.',
        special_properties: JSON.stringify({ mental_resistance: 10 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Reflexão',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'Uma vez por rodada, quando você é alvo de um ritual, pode gastar PE igual ao custo dele para refleti-lo de volta ao seu conjurador. As características do ritual (efeitos, DT…) se mantêm, mas você toma quaisquer decisões exigidas por ele.',
        special_properties: JSON.stringify({ reflect_ritual_per_round: true }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Sagacidade',
        category: 2,
        type: 'Maldição',
        element: 'Conhecimento',
        description: 'Sua mente é acelerada pelo Conhecimento, fornecendo a você +1 em Intelecto (este aumento não fornece perícias e graus de treinamento).',
        special_properties: JSON.stringify({ intellect_bonus: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },

      // ─── ENERGIA ───
      {
        name: 'Defesa (Acessório)',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'Uma barreira de energia invisível gerada por este acessório fornece +5 de Defesa.',
        special_properties: null,
        defense_bonus: 5,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Destreza',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'Este acessório aprimora sua coordenação e velocidade, fornecendo +1 em Agilidade.',
        special_properties: JSON.stringify({ agility_bonus: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Potência',
        category: 2,
        type: 'Maldição',
        element: 'Energia',
        description: 'Este acessório aumenta a DT contra suas habilidades, poderes e rituais em +1.',
        special_properties: JSON.stringify({ dt_bonus: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },

      // ─── MORTE ───
      {
        name: 'Esforço Adicional',
        category: 2,
        type: 'Maldição',
        element: 'Morte',
        description: 'Este acessório fornece +5 PE. Este efeito só se ativa após um dia de uso.',
        special_properties: JSON.stringify({ pe_bonus: 5 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },

      // ─── SANGUE ───
      {
        name: 'Disposição',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'Valendo-se do poder do Sangue, você recebe +1 em Vigor.',
        special_properties: JSON.stringify({ vigor_bonus: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Pujança',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'O acessório aumenta sua potência muscular, fornecendo +1 em Força.',
        special_properties: JSON.stringify({ strength_bonus: 1 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
      {
        name: 'Vitalidade',
        category: 2,
        type: 'Maldição',
        element: 'Sangue',
        description: 'Este acessório fornece +15 PV. Este efeito só se ativa após um dia de uso.',
        special_properties: JSON.stringify({ hp_bonus: 15 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },

      // ─── VARIA ───
      {
        name: 'Proteção Elemental',
        category: 2,
        type: 'Maldição',
        element: 'Varia',
        description: 'Você recebe resistência 10 contra um elemento. Este acessório conta como um item do elemento contra o qual fornece resistência.',
        special_properties: JSON.stringify({ elemental_resistance: 10 }),
        defense_bonus: null,
        protection_type_restriction: JSON.stringify(['Acessório']),
        created_at: now,
      },
    ]

    await db.table('protection_modifications').multiInsert(mods)
    console.log(`✅ ${mods.length} modificações de proteção/acessório inseridas com sucesso!`)
  }
}