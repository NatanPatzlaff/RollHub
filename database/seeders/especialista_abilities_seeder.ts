import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const especialista = await Class.findBy('name', 'Especialista')
    if (!especialista) {
      console.log('Classe Especialista não encontrada!')
      return
    }

    const especialistaAbilities = [
      {
        name: 'Artista Marcial',
        description:
          'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
        effects: { prerequisite: 'Nenhum', nex: '15%', upgrades: '35%, 70%' },
      },
      {
        name: 'Balística Avançada',
        description:
          'Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com armas de fogo.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Conhecimento Aplicado',
        description:
          'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int.',
        effects: { prerequisite: 'Int 2', nex: '15%', pe_cost: 2 },
      },
      {
        name: 'Hacker',
        description:
          'Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa.',
        effects: { prerequisite: 'treinado em Tecnologia', nex: '15%' },
      },
      {
        name: 'Mãos Rápidas',
        description:
          'Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre.',
        effects: { prerequisite: 'Agi 3, treinado em Crime', nex: '15%', pe_cost: 1 },
      },
      {
        name: 'Mochila de Utilidades',
        description:
          'Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Movimento Tático',
        description:
          'Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno.',
        effects: { prerequisite: 'treinado em Atletismo', nex: '15%', pe_cost: 1 },
      },
      {
        name: 'Na Trilha Certa',
        description:
          'Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +1d20 no próximo teste. Os custos e os bônus são cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +2d20 no próximo teste, e assim por diante).',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_cost: 1 },
      },
      {
        name: 'Nerd',
        description:
          'Você é um repositório de conhecimento útil (e inútil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (se for uma investigação, uma dica para uma pista; se for um combate, uma fraqueza de um inimigo, e assim por diante). A fonte da informação pode ser desde um livro antigo que você leu na biblioteca até um episódio de sua série de ficção favorita.',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_cost: 2, uses_per_scene: 1 },
      },
      {
        name: 'Ninja Urbano',
        description:
          'Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com essas armas.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Pensamento Ágil',
        description:
          'Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_cost: 2, uses_per_round: 1 },
      },
      {
        name: 'Perito em Explosivos',
        description:
          'Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Primeira Impressão',
        description:
          'Você recebe +1d20 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Transcender',
        description:
          'Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
        effects: { prerequisite: 'Nenhum', nex: '15%', repeatable: true },
      },
      {
        name: 'Treinamento em Perícia',
        description:
          'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
        effects: { prerequisite: 'Nenhum', nex: '15%', repeatable: true, upgrades: '35%, 70%' },
      },
    ]

    for (const ability of especialistaAbilities) {
      await ClassAbility.updateOrCreate(
        { classId: especialista.id, name: ability.name },
        {
          classId: especialista.id,
          name: ability.name,
          description: ability.description,
          effects: ability.effects,
        }
      )
    }

    console.log(`✓ Seeded ${especialistaAbilities.length} Especialista class abilities`)
  }
}
