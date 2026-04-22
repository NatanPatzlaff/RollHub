import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class DeathMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [

      // ─── Aracnasita ───────────────────────────────────────────────────
      {
        name: 'Aracnasita',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'morte',
        vd: 80,
        defense: 23,
        hpMax: 140, hpCurrent: 140,
        movement: 12,
        nexImmune: 40,
        immunities: 'Dano (exceto fogo)', vulnerabilities: 'energia',
        agi: 3, str: 2, int: 1, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 3, reflexBonus: 10,
        willDice: 1, willBonus: 5,
        additionalSkills: [{ name: 'Furtividade', dice: 3, bonus: 8 }],
        resistances: { flatRD: 0, byType: {} },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 15, damage: '2d10+10', damageType: 'perfuração' },
          {
            name: 'Estacar (Livre)',
            description: 'Acerto de mordida dá +1d10 Morte e agarra (Atletismo DT 20 solta).',
            range: 'Corpo a corpo', damage: '1d10', damageType: 'morte'
          },
          {
            name: 'Desovar Aranhas (Reação)',
            description: 'Ao ficar machucada, desova. Ciclo de 4 turnos com dano mental, dano de Morte em área e nascimento de nova criatura.',
            range: 'Área', damage: 'Especial', damageType: 'Mental/Morte'
          },
          {
            name: 'Disparar Teia (Movimento)',
            description: '3m x 3m, agarra (Reflexos DT 20). 2d8+10 Morte /turno.',
            range: 'Curto', damage: '2d8+10', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Percepção Tátil', description: 'Sente tudo pela teia perfeitamente.' },
          { name: 'Enigma de Medo', description: 'Sofrer dano de fogo anula imunidade a dano por 1 turno.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '4d6'
      },

      // ─── Carniçal Preto da Morte ──────────────────────────────────────
      {
        name: 'Carniçal Preto da Morte',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        secondaryElements: 'conhecimento',
        vd: 200,
        defense: 38,
        hpMax: 400, hpCurrent: 400,
        movement: 12,
        nexImmune: 65,
        immunities: 'Dano balístico', vulnerabilities: 'energia',
        agi: 4, str: 4, int: 3, pre: 3, vig: 3,
        perceptionDice: 3, perceptionBonus: 15,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 15,
        reflexDice: 4, reflexBonus: 15,
        willDice: 3, willBonus: 15,
        additionalSkills: [{ name: 'Atletismo', dice: 4, bonus: 15 }],
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 10, 'impacto': 10, 'perfuração': 10, 'morte': 20 } 
        },
        attacks: [
          { name: 'Garra da Morte', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 25, damage: '4d10+20', damageType: 'morte' },
          {
            name: 'Pancada Poderosa (Reação)',
            description: 'Crítico da garra empurra 6m; se colidir em objeto/ser, sofre 4d6 impacto.',
            range: 'Corpo a corpo', damage: '4d6', damageType: 'impacto'
          },
          {
            name: 'Comando (Movimento)',
            description: 'Como ritual Perturbação (Vontade DT 29).',
            range: 'Curto', damage: 'Especial', damageType: 'mental'
          },
          {
            name: 'Hipnose (Padrão)',
            description: 'Controle total sobre alvo (Vontade DT 29). Resiste de novo fim de turno.',
            range: 'Curto', damage: 'Especial', damageType: 'Controle'
          }
        ],
        abilities: [
          { name: 'Físico Paranormal', description: 'Salta dobro do deslocamento.' },
          { name: 'Instinto Mortal', description: 'Se machucado (<=200 PV), usa Hipnose como Livre. Ganha ataque extra de Garra se atacar alvo com as duas.' },
          { name: 'Corpo Fechado', description: 'Mirar na cabeça ignora imunidade a balístico.' },
          { name: 'Reanimar Corpos (Completa)', description: '1/cena, invoca 2d4+2 Esqueletos de Lodo.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '6d6'
      },

      // ─── Ceifador Espiral ─────────────────────────────────────────────
      {
        name: 'Ceifador Espiral',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'morte',
        vd: 380,
        defense: 58,
        hpMax: 999, hpCurrent: 999,
        movement: 15,
        immunities: 'Paralisia, dano e efeitos de Morte', vulnerabilities: 'energia',
        agi: 5, str: 5, int: 5, pre: 5, vig: 5,
        perceptionDice: 5, perceptionBonus: 20,
        initiativeDice: 5, initiativeBonus: 20,
        fortitudeDice: 5, fortitudeBonus: 25,
        reflexDice: 5, reflexBonus: 25,
        willDice: 5, willBonus: 25,
        resistances: { flatRD: 50, byType: {} },
        attacks: [
          { name: 'Foice da Morte', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '5d10+20', damageType: 'morte' },
          {
            name: 'Contemplar a Espiral (Completa)',
            description: '10d10+30 mental em longo (Vontade DT 43).',
            range: 'Longo', damage: '10d10+30', damageType: 'mental'
          },
          {
            name: 'Cinzas das Terras Desoladas (Completa)',
            description: 'Raio longo vira cinzas; 10d10+20 Morte + Enjoo (Fortitude DT 43 metade/evita).',
            range: 'Longo', damage: '10d10+20', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Decepar', description: 'Crítico joga vítima a 25 PV, perde 1 atributo permanentemente.' },
          { name: 'Transporte pelo Pó (Movimento)', description: 'Pode teletransportar dentro das cinzas e atacar grátis com a foice.' },
          { name: 'Enigma de Medo', description: 'Quando resolvido, perde resistência a dano e anula Terras Desoladas.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '9d8'
      },

      // ─── Enraizado ────────────────────────────────────────────────────
      {
        name: 'Enraizado',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        vd: 120,
        defense: 28,
        hpMax: 140, hpCurrent: 140,
        movement: 9,
        nexImmune: 50,
        vulnerabilities: 'energia',
        agi: 3, str: 3, int: 1, pre: 1, vig: 3,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 3, reflexBonus: 10,
        willDice: 1, willBonus: 5,
        additionalSkills: [{ name: 'Atletismo', dice: 3, bonus: 10 }],
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 10, 'impacto': 10, 'perfuração': 10, 'morte': 20 } 
        },
        attacks: [
          { name: 'Punho Espinhento', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '2d8+8', damageType: 'impacto', additionalDamages: [{ damage: '2d12', damageType: 'morte' }] },
          {
            name: 'Veneno Pútrido (Habilidade)',
            description: 'Fortitude DT 23 todo turno ou 4d12 Morte.',
            range: 'Corpo a corpo', damage: '4d12', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Imortalidade', description: ' volta em 1d2 rodadas com 70 PV. Fogo/Energia destrói permanentemente.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '4d6'
      },

      // ─── Escutado ─────────────────────────────────────────────────────
      {
        name: 'Escutado',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        secondaryElements: 'energia',
        vd: 160,
        defense: 29,
        hpMax: 290, hpCurrent: 290,
        movement: 12,
        nexImmune: 55,
        immunities: 'Dano',
        agi: 4, str: 3, int: 1, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 4, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 4, reflexBonus: 10,
        willDice: 2, willBonus: 5,
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '3d6+10', damageType: 'perfuração' },
          { name: 'Cabeça Arremessada', range: 'Curto', attackCount: 2, dice: 4, bonus: 10, damage: '1d10+10', damageType: 'impacto' },
          {
            name: 'Vomitar Lodo (Movimento)',
            description: '1/cena por cópia, 4d10+10 Morte e Lento em curto (Reflexos DT 25).',
            range: 'Curto', damage: '4d10+10', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Multiplicação Melódica', description: 'Gera cópias do Escutado (145 PV sem imunidade).' },
          { name: 'Enigma de Medo', description: 'Tocar melodia 4 turnos anula imunidade.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '4d8'
      },

      // ─── Esqueleto de Lodo ────────────────────────────────────────────
      {
        name: 'Esqueleto de Lodo',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        vd: 20,
        defense: 14,
        hpMax: 40, hpCurrent: 40,
        movement: 6,
        nexImmune: 25,
        vulnerabilities: 'energia',
        agi: 2, str: 2, int: 0, pre: 1, vig: 1,
        perceptionDice: 1, perceptionBonus: 0,
        initiativeDice: 2, initiativeBonus: 0,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 2, reflexBonus: 5,
        willDice: 1, willBonus: 0,
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 5, 'impacto': 5, 'perfuração': 5, 'morte': 10 } 
        },
        attacks: [
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 2, bonus: 5, damage: '2d6+2', damageType: 'corte' },
          {
            name: 'Espiral de Lodo (Completa)',
            description: '9m em linha reta vira lodo perfurante. 2d10 Morte (Reflexos DT 14).',
            range: '9m Linha', damage: '2d10', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Imortalidade', description: 'Retorna da morte (poça) em 1d3 rodadas.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 14, disturbingPresenceDamage: '2d4'
      },

      // ─── Marionete ────────────────────────────────────────────────────
      {
        name: 'Marionete',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        vd: 280,
        defense: 40,
        hpMax: 700, hpCurrent: 700,
        movement: 6,
        nexImmune: 85,
        vulnerabilities: 'energia',
        agi: 3, str: 5, int: 1, pre: 5, vig: 2,
        perceptionDice: 5, perceptionBonus: 15,
        initiativeDice: 3, initiativeBonus: 15,
        fortitudeDice: 2, fortitudeBonus: 10,
        reflexDice: 3, reflexBonus: 15,
        willDice: 5, willBonus: 20,
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 20, 'impacto': 20, 'perfuração': 20, 'morte': 20 } 
        },
        attacks: [
          { name: 'Foice Óssea', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 30, damage: '10d8+10', damageType: 'morte' },
          {
            name: 'Reflexos Guiados por Corda (Reação)',
            description: '1x/rodada ataca quem fica adjacente a ela.',
            range: 'Corpo a corpo', dice: 5, bonus: 30, damage: '10d8+10', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Momento Passivo', description: 'Não tem desloc. reduzido, ignora terreno dif.' },
          { name: 'Ironia do Destino (Completa)', description: 'Se acerta dois golpes adjacentes, agarra com a arma, divide qualquer dano sofrido com o alvo.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },

      // ─── Múmia Xipófaga ───────────────────────────────────────────────
      {
        name: 'Múmia Xipófaga',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        vd: 240,
        defense: 35,
        hpMax: 400, hpCurrent: 400,
        movement: 9,
        nexImmune: 75,
        vulnerabilities: 'Energia, Fogo',
        agi: 5, str: 4, int: 2, pre: 3, vig: 4,
        perceptionDice: 3, perceptionBonus: 10,
        initiativeDice: 5, initiativeBonus: 15,
        fortitudeDice: 4, fortitudeBonus: 15,
        reflexDice: 5, reflexBonus: 15,
        willDice: 3, willBonus: 10,
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 10, 'impacto': 10, 'perfuração': 10, 'morte': 20 } 
        },
        attacks: [
          { name: 'Garra Enfaixada', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 20, damage: '4d8+30', damageType: 'corte' },
          { name: 'Vomitar Lodo', range: 'Médio', attackCount: 2, dice: 5, bonus: 15, damage: '3d6+30', damageType: 'morte', additionalDamages: [{ damage: '3d8', damageType: 'mental' }] },
          {
            name: 'Agarrada Mumificadora (Livre)',
            description: 'Acerto de Garra agarra. Drena 4d8+30 Morte por turno.',
            range: 'Corpo a corpo', damage: '4d8+30', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Faixas da Permanência', description: 'A 0 PV não morre logo.' },
          { name: 'Amalgamar (Padrão)', description: 'Cura 200 PV e ganha buff agressivo de Garra.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '6d8'
      },

      // ─── Nidere ───────────────────────────────────────────────────────
      {
        name: 'Nidere',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'morte',
        secondaryElements: 'sangue',
        vd: 320,
        defense: 50,
        hpMax: 800, hpCurrent: 800,
        movement: 24,
        nexImmune: 95,
        vulnerabilities: 'energia',
        agi: 5, str: 5, int: 3, pre: 4, vig: 5,
        perceptionDice: 6, perceptionBonus: 25,
        initiativeDice: 5, initiativeBonus: 25,
        fortitudeDice: 5, fortitudeBonus: 25,
        reflexDice: 5, reflexBonus: 25,
        willDice: 4, willBonus: 15,
        additionalSkills: [{ name: 'Furtividade', dice: 5, bonus: 23 }, { name: 'Sobrevivência', dice: 5, bonus: 20 }],
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 20, 'impacto': 20, 'perfuração': 20, 'morte': 20 } 
        },
        attacks: [
          { name: 'Garra Invertida', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 35, damage: '4d10+40', damageType: 'morte' },
          { name: 'Mordida Invertida', range: 'Corpo a corpo', attackCount: 1, dice: 5, bonus: 35, damage: '4d12+40', damageType: 'morte' },
          {
            name: 'Reverter (Livre)',
            description: 'Dano de garra deixa Enjoado.',
            range: 'Corpo a corpo', damage: '0', damageType: 'Enjoo'
          }
        ],
        abilities: [
          { name: 'Caçador Veloz', description: 'Move normalmente Furtivo.' },
          { name: 'Regeneração Acelerada', description: 'Cura Acelerada 50.' },
          { name: 'Senso de Direção Perfeito', description: '+2d20 Percepção/Sobrevivência.' },
          { name: 'Rastrear e Abater (Livre)', description: '+6d6 contra alvos desprevenidos.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },

      // ─── Sempiternal ──────────────────────────────────────────────────
      {
        name: 'Sempiternal',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        vd: 360,
        defense: 53,
        hpMax: 990, hpCurrent: 990,
        movement: 12,
        immunities: 'Paralisia, dano e efeitos de Morte', vulnerabilities: 'energia',
        agi: 5, str: 5, int: 4, pre: 5, vig: 4,
        perceptionDice: 5, perceptionBonus: 20,
        initiativeDice: 5, initiativeBonus: 25,
        fortitudeDice: 4, fortitudeBonus: 20,
        reflexDice: 5, reflexBonus: 30,
        willDice: 5, willBonus: 25,
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 20, 'impacto': 20, 'perfuração': 20 } 
        },
        attacks: [
          { name: 'Dedos Alongados', range: 'Corpo a corpo', attackCount: 4, dice: 5, bonus: 40, damage: '4d10', damageType: 'morte' },
          {
            name: 'Correntes de Lodo (Movimento)',
            description: '20d6 Morte todos médio (Fortitude DT 40 metade). Se machucar, dá vuln. Morte.',
            range: 'Médio', damage: '20d6', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Toque Acelerador', description: 'Dano de dedos envelhece 1d10 anos.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '8d8'
      },

      // ─── Succ ─────────────────────────────────────────────────────────
      {
        name: 'Succ',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        secondaryElements: 'energia',
        vd: 40,
        defense: 20,
        hpMax: 65, hpCurrent: 65,
        movement: 12,
        nexImmune: 30,
        vulnerabilities: 'energia',
        agi: 4, str: 2, int: 0, pre: 1, vig: 1,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 4, initiativeBonus: 5,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 4, reflexBonus: 10,
        willDice: 1, willBonus: 5,
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 5, 'impacto': 5, 'perfuração': 5, 'morte': 10 } 
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 4, bonus: 10, damage: '2d8+2', damageType: 'perfuração' },
          {
            name: 'Sucção (Livre)',
            description: 'Agarra a face (Fortitude DT 17). Se falhar = Inconsciente, e no próx turno cai pra 0 PV.',
            range: 'Corpo a corpo', damage: '0', damageType: 'Asfixia'
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '3d6'
      },

      // ─── O Deus da Morte ──────────────────────────────────────────────
      {
        name: 'O Deus da Morte',
        type: 'Relíquia Grande',
        size: 'Grande',
        element: 'morte',
        secondaryElements: 'conhecimento',
        vd: 400,
        defense: 60,
        hpMax: 2000, hpCurrent: 2000,
        movement: 15,
        immunities: 'Atordoado, paralisia, dano e efeitos de Morte', vulnerabilities: 'energia',
        agi: 6, str: 6, int: 5, pre: 5, vig: 7,
        perceptionDice: 5, perceptionBonus: 30,
        initiativeDice: 6, initiativeBonus: 30,
        fortitudeDice: 7, fortitudeBonus: 35,
        reflexDice: 6, reflexBonus: 35,
        willDice: 5, willBonus: 35,
        resistances: { 
          flatRD: 0, 
          byType: { 'corte': 20, 'impacto': 20, 'perfuração': 20 } 
        },
        attacks: [
          { name: 'Soco Espiral', range: 'Corpo a corpo', attackCount: 2, dice: 6, bonus: 45, damage: '5d10+50', damageType: 'morte' },
          {
            name: 'Agarrão (Livre)',
            description: 'Agarra ser Médio ou menor (6d20+47).',
            range: 'Corpo a corpo', dice: 6, bonus: 47, damage: '0', damageType: 'Agarrado'
          },
          {
            name: 'Espiral Descendente (Movimento)',
            description: 'Envelhece ser agarrado 3d20 anos (soma = dano mental).',
            range: 'Corpo a corpo', damage: '3d20', damageType: 'mental'
          },
          {
            name: 'Espiral Destrutiva (Padrão)',
            description: '12m raio, longo, 10d10+50 Morte (Fortitude DT 45 metade).',
            range: 'Longo', damage: '10d10+50', damageType: 'morte'
          }
        ],
        abilities: [
          { name: 'Ciclo Infinito', description: 'Cura 50 PV/turno.' },
          { name: 'Potência de Morte', description: 'Mod. +35 FOR/VIG/PRE, e +25 pro resto.' },
          { name: 'Senhor do Tempo', description: 'Rola d20 Inic. ganha 1 turno a mais.' },
          { name: 'Controlar Mortos (Movimento)', description: 'Manda criatura Morte agir em longo.' },
          { name: 'Controlar Relógio Interno (Livre)', description: 'Encerra 2 condições.' },
          { name: 'Percepção às cegas', description: 'A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '10d8'
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
    console.log('Death monsters seeded correctly!')
  }
}
