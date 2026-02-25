import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const ocultista = await Class.findBy('name', 'Ocultista')
    if (!ocultista) {
      console.log('Classe Ocultista não encontrada!')
      return
    }

    const ocultstaAbilities = [
      {
        name: 'Camuflar Ocultismo',
        description:
          'Você pode gastar uma ação livre para esconder símbolos e sigilos que estejam desenhados ou gravados em objetos ou em sua pele, tornando-os invisíveis para outras pessoas além de você mesmo. Além disso, quando lança um ritual, pode gastar +2 PE para lançá-lo sem usar componentes ritualísticos e sem gesticular (o que permite conjurar um ritual com as mãos presas), usando apenas concentração. Outros seres só perceberão que você lançou um ritual se passarem num teste de Ocultismo (DT 25).',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_cost: 2 },
      },
      {
        name: 'Criar Selo',
        description:
          'Você sabe fabricar selos paranormais de rituais que conheça. Fabricar um selo gasta uma ação de interlúdio e um número de PE iguais ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados ao mesmo tempo igual à sua Presença.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Envolto em Mistério',
        description:
          'Sua aparência e postura assombrosas o permitem manipular e assustar pessoas ignorantes ou supersticiosas. O mestre define o que exatamente você pode fazer e quem se encaixa nessa descrição. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo.',
        effects: { prerequisite: 'Nenhum', nex: '15%', bonus: 5 },
      },
      {
        name: 'Especialista em Elemento',
        description:
          'Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2.',
        effects: { prerequisite: 'Nenhum', nex: '15%', dt_bonus: 2 },
      },
      {
        name: 'Ferramentas Paranormais',
        description:
          'Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Fluxo de Poder',
        description:
          'Você pode manter dois efeitos sustentados de rituais ativos ao mesmo tempo com uma ação livre, pagando o custo de cada efeito separadamente.',
        effects: { prerequisite: 'NEX 60%', nex: '60%' },
      },
      {
        name: 'Guiado pelo Paranormal',
        description:
          'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional.',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_cost: 2, uses_per_scene: 1 },
      },
      {
        name: 'Identificação Paranormal',
        description:
          'Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais.',
        effects: { prerequisite: 'Nenhum', nex: '15%', bonus: 10 },
      },
      {
        name: 'Improvisar Componentes',
        description:
          'Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual.',
        effects: { prerequisite: 'Nenhum', nex: '15%', uses_per_scene: 1 },
      },
      {
        name: 'Intuição Paranormal',
        description:
          'Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha).',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Mestre em Elemento',
        description:
          'Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE.',
        effects: {
          prerequisite: 'Especialista em Elemento no elemento escolhido, NEX 45%',
          nex: '45%',
          pe_reduction: 1,
        },
      },
      {
        name: 'Ritual Potente',
        description:
          'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais.',
        effects: { prerequisite: 'Int 2', nex: '15%' },
      },
      {
        name: 'Ritual Predileto',
        description:
          'Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes.',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_reduction: 1 },
      },
      {
        name: 'Tatuagem Ritualística',
        description:
          'Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo.',
        effects: { prerequisite: 'Nenhum', nex: '15%', pe_reduction: 1 },
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

    for (const ability of ocultstaAbilities) {
      await ClassAbility.updateOrCreate(
        { classId: ocultista.id, name: ability.name },
        {
          classId: ocultista.id,
          name: ability.name,
          description: ability.description,
          effects: ability.effects,
        }
      )
    }

    console.log(`✓ Seeded ${ocultstaAbilities.length} Ocultista class abilities`)
  }
}
