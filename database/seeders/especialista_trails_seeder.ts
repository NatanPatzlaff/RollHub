import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Trail from '#models/trail'
import TrailProgression from '#models/trail_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const especialista = await Class.findBy('name', 'Especialista')
    if (!especialista) {
      console.log('Classe Especialista não encontrada!')
      return
    }

    // Define as 5 trilhas de especialista com suas progressões
    const trails = [
      {
        name: 'Atirador de Elite',
        description: 'Especialista em combate à distância com armas de fogo.',
        progressions: [
          {
            nex: 10,
            title: 'Mira de Elite',
            description:
              'Você recebe proficiência com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas.',
            type: 'PASSIVE',
            effects: { intelligence_damage_bonus: true },
          },
          {
            nex: 40,
            title: 'Disparo Letal',
            description:
              'Quando faz a ação mirar, você pode gastar 1 PE para aumentar em +2 a margem de ameaça do próximo ataque que fizer até o final de seu próximo turno.',
            type: 'FEATURE',
            effects: { pe_cost: 1, threat_range_bonus: 2, trigger: 'aim' },
          },
          {
            nex: 65,
            title: 'Disparo Impactante',
            description:
              'Quando ataca com uma arma de fogo, você pode gastar 2 PE e, em vez de causar dano, fazer uma manobra entre derrubar, desarmar, empurrar ou quebrar.',
            type: 'FEATURE',
            effects: {
              pe_cost: 2,
              trigger: 'attack',
              maneuvers: ['derrubar', 'desarmar', 'empurrar', 'quebrar'],
            },
          },
          {
            nex: 99,
            title: 'Atirar para Matar',
            description:
              'Quando faz um acerto crítico com uma arma de fogo, você causa dano máximo, sem precisar rolar dados.',
            type: 'PASSIVE',
            effects: { critical_max_damage: true },
          },
        ],
      },
      {
        name: 'Infiltrador',
        description: 'Mestre em furtividade, roubo e assassinato.',
        progressions: [
          {
            nex: 10,
            title: 'Ataque Furtivo',
            description:
              'Você sabe atingir os pontos vitais de um inimigo distraído. Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +1d6 pontos de dano do mesmo tipo da arma. Em NEX 40% o dano adicional aumenta para +2d6, em NEX 65% aumenta para +3d6 e em NEX 99% aumenta para +4d6.',
            type: 'FEATURE',
            effects: {
              pe_cost: 1,
              bonus_damage: '1d6',
              uses_per_round: 1,
              trigger: 'unaware_or_flanking',
            },
          },
          {
            nex: 40,
            title: 'Gatuno',
            description:
              'Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade.',
            type: 'PASSIVE',
            effects: { athletics_bonus: 5, crime_bonus: 5, stealth_movement: 'no_penalty' },
          },
          {
            nex: 65,
            title: 'Assassinar',
            description:
              'Você pode gastar uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo que causar dano a ele tem seus dados de dano extras dessa habilidade dobrados. Além disso, se sofrer dano de seu ataque, o alvo fica inconsciente ou morrendo, à sua escolha (Fortitude DT Agi evita).',
            type: 'FEATURE',
            effects: {
              pe_cost: 3,
              range: 'curto',
              sneak_attack_damage_doubled: true,
              damage_type: 'lethal',
            },
          },
          {
            nex: 99,
            title: 'Sombra Fugaz',
            description:
              'Quando faz um teste de Furtividade após atacar ou fazer outra ação chamativa, você pode gastar 3 PE para não sofrer a penalidade de –3d20 no teste.',
            type: 'FEATURE',
            effects: { pe_cost: 3, eliminates_stealth_penalty: true },
          },
        ],
      },
      {
        name: 'Médico de Campo',
        description: 'Especialista em cura e resgate tático.',
        progressions: [
          {
            nex: 10,
            title: 'Paramédico',
            description:
              'Você pode usar uma ação padrão e 2 PE para curar 2d10 pontos de vida de si mesmo ou de um aliado adjacente. Você pode curar +1d10 PV respectivamente em NEX 40%, 65% e 99%, gastando +1 PE por dado adicional de cura.',
            type: 'FEATURE',
            effects: { pe_cost: 2, heal_dice: '2d10', range: 'adjacente' },
          },
          {
            nex: 40,
            title: 'Equipe de Trauma',
            description:
              'Você pode usar uma ação padrão e 2 PE para remover uma condição negativa (exceto morrendo) de um aliado adjacente.',
            type: 'FEATURE',
            effects: { pe_cost: 2, range: 'adjacente', removes_condition: true },
          },
          {
            nex: 65,
            title: 'Resgate',
            description:
              'Uma vez por rodada, se estiver em alcance curto de um aliado machucado ou morrendo, você pode se aproximar do aliado com uma ação livre (desde que seja capaz de fazê-lo usando seu deslocamento normal). Além disso, sempre que curar PV ou remover condições do aliado, você e o aliado recebem +5 na Defesa até o início de seu próximo turno. Por fim, para você, o total de espaços ocupados por carregar um personagem é reduzido pela metade.',
            type: 'FEATURE',
            effects: {
              uses_per_round: 1,
              approach_cost: 'free_action',
              defense_bonus: 5,
              carrying_capacity_reduced: 0.5,
            },
          },
          {
            nex: 99,
            title: 'Reanimação',
            description:
              'Uma vez por cena, você pode gastar uma ação completa e 10 PE para trazer de volta à vida um personagem que tenha morrido na mesma cena (exceto morte por dano massivo).',
            type: 'FEATURE',
            effects: { pe_cost: 10, uses_per_scene: 1, revive: true },
          },
        ],
      },
      {
        name: 'Negociador',
        description: 'Mestre em persuasão e manipulação social.',
        progressions: [
          {
            nex: 10,
            title: 'Eloquência',
            description:
              'Você pode usar uma ação completa e 1 PE por alvo em alcance curto para afetar outras pessoas com sua fala. Faça um teste de Diplomacia, Enganação ou Intimidação contra a Vontade dos alvos. Se você vencer, os alvos ficam fascinados enquanto você se concentrar (uma ação padrão por rodada). Um alvo hostil ou que esteja envolvido em combate recebe +5 em seu teste de resistência e tem direito a um novo teste por rodada, sempre que você se concentrar. Uma pessoa que passar no teste fica imune a este efeito por um dia.',
            type: 'FEATURE',
            effects: {
              pe_cost: '1 por alvo',
              skills: ['Diplomacia', 'Enganação', 'Intimidação'],
              hostile_resistance_bonus: 5,
            },
          },
          {
            nex: 40,
            title: 'Discurso Motivador',
            description:
              'Você pode gastar uma ação padrão e 4 PE para inspirar seus aliados com suas palavras. Você e todos os seus aliados em alcance curto ganham +1d20 em testes de perícia até o fim da cena. A partir de NEX 65%, você pode gastar 8 PE para fornecer um bônus total de +2d20.',
            type: 'FEATURE',
            effects: { pe_cost: 4, range: 'curto', skill_bonus: '1d20', duration: 'scene' },
          },
          {
            nex: 65,
            title: 'Eu Conheço um Cara',
            description:
              'Uma vez por missão, você pode ativar sua rede de contatos para pedir um favor, como por exemplo trocar todo o equipamento do seu grupo (como se tivesse uma segunda fase de preparação de missão), conseguir um local de descanso ou mesmo ser resgatado de uma cena. O mestre tem a palavra final de quando é possível usar essa habilidade e quais favores podem ser obtidos.',
            type: 'FEATURE',
            effects: { uses_per_mission: 1, contacts: ['equipment_swap', 'rest', 'rescue'] },
          },
          {
            nex: 99,
            title: 'Truque de Mestre',
            description:
              'Acostumado a uma vida de fingimento e manipulação, você pode gastar 5 PE para simular o efeito de qualquer habilidade que você tenha visto um de seus aliados usar durante a cena. Você ignora os pré-requisitos da habilidade, mas ainda precisa pagar todos os seus custos, incluindo ações, PE e materiais, e ela usa os seus parâmetros de jogo, como se você estivesse usando a habilidade em questão.',
            type: 'FEATURE',
            effects: { pe_cost: 5, mimic_ally_ability: true, costs_still_apply: true },
          },
        ],
      },
      {
        name: 'Técnico',
        description: 'Especialista em equipamento, reparo e improviso.',
        progressions: [
          {
            nex: 10,
            title: 'Inventário Otimizado',
            description:
              'Você soma seu Intelecto à sua Força para calcular sua capacidade de carga. Por exemplo, se você tem Força 1 e Intelecto 3, seu inventário tem 20 espaços.',
            type: 'PASSIVE',
            effects: { strength_and_intelligence: 'carrying_capacity' },
          },
          {
            nex: 40,
            title: 'Remendão',
            description:
              'Você pode gastar uma ação completa e 1 PE para remover a condição quebrado de um equipamento adjacente até o final da cena. Além disso, qualquer equipamento geral tem sua categoria reduzida em I para você.',
            type: 'FEATURE',
            effects: {
              pe_cost: 1,
              removes_broken_condition: true,
              equipment_category_reduction: 1,
            },
          },
          {
            nex: 65,
            title: 'Improvisar',
            description:
              'Você pode improvisar equipamentos com materiais ao seu redor. Escolha um equipamento geral e gaste uma ação completa e 2 PE, mais 2 PE por categoria do item escolhido. Você cria uma versão funcional do equipamento, que segue suas regras de espaço e categoria como normal. Ao final da cena, seu equipamento improvisado se torna inútil.',
            type: 'FEATURE',
            effects: { pe_cost: '2 + 2 por categoria', create_temporary_equipment: true },
          },
          {
            nex: 99,
            title: 'Preparado para Tudo',
            description:
              'Você sempre tem o que precisa para qualquer situação. Sempre que precisar de um item qualquer (exceto armas), pode gastar uma ação de movimento e 3 PE por categoria do item para lembrar que colocou ele no fundo da bolsa! Depois de encontrado, o item segue normalmente as regras de inventário.',
            type: 'FEATURE',
            effects: { pe_cost: '3 por categoria', find_item: true, excluded: ['armas'] },
          },
        ],
      },
    ]

    // Create trails and their progressions
    for (const trailData of trails) {
      const trail = await Trail.updateOrCreate(
        { classId: especialista.id, name: trailData.name },
        {
          classId: especialista.id,
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
      `✓ Seeded 5 Especialista trails with ${trails.reduce((acc, t) => acc + t.progressions.length, 0)} total progressions`
    )
  }
}
