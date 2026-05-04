import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class KnowledgeMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [
      {
        name: 'Anjo',
        type: 'Criatura Enorme',
        size: 'Enorme',
        element: 'conhecimento',
        vd: 380,
        defense: 57,
        hpMax: 1111, hpCurrent: 1111,
        movement: 24,
        alternativeMovements: [{ type: 'Voo', value: 24 }],
        immunities: 'Paralisia, dano e efeitos de Conhecimento', vulnerabilities: 'sangue',
        agi: 4, str: 5, int: 5, pre: 5, vig: 5,
        perceptionDice: 5, perceptionBonus: 25,
        initiativeDice: 4, initiativeBonus: 25,
        fortitudeDice: 5, fortitudeBonus: 25,
        reflexDice: 4, reflexBonus: 25,
        willDice: 5, willBonus: 30,
        resistances: { flatRD: 50, byType: {} },
        attacks: [
          { name: 'Asas do Conhecimento', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '4d10+40', damageType: 'conhecimento' },
          { name: 'Olhares do Saber', range: 'Distância', attackCount: 2, dice: 5, bonus: 25, damage: '6d8+20', damageType: 'conhecimento' },
          {
            name: 'Faixas Detentoras',
            description: 'Livre. Acerto da asa agarra e Fascina alvo (Teste 5d20+45).',
            range: 'Corpo a corpo', dice: 5, bonus: 45, damage: '0', damageType: 'fascinação'
          },
          {
            name: 'Chamas Reveladoras',
            description: 'Padrão. 10d8 Conhec. médio. Marca alvo c/ auréola, Anjo ignora furtividade e invisibilidade (Vontade DT 43).',
            range: 'Médio', damage: '10d8', damageType: 'conhecimento'
          },
          {
            name: 'Raio Dourado',
            description: 'Completa. 1/cena, 15d8+50 Conhec. longo (Reflexos DT 43).',
            range: 'Longo', damage: '15d8+50', damageType: 'conhecimento'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Julgamento', description: 'Dano recebido de Conhecimento reflete 50% de dano Mental. Se Mente=0, alvo desintegrado/inexiste.' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '10d6'
      },
      {
        name: 'Bicho-Papão',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'conhecimento',
        vd: 300,
        defense: 41,
        hpMax: 750, hpCurrent: 750,
        movement: 15,
        nexImmune: 90,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'corte': 20, 'impacto': 20, 'conhecimento': 20 }
        },
        vulnerabilities: 'sangue',
        agi: 5, str: 4, int: 3, pre: 5, vig: 4,
        perceptionDice: 5, perceptionBonus: 20,
        initiativeDice: 5, initiativeBonus: 20,
        fortitudeDice: 4, fortitudeBonus: 15,
        reflexDice: 5, reflexBonus: 25,
        willDice: 5, willBonus: 20,
        additionalSkills: [{ name: 'Atletismo', dice: 4, bonus: 15 }, { name: 'Furtividade', dice: 5, bonus: 18 }],
        attacks: [
          { name: 'Garras Atormentadoras', range: 'Corpo a corpo', attackCount: 3, dice: 5, bonus: 35, damage: '4d10+10', damageType: 'conhecimento' },
          {
            name: 'Atormentar',
            description: 'Movimento. Sussurros curto. 3d8 mental (+3d8 se escondido) (Vontade DT 30 metade).',
            range: 'Curto', damage: '3d8', damageType: 'mental'
          },
          {
            name: 'Saltar e Assustar',
            description: 'Completa. Revelar-se curto dá 10d8 mental (Vontade DT 35 metade).',
            range: 'Curto', damage: '10d8', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Tamanho Adaptável', description: 'Entra em local pequeno e não perde deslocamento escondido/escalando.' },
          { name: 'Tormento Infantil', description: 'Fica Desprevenido com cantiga de ninar. Choro atrai foco compulsivamente.' },
          { name: 'Destruir Mente', description: '+1d8 mental nas garras se alvo perturbado.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '7d8'
      },
      {
        name: 'Espreitador',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        vd: 220,
        defense: 34,
        hpMax: 500, hpCurrent: 500,
        movement: 12,
        nexImmune: 70,
        immunities: 'Dano (Até enigma da porta fechada for resolvido)', vulnerabilities: 'sangue',
        agi: 4, str: 2, int: 3, pre: 3, vig: 2,
        perceptionDice: 3, perceptionBonus: 15,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 2, fortitudeBonus: 10,
        reflexDice: 4, reflexBonus: 15,
        willDice: 3, willBonus: 15,
        additionalSkills: [{ name: 'Furtividade', dice: 4, bonus: 20 }],
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 2, dice: 2, bonus: 10, damage: '1d6+2', damageType: 'impacto' },
          {
            name: 'Espreitar',
            description: 'Completa. 1x cena, adjacente a quem dorme: 10d6 mental.',
            range: 'Corpo a corpo', damage: '10d6', damageType: 'mental'
          },
          {
            name: 'Cópia Observada',
            description: 'Padrão. Imprime cópia do alvo enlouquecido por ele que ataca c/ Conhecimento.',
            range: 'Variável', damage: '0', damageType: 'especial'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Correr Pelas Frestas', description: 'Movimento. Teleporta para qualquer fresta em alcance longo.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '7d6'
      },
      {
        name: 'Estrangeiro',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'conhecimento',
        secondaryElements: 'energia',
        vd: 340,
        defense: 50,
        hpMax: 750, hpCurrent: 750,
        movement: 15,
        alternativeMovements: [{ type: 'Voo', value: 15 }],
        nexImmune: 99,
        immunities: 'Dano (Perde imunidade, exceto Conhec, se enigma resolvido)', vulnerabilities: 'sangue',
        agi: 3, str: 5, int: 5, pre: 5, vig: 3,
        perceptionDice: 5, perceptionBonus: 25,
        initiativeDice: 3, initiativeBonus: 20,
        fortitudeDice: 3, fortitudeBonus: 15,
        reflexDice: 3, reflexBonus: 20,
        willDice: 5, willBonus: 25,
        additionalSkills: [
          { name: 'Ciência', dice: 5, bonus: 20 },
          { name: 'Ocultismo', dice: 5, bonus: 20 },
          { name: 'Furtividade', dice: 3, bonus: 20 }
        ],
        attacks: [
          { name: 'Toque Sutil', range: 'Corpo a corpo', attackCount: 3, dice: 5, bonus: 35, damage: '4d8+10', damageType: 'conhecimento' },
          { name: 'Rajada Psíquica', range: 'Distância', attackCount: 2, dice: 5, bonus: 35, damage: '4d10+20', damageType: 'conhecimento' },
          {
            name: 'Comandar',
            description: 'Livre. Controla alvo acertado pela rajada se INT < 5 (Vontade DT 35).',
            range: 'Longo', damage: '0', damageType: 'controle'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Apagar Memória', description: 'Livre. Se enlouquecer o alvo, controla-o ou dá 1d4 de Sanidade apagando memória dele.' },
          { name: 'Oblívio', description: 'Livre. Acerto no Toque: Esquece que Estrangeiro está lá (Vontade DT 30).' },
          { name: 'Incubar', description: 'Completa. Implanta Larva. 1d6 mental/cena, hospedeiro vira novo monstro a 0 Sanidade.' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '10d6'
      },
      {
        name: 'Existido',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        vd: 20,
        defense: 13,
        hpMax: 36, hpCurrent: 36,
        movement: 9,
        nexImmune: 25,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'corte': 5, 'impacto': 5, 'conhecimento': 10 }
        },
        vulnerabilities: 'sangue',
        agi: 1, str: 1, int: 4, pre: 2, vig: 2,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 0,
        reflexDice: 1, reflexBonus: 0,
        willDice: 2, willBonus: 10,
        additionalSkills: [{ name: 'Ciências', dice: 4, bonus: 10 }, { name: 'Ocultismo', dice: 4, bonus: 10 }],
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 1, dice: 1, bonus: 5, damage: '1d4+1', damageType: 'impacto' },
          {
            name: 'Brilho Enlouquecedor',
            description: 'Livre. 1/rodada. 1d6 mental no visual médio (Vontade DT 14).',
            range: 'Médio', damage: '1d6', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Fortalecimento Paranormal', description: 'Movimento. Buff de +d20 fisicos e +2d4 Conhec. em ataques baseados no Brilho.' }
        ],
        disturbingPresenceDt: 14, disturbingPresenceDamage: '1d6'
      },
      {
        name: 'Lembrado',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        vd: 100,
        defense: 22,
        hpMax: 180, hpCurrent: 180,
        movement: 9,
        nexImmune: 45,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'corte': 10, 'impacto': 10, 'conhecimento': 20 }
        },
        vulnerabilities: 'sangue',
        agi: 2, str: 2, int: 4, pre: 2, vig: 2,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 10,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 2, reflexBonus: 0,
        willDice: 2, willBonus: 10,
        additionalSkills: [{ name: 'Ciências', dice: 4, bonus: 10 }, { name: 'Ocultismo', dice: 4, bonus: 10 }],
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 2, dice: 2, bonus: 5, damage: '2d4+7', damageType: 'impacto' },
          {
            name: 'Expandir Aura',
            description: 'Padrão. Expande grito: 6d6 mental em curto (Vontade DT 20).',
            range: 'Curto', damage: '6d6', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Aura Manifestada', description: ' -2d20 em testes de quem entrar em curto alcance.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '4d6'
      },
      {
        name: 'Ocioso',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'conhecimento',
        vd: 260,
        defense: 37,
        hpMax: 390, hpCurrent: 390,
        movement: 0,
        alternativeMovements: [{ type: 'Voo', value: 0 }],
        nexImmune: 80,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'corte': 20, 'impacto': 20, 'conhecimento': 20 }
        },
        vulnerabilities: 'sangue',
        agi: 1, str: 5, int: 1, pre: 5, vig: 3,
        perceptionDice: 5, perceptionBonus: 15,
        initiativeDice: 1, initiativeBonus: 0,
        fortitudeDice: 3, fortitudeBonus: 15,
        reflexDice: 1, reflexBonus: 0,
        willDice: 5, willBonus: 20,
        attacks: [
          {
            name: 'Retaliação',
            description: 'Reação. Quando atacado, teleporta pra trás do agressor e soca (5d20+30, 4d10+20 impacto não-letal).',
            range: 'Corpo a corpo', dice: 5, bonus: 30, damage: '4d10+20', damageType: 'impacto'
          },
          {
            name: 'Aterrorizar',
            description: 'Completa. Só olhar já causa 4d10+10 mental adjacente.',
            range: 'Adjacente', damage: '4d10+10', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Sempre Presente', description: 'Só o alvo da cena consegue vê-lo.' },
          { name: 'Permanecer Próximo', description: 'Livre. Teleporta pra campo de visão do alvo todo turno.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },
      {
        name: 'Parasita de Culpa',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        secondaryElements: 'Sangue, Morte',
        vd: 60,
        defense: 15,
        hpMax: 90, hpCurrent: 90,
        movement: 6,
        nexImmune: 35,
        immunities: 'Dano (exceto do hospedeiro na ilusão)',
        agi: 2, str: 0, int: 4, pre: 4, vig: 1,
        perceptionDice: 4, perceptionBonus: 0,
        initiativeDice: 2, initiativeBonus: 0,
        fortitudeDice: 1, fortitudeBonus: 10,
        reflexDice: 2, reflexBonus: 10,
        willDice: 4, willBonus: 10,
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 1, dice: 1, bonus: 0, damage: '1d4', damageType: 'impacto' },
          {
            name: 'Atormentar',
            description: 'Completa. Todo início de cena do sonho gera 2d6 mental (Vontade DT 20 metade).',
            range: 'Visual', damage: '2d6', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Fixar', description: 'Completa. Invade alvo que dorme (Furtividade 2d20+15). Se o alvo falhar no teste em resistir, torna hospedeiro.' },
          { name: 'Cópias do Hospedeiro', description: 'Completa. Forma 4 ilusões com PV 20 cada de Conhecimento.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '2d6'
      },
      {
        name: 'Rastejador Sombrio',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        secondaryElements: 'sangue',
        vd: 180,
        defense: 41,
        hpMax: 330, hpCurrent: 330,
        movement: 12,
        nexImmune: 60,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'corte': 10, 'impacto': 10, 'conhecimento': 20 }
        },
        vulnerabilities: 'sangue',
        agi: 4, str: 3, int: 3, pre: 3, vig: 3,
        perceptionDice: 3, perceptionBonus: 15,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 15,
        reflexDice: 4, reflexBonus: 15,
        willDice: 3, willBonus: 10,
        additionalSkills: [{ name: 'Furtividade', dice: 4, bonus: 15 }, { name: 'Ocultismo', dice: 3, bonus: 15 }],
        attacks: [
          { name: 'Toque da Dor', range: 'Corpo a corpo', attackCount: 3, dice: 4, bonus: 20, damage: '4d8+5', damageType: 'conhecimento' },
          {
            name: 'Desespero',
            description: 'Livre. Toque gera mesmo valor em dano mental (Vontade DT 25 metade).',
            range: 'Corpo a corpo', damage: '0', damageType: 'mental'
          },
          {
            name: 'Tentáculos das Sombras',
            description: 'Movimento. Agarra 3 seres em médio, pode arrastar. Sofrem 4d6 mental fim do turno.',
            range: 'Médio', attackCount: 3, damage: '4d6', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Vulnerabilidade a Luz', description: 'Exposto a luz perde -10 de Defesa, Desespero, Rastejar e Tentáculos.' },
          { name: 'Rastejar', description: 'Livre. Se camuflado, ganha +10 Furtividade.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '6d6'
      },
      {
        name: 'Silhueta',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        vd: 360,
        defense: 55,
        hpMax: 500, hpCurrent: 500,
        movement: 12,
        immunities: 'Paralisia, dano/efeitos de Conhecimento, manobras de combate', vulnerabilities: 'sangue',
        agi: 4, str: 4, int: 5, pre: 5, vig: 4,
        perceptionDice: 5, perceptionBonus: 25,
        initiativeDice: 4, initiativeBonus: 20,
        fortitudeDice: 4, fortitudeBonus: 20,
        reflexDice: 4, reflexBonus: 20,
        willDice: 5, willBonus: 25,
        resistances: { flatRD: 30, byType: {} },
        attacks: [
          {
            name: 'Toque Devastador',
            description: 'Padrão. Toca 2 seres ativando Aura Tangível neles diretamente.',
            range: 'Corpo a corpo', attackCount: 2, damage: '20d12', damageType: 'conhecimento'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Aura Tangível', description: 'Habilidade Passiva. Tocar ela ou ela te tocar: 20d12 Conhecimento (Fortitude DT 42 metade). 0 PV evapora pra sempre.' },
          { name: 'Conhecimento Verdadeiro', description: '+25 INT/PRE e +20 AGI/FOR/VIG.' },
          { name: 'Reescrever a Realidade', description: 'Livre. Enquanto se move, transmuta matéria (1 tonelada).' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '8d8'
      },
      {
        name: 'Vulto',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        vd: 40,
        defense: 19,
        hpMax: 60, hpCurrent: 60,
        movement: 12,
        nexImmune: 30,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'corte': 5, 'perfuração': 5, 'conhecimento': 10 }
        },
        vulnerabilities: 'sangue',
        agi: 4, str: 2, int: 2, pre: 2, vig: 1,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 4, initiativeBonus: 5,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 4, reflexBonus: 5,
        willDice: 2, willBonus: 5,
        additionalSkills: [{ name: 'Furtividade', dice: 4, bonus: 10 }],
        attacks: [
          { name: 'Toque Macabro', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 10, damage: '2d6', damageType: 'conhecimento' },
          {
            name: 'Plantar Paranoia',
            description: 'Completa. Faz surgir sustos invisíveis. Abala todos alcance curto (Vontade DT 15). Se falhar e estava abalado, fica Apavorado.',
            range: 'Curto', damage: '0', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Aura Tangível', description: 'Habilidade Passiva. +2d6 Conhecimento a seres assustados.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '3d6'
      },
      {
        name: 'Máscara do Desespero',
        type: 'Relíquia Minúsculo',
        size: 'Médio',
        element: 'conhecimento',
        vd: 400,
        defense: 55,
        hpMax: 1200, hpCurrent: 1200,
        movement: 12,
        alternativeMovements: [{ type: 'Voo', value: 12 }],
        immunities: 'Condições, dano', vulnerabilities: 'sangue',
        agi: 4, str: 4, int: 6, pre: 6, vig: 5,
        perceptionDice: 6, perceptionBonus: 35,
        initiativeDice: 4, initiativeBonus: 25,
        fortitudeDice: 5, fortitudeBonus: 35,
        reflexDice: 4, reflexBonus: 25,
        willDice: 6, willBonus: 35,
        additionalSkills: [
          { name: 'Ciência', dice: 6, bonus: 35 },
          { name: 'Ocultismo', dice: 6, bonus: 35 },
          { name: 'Religião', dice: 6, bonus: 35 }
        ],
        attacks: [
          {
            name: 'Conjuração Verdadeira',
            description: 'Livre. 1x turno solta ritual Conhecimento até 20 PE, DT 45 sem gastar PE.',
            range: 'Longo', damage: '0', damageType: 'ritual'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Destronar o Anfitrião', description: 'Resolve o Enigma do Anfitrião.' },
          { name: 'Potência do Conhecimento', description: '+35 testes Mentais, +25 fisicos.' },
          { name: 'Onipresença', description: 'Movimento. Visão e Teletransporte globais. (Perde a habilidade de Onipresença e Imunidades ao ter o Enigma de Medo resolvido).' },
          { name: 'Reescrever Realidade', description: 'Padrão. Altera a realidade circundante.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '10d8'
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
  }
}