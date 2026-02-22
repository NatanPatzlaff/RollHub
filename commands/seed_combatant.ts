import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class SeedCombatant extends BaseCommand {
  static commandName = 'seed:combatant'
  static description = 'Seed Combatant class, trails and abilities from PDF'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Seeding Combatant data...')

    try {
      // Use db.transaction() directly
      await db.transaction(async (trx) => {
        // 1. Create Class
        let classId: number
        const existingClass = await trx.from('classes').where('name', 'Combatente').first()

        if (existingClass) {
          classId = existingClass.id
          this.logger.info(`Class Combatente already exists (ID: ${classId})`)
        } else {
          const [id] = await trx.table('classes').insert({
            name: 'Combatente',
            description:
              'Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente.',
            created_at: new Date(),
            updated_at: new Date(),
          })
          classId = id
          this.logger.info(`Created class Combatente (ID: ${classId})`)
        }

        // 2. Class Progression
        const progressions = [
          {
            nex: 5,
            title: 'Ataque Especial',
            description:
              'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5 (veja a Tabela 1.3). Você pode aplicar cada bônus de +5 em ataque ou dano. Por exemplo, em NEX 55%, você pode gastar 4 PE para receber +5 no teste de ataque e +10 na rolagem de dano.',
            type: 'ABILITY',
          },
          {
            nex: 10,
            title: 'Habilidade de Trilha',
            description:
              'Em NEX 10% você escolhe uma das trilhas de combatente e recebe o primeiro poder da trilha escolhida. Você recebe um novo poder da trilha escolhida em NEX 40%, 65% e 99%.',
            type: 'TRAIL_FEATURE',
          },
          {
            nex: 15,
            title: 'Poder de Combatente',
            description:
              'Em NEX 15%, você recebe um poder de combatente à sua escolha. Você recebe um novo poder de combatente em NEX 30% e a cada 15% de NEX subsequentes, conforme indicado na tabela.',
            type: 'POWER_SLOT',
          },
          {
            nex: 20,
            title: 'Aumento de Atributo',
            description: 'Você pode aumentar um atributo em +1 (limite 5).',
            type: 'ATTRIBUTE_BUFF',
          },
          {
            nex: 25,
            title: 'Ataque Especial (+10)',
            description:
              'Bônus aumenta para +10. Custo total 3 PE. Você pode aplicar cada bônus de +5 em ataque ou dano.',
            type: 'ABILITY_UPGRADE',
          },
          {
            nex: 30,
            title: 'Poder de Combatente',
            description: 'Em NEX 30%, você recebe um poder de combatente à sua escolha.',
            type: 'POWER_SLOT',
          },
          {
            nex: 30,
            title: 'Proteção Pesada',
            description: 'Recebe proficiência com Proteções Pesadas.',
            type: 'PROFICIENCY',
          },
          {
            nex: 35,
            title: 'Grau de Treinamento',
            description: 'Escolha pericias para aumentar grau de treinamento.',
            type: 'FEATURE',
          },
          {
            nex: 40,
            title: 'Habilidade de Trilha',
            description: 'Recebe o poder de NEX 40% da trilha escolhida.',
            type: 'TRAIL_FEATURE',
          },
          {
            nex: 45,
            title: 'Poder de Combatente',
            description: 'Em NEX 45%, você recebe um poder de combatente à sua escolha.',
            type: 'POWER_SLOT',
          },
          {
            nex: 50,
            title: 'Aumento de Atributo',
            description: 'Você pode aumentar um atributo em +1 (limite 5).',
            type: 'ATTRIBUTE_BUFF',
          },
          {
            nex: 50,
            title: 'Versatilidade',
            description: 'Escolha um poder de outra trilha ou poder de combatente.',
            type: 'FEATURE',
          },
          {
            nex: 55,
            title: 'Ataque Especial (+15)',
            description:
              'Bônus aumenta para +15. Custo total 4 PE. Você pode aplicar cada bônus de +5 em ataque ou dano.',
            type: 'ABILITY_UPGRADE',
          },
          {
            nex: 60,
            title: 'Poder de Combatente',
            description: 'Em NEX 60%, você recebe um poder de combatente à sua escolha.',
            type: 'POWER_SLOT',
          },
          {
            nex: 65,
            title: 'Habilidade de Trilha',
            description: 'Recebe o poder de NEX 65% da trilha escolhida.',
            type: 'TRAIL_FEATURE',
          },
          {
            nex: 70,
            title: 'Grau de Treinamento',
            description: 'Escolha pericias para aumentar grau de treinamento.',
            type: 'FEATURE',
          },
          {
            nex: 75,
            title: 'Poder de Combatente',
            description: 'Em NEX 75%, você recebe um poder de combatente à sua escolha.',
            type: 'POWER_SLOT',
          },
          {
            nex: 80,
            title: 'Aumento de Atributo',
            description: 'Você pode aumentar um atributo em +1 (limite 5).',
            type: 'ATTRIBUTE_BUFF',
          },
          {
            nex: 85,
            title: 'Ataque Especial (+20)',
            description:
              'Bônus aumenta para +20. Custo total 5 PE. Você pode aplicar cada bônus de +5 em ataque ou dano.',
            type: 'ABILITY_UPGRADE',
          },
          {
            nex: 90,
            title: 'Poder de Combatente',
            description: 'Em NEX 90%, você recebe um poder de combatente à sua escolha.',
            type: 'POWER_SLOT',
          },
          {
            nex: 95,
            title: 'Aumento de Atributo',
            description: 'Você pode aumentar um atributo em +1 (limite 5).',
            type: 'ATTRIBUTE_BUFF',
          },
          {
            nex: 99,
            title: 'Habilidade de Trilha',
            description: 'Recebe o poder de NEX 99% da trilha escolhida.',
            type: 'TRAIL_FEATURE',
          },
        ]

        for (const p of progressions) {
          await trx.table('class_progressions').insert({
            class_id: classId,
            nex: p.nex,
            title: p.title,
            description: p.description,
            type: p.type,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }

        // 3. Combatant Powers (Abilities)
        const powers = [
          {
            name: 'Armamento Pesado',
            description: 'Você recebe proficiência com armas pesadas. Pré-requisito: For 2.',
          },
          {
            name: 'Artista Marcial',
            description:
              'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis (veja p. 59). Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
          },
          {
            name: 'Ataque de Oportunidade',
            description:
              'Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele.',
          },
          {
            name: 'Combater com Duas Armas',
            description:
              'Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –2d em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria.',
          },
          {
            name: 'Combate Defensivo',
            description:
              'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –2d em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2.',
          },
          {
            name: 'Golpe Demolidor',
            description:
              'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma. Pré-requisitos: For 2, treinado em Luta.',
          },
          {
            name: 'Golpe Pesado',
            description:
              'Enquanto estiver empunhando uma arma corpo a corpo, o dano dela aumenta em mais um dado do mesmo tipo.',
          },
          {
            name: 'Incansável',
            description:
              'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.',
          },
          {
            name: 'Presteza Atlética',
            description:
              'Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +1d no teste.',
          },
          {
            name: 'Proteção Pesada',
            description: 'Você recebe proficiência com Proteções Pesadas. Pré-requisito: NEX 30%.',
          },
          {
            name: 'Reflexos Defensivos',
            description:
              'Você recebe +2 em Defesa e em testes de resistência. Pré-requisitos: Agi 2.',
          },
          {
            name: 'Saque Rápido',
            description:
              'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa.',
          },
          {
            name: 'Segurar o Gatilho',
            description:
              'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou atingir o limite de seus PE por rodada. Pré-requisito: NEX 60%.',
          },
          {
            name: 'Sentido Tático',
            description:
              'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena. Pré-requisitos: Int 2, treinado em Percepção e Tática.',
          },
          {
            name: 'Tanque de Guerra',
            description:
              'Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2. Pré-requisito: Proteção Pesada.',
          },
          {
            name: 'Tiro Certeiro',
            description:
              'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria.',
          },
          {
            name: 'Tiro de Cobertura',
            description:
              'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. A critério do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este é um efeito de medo.',
          },
          {
            name: 'Transcender',
            description:
              'Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
          },
          {
            name: 'Treinamento em Perícia',
            description:
              'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
          },
        ]

        for (const p of powers) {
          await trx.table('abilities').insert({
            name: p.name,
            description: p.description,
            type: 'COMBAT_POWER',
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
        this.logger.info(`Seeded ${powers.length} combat powers`)

        // 4. Trails
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
              },
              {
                nex: 40,
                title: 'Técnica Secreta',
                description:
                  'A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional. Amplo: O ataque pode atingir um alvo adicional em seu alcance e adjacente ao original (use o mesmo teste de ataque para ambos). Destruidor: Aumenta o multiplicador de crítico da arma em +1.',
              },
              {
                nex: 65,
                title: 'Técnica Sublime',
                description:
                  'Você adiciona os seguintes efeitos à lista de sua Técnica Secreta: Letal: Aumenta a margem de ameaça em +2. Você pode escolher este efeito duas vezes para aumentar a margem de ameaça em +5. Perfurante: Ignora até 5 pontos de resistência a dano de qualquer tipo do alvo.',
              },
              {
                nex: 99,
                title: 'Máquina de Matar',
                description:
                  'A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.',
              },
            ],
          },
          {
            name: 'Comandante de Campo',
            description:
              'Focado em liderança, coordenação e auxílio aos aliados no campo de batalha.',
            progressions: [
              {
                nex: 10,
                title: 'Inspirar Confiança',
                description:
                  'Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado.',
              },
              {
                nex: 40,
                title: 'Estrategista',
                description:
                  'Você pode direcionar aliados em alcance curto. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.',
              },
              {
                nex: 65,
                title: 'Brecha na Guarda',
                description:
                  'Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance curto, você pode gastar uma reação e 2 PE para que você ou outro aliado em alcance curto faça um ataque adicional contra o mesmo inimigo. Além disso, o alcance de inspirar confiança e estrategista aumenta para médio.',
              },
              {
                nex: 99,
                title: 'Oficial Comandante',
                description:
                  'Você pode gastar uma ação padrão e 5 PE para que cada aliado que você possa ver em alcance médio receba uma ação padrão adicional no próximo turno dele.',
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
              },
              {
                nex: 40,
                title: 'Revidar',
                description:
                  'Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.',
              },
              {
                nex: 65,
                title: 'Força Opressora',
                description:
                  'Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caído.',
              },
              {
                nex: 99,
                title: 'Potência Máxima',
                description:
                  'Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.',
              },
            ],
          },
          {
            name: 'Operações Especiais',
            description:
              'Mestre em mobilidade e economia de ação, agindo de forma rápida e calculada.',
            progressions: [
              {
                nex: 10,
                title: 'Iniciativa Aprimorada',
                description:
                  'Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.',
              },
              {
                nex: 40,
                title: 'Ataque Extra',
                description:
                  'Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.',
              },
              {
                nex: 65,
                title: 'Surto de Adrenalina',
                description:
                  'Uma vez por rodada, você pode gastar 5 PE para realizar uma ação padrão ou de movimento adicional.',
              },
              {
                nex: 99,
                title: 'Sempre Alerta',
                description:
                  'Você recebe uma ação padrão adicional no início de cada cena de combate.',
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
              },
              {
                nex: 40,
                title: 'Cai Dentro',
                description:
                  'Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado. Este poder só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque (por exemplo, adjacente a um oponente atacando em corpo a corpo ou dentro do alcance de uma arma de ataque à distância). Um oponente que passe no teste de Vontade não pode ser afetado por seu poder Cai Dentro até o final da cena.',
              },
              {
                nex: 65,
                title: 'Duro de Matar',
                description:
                  'Ao sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, você pode usar esta habilidade para reduzir dano paranormal.',
              },
              {
                nex: 99,
                title: 'Inquebrável',
                description:
                  'Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5. Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações. Você ainda segue as regras de morte normalmente.',
              },
            ],
          },
        ]

        for (const t of trails) {
          const [trailId] = await trx.table('trails').insert({
            class_id: classId,
            name: t.name,
            description: t.description,
            created_at: new Date(),
            updated_at: new Date(),
          })

          for (const prog of t.progressions) {
            await trx.table('trail_progressions').insert({
              trail_id: trailId,
              nex: prog.nex,
              title: prog.title,
              description: prog.description,
              type: 'ABILITY',
              created_at: new Date(),
              updated_at: new Date(),
            })
          }
        }
        this.logger.info(`Seeded ${trails.length} trails`)
      })

      console.log('Combatant Seed Completed Successfully!')
    } catch (error: any) {
      console.error('Failed to seed:', error)
    }
  }
}
