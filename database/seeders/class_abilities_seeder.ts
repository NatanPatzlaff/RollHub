import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const combatente = await Class.findBy('name', 'Combatente')
    if (!combatente) {
      console.log('Classe Combatente não encontrada!')
      return
    }

    const combatenteAbilities = [
      {
        name: 'Armamento Pesado',
        description: 'Você recebe proficiência com armas pesadas.',
        effects: { prerequisite: 'For 2', nex: '15%' },
      },
      {
        name: 'Artista Marcial',
        description:
          'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
        effects: { prerequisite: 'Nenhum', nex: '15%', upgrades: '35%, 70%' },
      },
      {
        name: 'Ataque de Oportunidade',
        description:
          'Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Combater com Duas Armas',
        description:
          'Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –2d em todos os testes de ataque até o seu próximo turno.',
        effects: { prerequisite: 'Agi 3, treinado em Luta ou Pontaria', nex: '15%' },
      },
      {
        name: 'Combate Defensivo',
        description:
          'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –2d em todos os testes de ataque, mas recebe +5 na Defesa.',
        effects: { prerequisite: 'Int 2', nex: '15%' },
      },
      {
        name: 'Golpe Demolidor',
        description:
          'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma.',
        effects: { prerequisite: 'For 2, treinado em Luta', nex: '15%' },
      },
      {
        name: 'Golpe Pesado',
        description:
          'Enquanto estiver empunhando uma arma corpo a corpo, o dano dela aumenta em mais um dado do mesmo tipo.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Incansável',
        description:
          'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Presteza Atlética',
        description:
          'Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +1d no teste.',
        effects: { prerequisite: 'Nenhum', nex: '15%' },
      },
      {
        name: 'Proteção Pesada',
        description: 'Você recebe proficiência com Proteções Pesadas.',
        effects: { prerequisite: 'NEX 30%', nex: '30%' },
      },
      {
        name: 'Reflexos Defensivos',
        description: 'Você recebe +2 em Defesa e em testes de resistência.',
        effects: { prerequisite: 'Agi 2', nex: '15%' },
      },
      {
        name: 'Saque Rápido',
        description:
          'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre.',
        effects: { prerequisite: 'treinado em Iniciativa', nex: '15%' },
      },
      {
        name: 'Segurar o Gatilho',
        description:
          'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou atingir o limite de seus PE por rodada.',
        effects: { prerequisite: 'NEX 60%', nex: '60%' },
      },
      {
        name: 'Sentido Tático',
        description:
          'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena.',
        effects: { prerequisite: 'Int 2, treinado em Percepção e Tática', nex: '15%' },
      },
      {
        name: 'Tanque de Guerra',
        description:
          'Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2.',
        effects: { prerequisite: 'Proteção Pesada', nex: '15%' },
      },
      {
        name: 'Tiro Certeiro',
        description:
          'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar).',
        effects: { prerequisite: 'treinado em Pontaria', nex: '15%' },
      },
      {
        name: 'Tiro de Cobertura',
        description:
          'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. A critério do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este é um efeito de medo.',
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

    for (const ability of combatenteAbilities) {
      await ClassAbility.updateOrCreate(
        { classId: combatente.id, name: ability.name },
        {
          classId: combatente.id,
          name: ability.name,
          description: ability.description,
          effects: ability.effects,
        }
      )
    }

    console.log(`✓ Seeded ${combatenteAbilities.length} Combatente class abilities`)
  }
}
