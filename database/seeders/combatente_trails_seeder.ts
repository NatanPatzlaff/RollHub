import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Trail from '#models/trail'
import TrailProgression from '#models/trail_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const combatente = await Class.findBy('name', 'Combatente')
    if (!combatente) {
      console.log('Classe Combatente não encontrada!')
      return
    }

    // Define as 5 trilhas de combatente com suas progressões
    const trails = [
      {
        name: 'Aniquilador',
        description: 'Focado em especialização extrema com uma arma favorita.',
        progressions: [
          {
            nex: 10,
            title: 'A Favorita',
            description:
              'Escolha uma arma para ser sua favorita, como katana ou fuzil de assalto. A categoria da arma escolhida é reduzida em I.',
            type: 'FEATURE',
          },
          {
            nex: 40,
            title: 'Técnica Secreta',
            description:
              'A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional. Amplo: O ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos). Destruidor: Aumenta o multiplicador de crítico da arma em +1.',
            type: 'FEATURE',
            effects: { pe_cost: 2 },
          },
          {
            nex: 65,
            title: 'Técnica Sublime',
            description:
              'Você adiciona os seguintes efeitos à lista de sua Técnica Secreta: Letal: Aumenta a margem de ameaça em +2. Você pode escolher este efeito duas vezes para aumentar a margem de ameaça em +5. Perfurante: Ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.',
            type: 'FEATURE',
          },
          {
            nex: 99,
            title: 'Máquina de Matar',
            description:
              'A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.',
            type: 'FEATURE',
            effects: { threat_range: 2, category_reduction: 3, damage_bonus: '1d' },
          },
        ],
      },
      {
        name: 'Comandante de Campo',
        description: 'Focado em liderança, coordenação e auxílio aos aliados no campo de batalha.',
        progressions: [
          {
            nex: 10,
            title: 'Inspirar Confiança',
            description:
              'Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado.',
            type: 'FEATURE',
            effects: { pe_cost: 2, range: 'curto' },
          },
          {
            nex: 40,
            title: 'Estrategista',
            description:
              'Você pode direcionar aliados em alcance curto. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.',
            type: 'FEATURE',
            effects: { pe_cost: '1 por aliado', range: 'curto' },
          },
          {
            nex: 65,
            title: 'Brecha na Guarda',
            description:
              'Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance curto, você pode gastar uma reação e 2 PE para que você ou outro aliado em alcance curto faça um ataque adicional contra o mesmo inimigo. Além disso, o alcance de Inspirar Confiança e Estrategista aumenta para médio.',
            type: 'FEATURE',
            effects: { pe_cost: 2, range: 'médio', uses_per_round: 1 },
          },
          {
            nex: 99,
            title: 'Oficial Comandante',
            description:
              'Você pode gastar uma ação padrão e 5 PE para que cada aliado que você possa ver em alcance médio receba uma ação padrão adicional no próximo turno dele.',
            type: 'FEATURE',
            effects: { pe_cost: 5, range: 'médio' },
          },
        ],
      },
      {
        name: 'Guerreiro',
        description:
          'Especialista em combate corpo a corpo, transformando a força bruta em uma técnica letal.',
        progressions: [
          {
            nex: 10,
            title: 'Técnica Letal',
            description:
              'Você recebe um aumento de +2 na margem de ameaça com todos os seus ataques corpo a corpo.',
            type: 'PASSIVE',
            effects: { threat_range: 2 },
          },
          {
            nex: 40,
            title: 'Revidar',
            description:
              'Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.',
            type: 'FEATURE',
            effects: { pe_cost: 2, trigger: 'block' },
          },
          {
            nex: 65,
            title: 'Força Opressora',
            description:
              'Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caído.',
            type: 'FEATURE',
            effects: { pe_cost: 1, trigger: 'hit' },
          },
          {
            nex: 99,
            title: 'Potência Máxima',
            description:
              'Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.',
            type: 'FEATURE',
            effects: { doubling: 'all_bonuses', applies_to: 'special_attacks' },
          },
        ],
      },
      {
        name: 'Operações Especiais',
        description: 'Mestre em mobilidade e economia de ação, agindo de forma rápida e calculada.',
        progressions: [
          {
            nex: 10,
            title: 'Iniciativa Aprimorada',
            description:
              'Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.',
            type: 'PASSIVE',
            effects: { initiative_bonus: 5 },
          },
          {
            nex: 40,
            title: 'Ataque Extra',
            description:
              'Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.',
            type: 'FEATURE',
            effects: { pe_cost: 2, uses_per_round: 1, trigger: 'attack' },
          },
          {
            nex: 65,
            title: 'Surto de Adrenalina',
            description:
              'Uma vez por rodada, você pode gastar 5 PE para realizar uma ação padrão ou de movimento adicional.',
            type: 'FEATURE',
            effects: { pe_cost: 5, uses_per_round: 1 },
          },
          {
            nex: 99,
            title: 'Sempre Alerta',
            description: 'Você recebe uma ação padrão adicional no início de cada cena de combate.',
            type: 'PASSIVE',
            effects: { extra_standard_action: 'combat_start' },
          },
        ],
      },
      {
        name: 'Tropa de Choque',
        description:
          'O "tanque" do grupo, focado em alta resistência física e proteção de aliados.',
        progressions: [
          {
            nex: 10,
            title: 'Casca Grossa',
            description:
              'Você recebe +1 PV para cada 5% de NEX e, quando faz um bloqueio, soma seu Vigor na resistência a dano recebida.',
            type: 'PASSIVE',
            effects: { hp_per_nex: '1 por 5%', vigor_bonus: 'block' },
          },
          {
            nex: 40,
            title: 'Cai Dentro',
            description:
              'Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado. Este poder só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque (por exemplo, adjacente a um oponente atacando em corpo a corpo ou dentro do alcance de uma arma de ataque à distância). Um oponente que passe no teste de Vontade não pode ser afetado por seu poder Cai Dentro até o final da cena.',
            type: 'FEATURE',
            effects: { pe_cost: 1, range: 'curto', trigger: 'ally_attacked' },
          },
          {
            nex: 65,
            title: 'Duro de Matar',
            description:
              'Ao sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, você pode usar esta habilidade para reduzir dano paranormal.',
            type: 'FEATURE',
            effects: { pe_cost: 2, damage_reduction: 0.5, applies_to: 'non_paranormal' },
          },
          {
            nex: 99,
            title: 'Inquebrável',
            description:
              'Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5. Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações (seguindo as regras normais de morte).',
            type: 'PASSIVE',
            effects: { wounded_defense: 5, wounded_resistance: 5, dying_special: true },
          },
        ],
      },
    ]

    // Create trails and their progressions
    for (const trailData of trails) {
      const trail = await Trail.updateOrCreate(
        { classId: combatente.id, name: trailData.name },
        {
          classId: combatente.id,
          name: trailData.name,
          description: trailData.description,
        }
      )

      for (const progression of trailData.progressions) {
        await TrailProgression.updateOrCreate(
          { trailId: trail.id, nex: progression.nex, title: progression.title },
          {
            trailId: trail.id,
            nex: progression.nex,
            title: progression.title,
            description: progression.description,
            type: progression.type,
            effects: progression.effects || null,
          }
        )
      }
    }

    console.log(
      `✓ Seeded 5 Combatente trails with ${trails.reduce((acc, t) => acc + t.progressions.length, 0)} total progressions`
    )
  }
}
