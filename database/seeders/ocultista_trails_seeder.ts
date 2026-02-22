import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Trail from '#models/trail'
import TrailProgression from '#models/trail_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const ocultista = await Class.findBy('name', 'Ocultista')
    if (!ocultista) {
      console.log('Classe Ocultista não encontrada!')
      return
    }

    // Define as 5 trilhas de ocultista com suas progressões
    const trails = [
      {
        name: 'Conduíte',
        description: 'Especialista em amplificação e manipulação de rituais.',
        progressions: [
          {
            nex: 10,
            title: 'Ampliar Ritual',
            description:
              'Quando lança um ritual, você pode gastar +2 PE para aumentar seu alcance em um passo (de curto para médio, de médio para longo ou de longo para extremo) ou dobrar sua área de efeito.',
            type: 'FEATURE',
            effects: { pe_cost: 2, range_increase: true, area_doubling: true },
          },
          {
            nex: 40,
            title: 'Acelerar Ritual',
            description:
              'Uma vez por rodada, você pode aumentar o custo de um ritual em 4 PE para conjurá-lo como uma ação livre.',
            type: 'FEATURE',
            effects: { pe_cost: 4, uses_per_round: 1, free_action: true },
          },
          {
            nex: 65,
            title: 'Anular Ritual',
            description:
              'Quando for alvo de um ritual, você pode gastar uma quantidade de PE igual ao custo pago por esse ritual e fazer um teste oposto de Ocultismo contra o conjurador. Se vencer, você anula o ritual, cancelando todos os seus efeitos.',
            type: 'FEATURE',
            effects: { counter_ritual: true, opposed_check: 'Ocultismo' },
          },
          {
            nex: 99,
            title: 'Canalizar o Medo',
            description: 'Você aprende o ritual Canalizar o Medo.',
            type: 'RITUAL_UNLOCK',
            effects: { learns_ritual: 'Canalizar o Medo' },
          },
        ],
      },
      {
        name: 'Flagelador',
        description: 'Especialista em sacrifício e absorção de poder.',
        progressions: [
          {
            nex: 10,
            title: 'Poder do Flagelo',
            description:
              'Ao conjurar um ritual, você pode gastar seus próprios pontos de vida para pagar o custo em pontos de esforço, à taxa de 2 PV por PE pago. Pontos de vida gastos dessa forma só podem ser recuperados com descanso.',
            type: 'FEATURE',
            effects: { hp_as_pe_cost: '2 PV = 1 PE', only_rest_recovery: true },
          },
          {
            nex: 40,
            title: 'Abraçar a Dor',
            description:
              'Sempre que sofrer dano não paranormal, pode gastar uma reação e 2 PE para reduzir esse dano à metade.',
            type: 'FEATURE',
            effects: { pe_cost: 2, damage_reduction: 0.5, applies_to: 'non_paranormal' },
          },
          {
            nex: 65,
            title: 'Absorver Agonia',
            description:
              'Sempre que reduz um ou mais inimigos a 0 PV com um ritual, você recebe uma quantidade de PE temporários igual ao círculo do ritual utilizado. Por exemplo, se ativar esse poder com um ritual de 2º círculo, receberá 2 PE.',
            type: 'FEATURE',
            effects: { temporary_pe_gain: 'ritual_circle', trigger: 'kill_with_ritual' },
          },
          {
            nex: 99,
            title: 'Medo Tangível',
            description: 'Você aprende o ritual Medo Tangível.',
            type: 'RITUAL_UNLOCK',
            effects: { learns_ritual: 'Medo Tangível' },
          },
        ],
      },
      {
        name: 'Graduado',
        description: 'Especialista em conhecimento ritualístico e grimórios.',
        progressions: [
          {
            nex: 10,
            title: 'Saber Ampliado',
            description:
              'Você aprende um ritual de 1º círculo. Toda vez que ganha acesso a um novo círculo, aprende um ritual adicional daquele círculo. Esses rituais não contam no seu limite de rituais.',
            type: 'FEATURE',
            effects: { extra_ritual_on_circle_unlock: true },
          },
          {
            nex: 40,
            title: 'Grimório Ritualístico',
            description:
              'Você cria um grimório especial, que armazena rituais que sua mente não seria capaz de guardar. Você aprende uma quantidade de rituais de 1º ou 2º círculos igual ao seu Intelecto. Quando ganha acesso a um novo círculo, pode incluir um novo ritual desse círculo em seu grimório. Esses rituais não contam em seu limite de rituais conhecidos. Para conjurar um ritual armazenado em seu grimório, você precisa antes empunhar o grimório e gastar uma ação completa o folheando para relembrar o ritual. O grimório ocupa 1 espaço em seu inventário. Se perdê-lo, você pode replicá-lo com duas ações de interlúdio.',
            type: 'FEATURE',
            effects: { grimorio_capacity: 'intelligence', casting_action: 'complete' },
          },
          {
            nex: 65,
            title: 'Rituais Eficientes',
            description: 'A DT para resistir a todos os seus rituais aumenta em +5.',
            type: 'PASSIVE',
            effects: { ritual_dt_bonus: 5 },
          },
          {
            nex: 99,
            title: 'Conhecendo o Medo',
            description: 'Você aprende o ritual Conhecendo o Medo.',
            type: 'RITUAL_UNLOCK',
            effects: { learns_ritual: 'Conhecendo o Medo' },
          },
        ],
      },
      {
        name: 'Intuitivo',
        description: 'Especialista em resistência e presença paranormal.',
        progressions: [
          {
            nex: 10,
            title: 'Mente Sã',
            description:
              'Você compreende melhor as entidades do Outro Lado, e passa a ser menos abalado por seus efeitos. Você recebe resistência paranormal +5 (+5 em testes de resistência contra efeitos paranormais).',
            type: 'PASSIVE',
            effects: { paranormal_resistance: 5 },
          },
          {
            nex: 40,
            title: 'Presença Poderosa',
            description:
              'Sua resiliência mental faz com que você possa extrair mais do Outro Lado. Você adiciona sua Presença ao seu limite de PE por turno, mas apenas para conjurar rituais (não para DT).',
            type: 'PASSIVE',
            effects: { presence_bonus_pe: true, ritual_casting_only: true },
          },
          {
            nex: 65,
            title: 'Inabalável',
            description:
              'Você recebe resistência a dano mental e paranormal 10. Além disso, quando é alvo de um efeito paranormal que permite um teste de Vontade para reduzir o dano à metade, você não sofre dano algum se passar.',
            type: 'PASSIVE',
            effects: { mental_resistance: 10, paranormal_resistance: 10, will_negates_half: true },
          },
          {
            nex: 99,
            title: 'Presença do Medo',
            description: 'Você aprende o ritual Presença do Medo.',
            type: 'RITUAL_UNLOCK',
            effects: { learns_ritual: 'Presença do Medo' },
          },
        ],
      },
      {
        name: 'Lâmina Paranormal',
        description: 'Especialista em combate corpo a corpo com rituais.',
        progressions: [
          {
            nex: 10,
            title: 'Lâmina Maldita',
            description:
              'Você aprende o ritual Amaldiçoar Arma. Se já o conhece, pode gastar +1 PE quando o lança para reduzir seu tempo de conjuração para movimento. Além disso, quando conjura esse ritual, você pode usar Ocultismo, em vez de Luta ou Pontaria, para testes de ataque com a arma amaldiçoada.',
            type: 'FEATURE',
            effects: {
              learns_ritual: 'Amaldiçoar Arma',
              pe_cost: 1,
              use_occultism_for_attacks: true,
            },
          },
          {
            nex: 40,
            title: 'Gladiador Paranormal',
            description:
              'Sempre que acerta um ataque corpo a corpo em um inimigo, você recebe 2 PE temporários. Você pode ganhar um máximo de PE temporários por cena igual ao seu limite de PE. PE temporários desaparecem no final da cena.',
            type: 'PASSIVE',
            effects: { temp_pe_on_hit: 2, trigger: 'melee_hit' },
          },
          {
            nex: 65,
            title: 'Conjuração Marcial',
            description:
              'Uma vez por rodada, quando você lança um ritual com execução de uma ação padrão, pode gastar 2 PE para fazer um ataque corpo a corpo como uma ação livre.',
            type: 'FEATURE',
            effects: { pe_cost: 2, uses_per_round: 1, melee_as_free_action: true },
          },
          {
            nex: 99,
            title: 'Lâmina do Medo',
            description: 'Você aprende o ritual Lâmina do Medo.',
            type: 'RITUAL_UNLOCK',
            effects: { learns_ritual: 'Lâmina do Medo' },
          },
        ],
      },
    ]

    // Create trails and their progressions
    for (const trailData of trails) {
      const trail = await Trail.updateOrCreate(
        { classId: ocultista.id, name: trailData.name },
        {
          classId: ocultista.id,
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
      `✓ Seeded 5 Ocultista trails with ${trails.reduce((acc, t) => acc + t.progressions.length, 0)} total progressions`
    )
  }
}
