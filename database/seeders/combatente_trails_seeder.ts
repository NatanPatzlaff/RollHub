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
      {
        name: 'Monstruoso',
        description:
          'ESPECIAL: Esta trilha usa a “Progressão de NEX” apresentada na regra opcional Nível de Experiência e Nível de Exposição. O personagem recebe todas as alterações apropriadas ao seu NEX descritas na progressão.',
        progressions: [
          {
            nex: 10,
            title: 'Ser Amaldiçoado',
            description:
              'Você se torna treinado em Ocultismo (se já for treinado, em vez disso recebe +2 nessa perícia). Escolha um elemento paranormal. Uma vez por dia, você precisa executar uma etapa ritualística desse elemento para receber bônus:\n' +
              '* SANGUE (Beber sangue humano): Resistência a balístico e Sangue 5 e faro e, quando faz um contra-ataque bem-sucedido, soma seu Vigor na rolagem de dano, mas sofre –O em Ciências e Intuição.\n' +
              '* MORTE (Inalar cinzas de mortos): Resistência a perfuração e Morte 5 e imunidade a fadiga e soma sua Força em seu total de pontos de vida, mas sofre –O em Diplomacia e Enganação.\n' +
              '* CONHECIMENTO (Tatuar palavras que causam medo): Resistência a balístico e Conhecimento 5 e visão no escuro e soma seu Intelecto na Defesa, mas sofre –O em Atletismo e Acrobacia.\n' +
              '* ENERGIA (Receber choques elétricos): Resistência a corte, eletricidade, fogo e Energia 5 e soma sua Agilidade na RD recebida por um bloqueio bem-sucedido, mas sofre –O em Investigação e Percepção.',
            type: 'PASSIVE',
          },
          {
            nex: 40,
            title: 'Ser Macabro',
            description:
              'A resistência a dano aumenta para 10, e a penalidade em perícias aumenta para –2O. Efeitos adicionais:\n' +
              '* SANGUE: Pode usar Força para calcular seus pontos de esforço. Pode gastar uma ação de movimento e 1 ou mais PE (limitado por sua Força) para recuperar 1d8 PV por PE gasto.\n' +
              '* MORTE: Recebe +O em Intimidação e pode usar Vigor para calcular seus pontos de esforço. Morre se iniciar quatro turnos morrendo e não precisa comer/beber para viver.\n' +
              '* CONHECIMENTO: Seu Intelecto aumenta em +1. Pode usar Intelecto para Enganação e para calcular pontos de esforço.\n' +
              '* ENERGIA: Pode usar Agilidade para calcular pontos de esforço. Quando acerta um ataque corpo a corpo, pode gastar 1 ou mais PE (limitado por sua Agilidade) para causar +1d6 de dano de Energia por PE gasto.',
            type: 'PASSIVE',
          },
          {
            nex: 60,
            title: 'Alteração Paranormal Física',
            description:
              'Seu corpo sofre mutações inescapáveis ligadas ao seu elemento.\n' +
              '* SANGUE: Recebe +O em Sobrevivência e se torna imune a calor e frio extremos. Entretanto, não pode mais escolher 10 em testes.\n' +
              '* MORTE: Recebe +O em Iniciativa e Reflexos, mas sofre –O em Diplomacia e Intuição.\n' +
              '* CONHECIMENTO: Você passa a enxergar auras paranormais (efeito básico do ritual Terceiro Olho; se já o conhece, custo reduz em -1 PE). Entretanto, você se torna permanentemente ofuscado.\n' +
              '* ENERGIA: Você pode conjurar Coincidência Forçada (se já conhece, custo -1 PE). No início de cada cena, role 1d6 na tabela de Caos.',
            type: 'PASSIVE',
          },
          {
            nex: 65,
            title: 'Ser Assustador',
            description:
              'A RD elemental aumenta para 15, mas sua Presença é reduzida permanentemente em 1.\n' +
              '* SANGUE: Tem 50% de chance de ignorar dano adicional de acerto crítico ou furtivo. Recebe uma arma natural de mordida (1d8, crítico x2, perfuração). Ao bater com outra arma, pode gastar 1 PE para ataque extra com mordida.\n' +
              '* MORTE: No início de cada turno morrendo, pode fazer um teste de Vigor (DT 15) para acordar com 1 PV. Sempre que faz um acerto crítico ou reduz um inimigo a 0 PV, recupera 2 PE.\n' +
              '* CONHECIMENTO: Pode deixar de ser treinado em uma perícia para receber dados de bônus iguais ao seu Intelecto em testes na cena.\n' +
              '* ENERGIA: RD se aplica a químico. Pode extrair energia de fontes elétricas com ação de movimento para recuperar PE.',
            type: 'FEATURE',
          },
          {
            nex: 75,
            title: 'Alteração e Punição Paranormal',
            description:
              'Você se torna permanentemente perturbado e perde suporte da Ordem.\n' +
              '* SANGUE: Penalidade em perícias aumenta para –2O. Pode conjurar Aprimorar Físico apenas em si mesmo (se já conhece, -1 PE). Sofre –O em Ciências, Medicina e Tecnologia.\n' +
              '* MORTE: Pode conjurar Velocidade Mortal (se já conhece, -1 PE). Penalidade de NEX 60% aumenta para –2O e se aplica também a Enganação e Intimidação.\n' +
              '* CONHECIMENTO: Percebe perigos (efeito básico de Detecção de Ameaças; se já conhece, -1 PE). Penalidade de ofuscado aumenta para –2O.\n' +
              '* ENERGIA: Pode conjurar Tela de Ruído (se já conhece, -1 PE). Voz vibra, comportamento caótico amplifica.',
            type: 'PASSIVE',
          },
          {
            nex: 90,
            title: 'Alteração Extrema',
            description:
              '* SANGUE: Penalidade de NEX 75% aumenta para –2O. Pode conjurar Forma Monstruosa (se já conhece, -1 PE). Pode gastar +2 PE para eliminar as penalidades temporariamente.\n' +
              '* MORTE: Não pode mais ser surpreendido e sabe o que todos com Iniciativa menor vão fazer. Perde 3 PE na 1ª interação social.\n' +
              '* CONHECIMENTO: Quando não está no escuro, em vez de ofuscado fica cego. Pode conjurar Vidência sem superfície reflexiva (se já conhece, -1 PE).\n' +
              '* ENERGIA: Pode conjurar Salto Fantasma (se já conhece, -1 PE). Não precisa falar para rituais e DT para resistir aumenta em +2 se digitar em dispositivo.',
            type: 'PASSIVE',
          },
          {
            nex: 99,
            title: 'Ser Aterrorizante',
            description:
              'RD elemental aumenta para 20. Efeitos ritualísticos permanentes. Você é uma criatura paranormal. Sanidade reduzida a 1.\n' +
              '* SANGUE: Intelecto –1, Força +1. Mordida recupera 5 PV. Aprende Forma Monstruosa.\n' +
              '* MORTE: Presença –1, Vigor +1. Imunidade a Morte e imortal. Aprende Fim Inevitável.\n' +
              '* CONHECIMENTO: Força –1, Intelecto +1. Percepção às Cegas e aprende ritual de 4º círculo de Conhecimento.\n' +
              '* ENERGIA: Força –1, Agilidade +1. Paira a 1,5m, deslocamento 12m. Imune a agarrado/enredado. Aprende Deflagração de Energia.',
            type: 'PASSIVE',
          },
        ],
      },
      {
        name: 'Agente Secreto',
        description:
          'Indivíduos treinados para trabalhar sozinhos ou em pequenos grupos, operando de forma discreta, com documentos falsos e lábia afiada.',
        progressions: [
          {
            nex: 10,
            title: 'Carteirada',
            description:
              'Escolha Diplomacia ou Enganação para treinar (ou +2 se já treinado). Recebe documentos que fornecem privilégios jurídicos especiais, não ocupam espaço.',
            type: 'PASSIVE',
          },
          {
            nex: 40,
            title: 'O Sorriso',
            description:
              'Recebe +2 em Diplomacia e Enganação. Quando falha numa dessas, gaste 2 PE para rolar de novo e deve aceitar o novo resultado. Uma vez por cena, teste Diplomacia para acalmar a si mesmo.',
            type: 'FEATURE',
            effects: { pe_cost: 2, reroll: ['Diplomacia', 'Enganação'] },
          },
          {
            nex: 65,
            title: 'Método Investigativo',
            description:
              'A urgência de qualquer cena de investigação aumenta 1 rodada. Pode gastar 2 PE (cumulativo) para transformar um evento de investigação em "sem evento".',
            type: 'FEATURE',
            effects: { pe_cost: 2 },
          },
          {
            nex: 99,
            title: 'Multifacetado',
            description:
              'Uma vez por missão, gaste 5 de Sanidade para receber todas as habilidades de NEX até 65% de uma trilha de combatente ou especialista à sua escolha até o fim da cena.',
            type: 'FEATURE',
            effects: { sanity_cost: 5 },
          },
        ],
      },
      {
        name: 'Caçador',
        description:
          'Especialista em reunir informações, rastrear e extermimar criaturas do Outro Lado utilizando suas próprias fraquezas.',
        progressions: [
          {
            nex: 10,
            title: 'Rastrear o Paranormal',
            description:
              'Torna-se treinado em Sobrevivência. Pode usar essa perícia no lugar de Ocultismo para identificar criaturas, e no lugar de Investigação e Percepção para encontrar rastros de traços paranormais.',
            type: 'PASSIVE',
          },
          {
            nex: 40,
            title: 'Estudar Fraquezas',
            description:
              'Em interlúdio, caso tenha uma pista da criatura, ganhe uma informação útil +1 em perícias contra o alvo específico.',
            type: 'FEATURE',
          },
          {
            nex: 65,
            title: 'Atacar das Sombras',
            description:
              'Não sofre penalidade de Furtividade por mover deslocamento normal. Armas silenciosas reduzem a penalidade de Furtividade para -O ao bater. Visibilidade inicial sempre 1 ponto abaixo.',
            type: 'PASSIVE',
          },
          {
            nex: 99,
            title: 'Estudar a Presa',
            description:
              'Transforma o ser alvo do Estudar Fraquezas em sua "presa". Ganha +O em perícias, +1 na margem de ameaça e multiplicador de crítico, além de RD 5 contra a presa.',
            type: 'FEATURE',
            effects: { threat_range: 1, critical_multiplier_bonus: 1, damage_reduction: 5 },
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
      `✓ Seeded ${trails.length} Combatente trails with ${trails.reduce((acc, t) => acc + t.progressions.length, 0)} total progressions`
    )
  }
}
