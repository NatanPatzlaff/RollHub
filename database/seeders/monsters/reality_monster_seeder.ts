import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class RealityMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [

      // ─── Bandido ──────────────────────────────────────────────────────
      {
        name: 'Bandido',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 10,
        defense: 14,
        hpMax: 8, hpCurrent: 8,
        movement: 9,
        agi: 2, str: 2, int: 1, pre: 1, vig: 1,
        perceptionDice: 1, perceptionBonus: 0,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        additionalSkills: [{ name: 'Crime', dice: 2, bonus: 5 }, { name: 'Furtividade', dice: 2, bonus: 5 }],
        attacks: [
          { name: 'Faca', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d4+2', damageType: 'perfuração' }
        ],
        abilities: [
          { name: 'Ataque Furtivo (Livre)', description: '+1d6 dano contra alvos desprevenidos ou flanqueados.' }
        ]
      },

      // ─── Capanga ──────────────────────────────────────────────────────
      {
        name: 'Capanga',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 20,
        defense: 13,
        hpMax: 17, hpCurrent: 17,
        movement: 9,
        agi: 1, str: 2, int: 1, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 1,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        additionalSkills: [{ name: 'Intimidação', dice: 1, bonus: 5 }],
        attacks: [
          { name: 'Bastão', range: 'Corpo a corpo', attackCount: 1, dice: 1, bonus: 0, damage: '1d8+7', damageType: 'impacto' },
          { name: 'Revólver', range: 'Curto', attackCount: 1, dice: 1, bonus: 0, damage: '2d6+5', damageType: 'balístico' }
        ],
        abilities: [
          { name: 'Ataque Furtivo (Livre)', description: '+2d6 dano contra alvos desprevenidos ou flanqueados.' }
        ]
      },

      // ─── Soldado de Aluguel ───────────────────────────────────────────
      {
        name: 'Soldado de Aluguel',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 40,
        defense: 18,
        hpMax: 25, hpCurrent: 25,
        movement: 9,
        agi: 2, str: 2, int: 1, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 2, initiativeBonus: 10,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        attacks: [
          { name: 'Machete', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 10, damage: '1d6+9', damageType: 'corte' },
          { name: 'Fuzil de Assalto', range: 'Médio', attackCount: 1, dice: 2, bonus: 10, damage: '2d8+9', damageType: 'balístico' }
        ],
        abilities: [
          { name: 'Ataque em Movimento (Completa)', description: 'Percorre deslocamento e ataca em qualquer ponto.' }
        ]
      },

      // ─── Assassino ────────────────────────────────────────────────────
      {
        name: 'Assassino',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 80,
        defense: 26,
        hpMax: 90, hpCurrent: 90,
        movement: 9,
        agi: 4, str: 2, int: 3, pre: 3, vig: 2,
        perceptionDice: 3, perceptionBonus: 10,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 4,  reflexBonus: 10,
        willDice: 3,    willBonus: 10,
        additionalSkills: [
          { name: 'Crime', dice: 4, bonus: 10 },
          { name: 'Enganação', dice: 3, bonus: 10 },
          { name: 'Furtividade', dice: 4, bonus: 10 }
        ],
        attacks: [
          { name: 'Faca', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 10, damage: '1d4+11', damageType: 'corte' },
          { name: 'Pistola', range: 'Curto', attackCount: 2, dice: 4, bonus: 10, damage: '1d12+14', damageType: 'balístico' },
          {
            name: 'Mão na Boca (Livre)',
            description: 'Agarra vítima impossibilitando-a de falar.',
            range: 'Corpo a corpo', damage: '0', damageType: 'Agarrado'
          }
        ],
        abilities: [
          { name: 'Evasão', description: 'Dano zerado se passar no teste de Reflexos.' },
          { name: 'Ataque Furtivo (Livre)', description: '+4d6 dano em alvo desprevenido/flanqueado.' },
          { name: 'Assassinar (Movimento)', description: 'Dobra os dados de seu próximo Ataque Furtivo que causar dano.' }
        ]
      },

      // ─── Comandante Mercenário ────────────────────────────────────────
      {
        name: 'Comandante Mercenário',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 120,
        defense: 29,
        hpMax: 145, hpCurrent: 145,
        movement: 6,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 5, 'corte': 5, 'impacto': 5, 'perfuração': 5 } 
        },
        agi: 3, str: 3, int: 2, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 3,  reflexBonus: 10,
        willDice: 2,    willBonus: 5,
        additionalSkills: [{ name: 'Intimidação', dice: 2, bonus: 10 }, { name: 'Tática', dice: 2, bonus: 10 }],
        attacks: [
          { name: 'Machete', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '1d6+15', damageType: 'corte' },
          { name: 'Metralhadora', range: 'Médio', attackCount: 2, dice: 3, bonus: 15, damage: '3d12+15', damageType: 'balístico' }
        ],
        abilities: [
          { name: 'Sadismo', description: 'Ganha +d20 e +1 dado de dano após causar dano em um inimigo.' },
          { name: 'Ordens (Movimento)', description: 'Aliados recebem +d20 de teste e dano extra.' }
        ]
      },

      // ─── Iniciado ─────────────────────────────────────────────────────
      {
        name: 'Iniciado',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 20,
        defense: 16,
        hpMax: 15, hpCurrent: 15,
        movement: 9,
        agi: 1, str: 1, int: 2, pre: 2, vig: 1,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 0,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 1,  reflexBonus: 0,
        willDice: 2,    willBonus: 5,
        additionalSkills: [{ name: 'Enganação', dice: 2, bonus: 5 }, { name: 'Ocultismo', dice: 2, bonus: 5 }],
        attacks: [
          { name: 'Faca', range: 'Corpo a corpo', attackCount: 1, dice: 1, bonus: 0, damage: '1d4+1', damageType: 'corte' }
        ],
        abilities: [
          { name: 'Conjurador', description: 'Pode usar 2 rituais de 1º círculo de graça (DT 15).' }
        ]
      },

      // ─── Investido ────────────────────────────────────────────────────
      {
        name: 'Investido',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 40,
        defense: 17,
        hpMax: 35, hpCurrent: 35,
        movement: 9,
        agi: 2, str: 1, int: 2, pre: 2, vig: 1,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 2,  reflexBonus: 0,
        willDice: 2,    willBonus: 5,
        additionalSkills: [{ name: 'Enganação', dice: 2, bonus: 10 }, { name: 'Ocultismo', dice: 2, bonus: 10 }],
        attacks: [
          { name: 'Faca', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d4+1', damageType: 'corte' },
          { name: 'Revólver', range: 'Curto', attackCount: 1, dice: 2, bonus: 5, damage: '2d6', damageType: 'balístico' }
        ],
        abilities: [
          { name: 'Conjurador', description: 'Conhece 2 rituais de 1º e 2º círculo (até 5 PE), DT 17.' }
        ]
      },

      // ─── Líder de Culto ───────────────────────────────────────────────
      {
        name: 'Líder de Culto',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 140,
        defense: 27,
        hpMax: 150, hpCurrent: 150,
        movement: 9,
        agi: 2, str: 1, int: 3, pre: 3, vig: 2,
        perceptionDice: 3, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 10,
        fortitudeDice: 2, fortitudeBonus: 10,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 3,    willBonus: 15,
        additionalSkills: [{ name: 'Enganação', dice: 3, bonus: 15 }, { name: 'Ocultismo', dice: 3, bonus: 15 }],
        attacks: [
          { name: 'Faca', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 10, damage: '1d4+1', damageType: 'corte' },
          { name: 'Revólver', range: 'Curto', attackCount: 1, dice: 2, bonus: 10, damage: '2d6', damageType: 'balístico' }
        ],
        abilities: [
          { name: 'Conjurador', description: 'Rituais de 1º, 2º e 3º círculos de graça (até 10 PE), DT 25.' }
        ]
      },

      // ─── Policial ─────────────────────────────────────────────────────
      {
        name: 'Policial',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 20,
        defense: 19,
        hpMax: 15, hpCurrent: 15,
        movement: 9,
        agi: 2, str: 2, int: 1, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        attacks: [
          { name: 'Bastão', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d8+7', damageType: 'impacto' },
          { name: 'Pistola', range: 'Curto', attackCount: 1, dice: 2, bonus: 5, damage: '1d12+5', damageType: 'balístico' }
        ]
      },

      // ─── Policial de Elite ────────────────────────────────────────────
      {
        name: 'Policial de Elite',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 60,
        defense: 27,
        hpMax: 40, hpCurrent: 40,
        movement: 6,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 5, 'corte': 5, 'impacto': 5, 'perfuração': 5 } 
        },
        agi: 3, str: 3, int: 1, pre: 1, vig: 3,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 3,  reflexBonus: 10,
        willDice: 1,    willBonus: 10,
        attacks: [
          { name: 'Bastão', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '1d8+13', damageType: 'impacto' },
          { name: 'Fuzil de Assalto', range: 'Médio', attackCount: 1, dice: 3, bonus: 15, damage: '2d8+13', damageType: 'balístico' },
          {
            name: 'Lança-granadas (Padrão)',
            description: 'Dispara granada 8d6 dano em área (Reflexos DT 19).',
            range: 'Médio', damage: '8d6', damageType: 'Energia/Impacto'
          },
          {
            name: 'Empurrar e Atirar (Completa)',
            description: 'Empurra alvo (DT 19) e ataca fuzil (+d20 e +2d8 de dano).',
            range: 'Médio', dice: 1, bonus: 0, damage: '4d8+13', damageType: 'balístico'
          }
        ],
        abilities: [
          { name: 'Fortificação', description: '50% de chance de ignorar dano crítico e furtivo.' }
        ]
      },

      // ─── Chefe de Polícia ─────────────────────────────────────────────
      {
        name: 'Chefe de Polícia',
        type: 'Pessoa Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 100,
        defense: 25,
        hpMax: 105, hpCurrent: 105,
        movement: 9,
        agi: 2, str: 3, int: 2, pre: 3, vig: 3,
        perceptionDice: 3, perceptionBonus: 15,
        initiativeDice: 2, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 2,  reflexBonus: 10,
        willDice: 3,    willBonus: 15,
        attacks: [
          { name: 'Bastão', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '1d8+8', damageType: 'impacto' },
          { name: 'Espingarda', range: 'Médio', attackCount: 2, dice: 2, bonus: 10, damage: '4d6+12', damageType: 'balístico' }
        ],
        abilities: [
          { name: 'Teimoso (Reação)', description: 'Ignora teste ou reduz dano na metade 1 vez por cena.' }
        ]
      },

      // ─── Cão de Guarda ────────────────────────────────────────────────
      {
        name: 'Cão de Guarda',
        type: 'Animal Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 10,
        defense: 14,
        hpMax: 12, hpCurrent: 12,
        movement: 12,
        agi: 2, str: 2, int: 0, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        additionalSkills: [{ name: 'Sobrevivência', dice: 1, bonus: 10 }],
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d6+2', damageType: 'corte' },
          {
            name: 'Derrubar (Livre)',
            description: 'Derruba oponente ao acertar a mordida.',
            range: 'Corpo a corpo', damage: '0', damageType: 'Derrubar'
          }
        ],
        abilities: []
      },

      // ─── Enxame de Abelhas ────────────────────────────────────────────
      {
        name: 'Enxame de Abelhas',
        type: 'Animal (Enxame)',
        size: 'Médio',
        element: 'Realidade',
        vd: 10,
        defense: 15,
        hpMax: 10, hpCurrent: 10,
        movement: 3,
        alternativeMovements: [{ type: 'Voo', value: 9 }],
        agi: 1, str: 0, int: 0, pre: 1, vig: 0,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 5,
        fortitudeDice: -2, fortitudeBonus: 0,
        reflexDice: 1,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        attacks: [
          { name: 'Ataque do Enxame', range: 'Corpo a corpo', attackCount: 1, damage: '2d6', damageType: 'perfuração' },
          {
            name: 'Zumbido Nauseante (Passivo)',
            description: 'Quem sofrer dano do enxame fica enjoado (Fortitude DT 15 evita).',
            range: 'Curto', damage: '0', damageType: 'Enjoo'
          }
        ],
        abilities: [
          { name: 'Enxame', description: 'Imune a efeitos únicos não lesivos; sofre metade do dano de armas comuns e +50% dano em área.' }
        ]
      },

      // ─── Enxame de Ratos ──────────────────────────────────────────────
      {
        name: 'Enxame de Ratos',
        type: 'Animal (Enxame)',
        size: 'Médio',
        element: 'Realidade',
        vd: 10,
        defense: 13,
        hpMax: 15, hpCurrent: 15,
        movement: 9,
        alternativeMovements: [{ type: 'Escalar/Nadar', value: 6 }],
        agi: 1, str: 0, int: 0, pre: 1, vig: 1,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 5,
        fortitudeDice: 1, fortitudeBonus: 5,
        reflexDice: 1,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        attacks: [
          { name: 'Ataque do Enxame', range: 'Corpo a corpo', attackCount: 1, damage: '2d6', damageType: 'perfuração' },
          {
            name: 'Doença (Passivo)',
            description: 'Vítima do enxame contrai febre hemorrágica (Fortitude DT 15).',
            range: 'Corpo a corpo', damage: '0', damageType: 'Doença'
          }
        ],
        abilities: [
          { name: 'Enxame', description: 'Funciona igual ao enxame de abelhas.' }
        ]
      },

      // ─── Jacaré ───────────────────────────────────────────────────────
      {
        name: 'Jacaré',
        type: 'Animal Grande',
        size: 'Grande',
        element: 'Realidade',
        vd: 40,
        defense: 16,
        hpMax: 40, hpCurrent: 40,
        movement: 6,
        alternativeMovements: [{ type: 'Nadar', value: 9 }],
        agi: 1, str: 3, int: 0, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 1,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        additionalSkills: [{ name: 'Furtividade', dice: 1, bonus: 8 }],
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 1, bonus: 5, damage: '1d8+8', damageType: 'corte' },
          { name: 'Cauda', range: 'Curto', attackCount: 1, dice: 1, bonus: 5, damage: '1d12', damageType: 'impacto' },
          {
            name: 'Agarrão (Livre)',
            description: 'Agarra oponente após uma mordida bem sucedida.',
            range: 'Corpo a corpo', damage: '0', damageType: 'Agarrado'
          }
        ],
        abilities: [
          { name: 'Giro da Morte', description: 'Na água, causa +2d8 ao atacar após ter agarrado a presa.' }
        ]
      },

      // ─── Javaporco ────────────────────────────────────────────────────
      {
        name: 'Javaporco',
        type: 'Animal Médio',
        size: 'Médio',
        element: 'Realidade',
        vd: 20,
        defense: 14,
        hpMax: 35, hpCurrent: 35,
        movement: 12,
        agi: 1, str: 2, int: 0, pre: 1, vig: 3,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 5,
        fortitudeDice: 3, fortitudeBonus: 5,
        reflexDice: 1,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d8+4', damageType: 'corte' },
          {
            name: 'Mordida Final (Reação)',
            description: 'Quando atinge 0 PV ataca alvo aleatório próximo.',
            range: 'Curto', dice: 2, bonus: 5, damage: '1d8+4', damageType: 'corte'
          }
        ],
        abilities: [
          { name: 'Ferocidade', description: 'Ao sofrer dano, recebe +d20 para atacar e +1 dado extra em danos.' }
        ]
      },

      // ─── Onça-Pintada ─────────────────────────────────────────────────
      {
        name: 'Onça-Pintada',
        type: 'Animal Grande',
        size: 'Grande',
        element: 'Realidade',
        vd: 40,
        defense: 16,
        hpMax: 55, hpCurrent: 55,
        movement: 12,
        alternativeMovements: [{ type: 'Escalar/Nadar', value: 6 }],
        agi: 3, str: 3, int: 0, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 3,  reflexBonus: 5,
        willDice: 1,    willBonus: 5,
        additionalSkills: [{ name: 'Furtividade', dice: 3, bonus: 13 }],
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 3, bonus: 5, damage: '1d8+5', damageType: 'corte' },
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 5, damage: '1d6+5', damageType: 'corte' },
          {
            name: 'Agarrão (Livre)',
            description: 'Agarra vítima automaticamente após um ataque de mordida bem sucedido.',
            range: 'Corpo a corpo', damage: '0', damageType: 'Agarrado'
          },
          {
            name: 'Bote (Completa)',
            description: 'Faz investida com todos os 3 ataques simultâneos em alvo único.',
            range: 'Movimento', attackCount: 3, damage: 'Especial', damageType: 'corte'
          }
        ],
        abilities: []
      },

      // ─── Sucuri ───────────────────────────────────────────────────────
      {
        name: 'Sucuri',
        type: 'Animal Grande',
        size: 'Grande',
        element: 'Realidade',
        vd: 40,
        defense: 16,
        hpMax: 68, hpCurrent: 68,
        movement: 6,
        alternativeMovements: [{ type: 'Escalar/Nadar', value: 9 }],
        agi: 2, str: 3, int: 0, pre: 1, vig: 3,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 3, fortitudeBonus: 5,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 1,    willBonus: 0,
        additionalSkills: [{ name: 'Furtividade', dice: 2, bonus: 8 }],
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 3, bonus: 10, damage: '1d6+8', damageType: 'corte' },
          {
            name: 'Agarrão (Livre)',
            description: 'Tenta agarrar a presa se acertar mordida (Teste 3d20+12).',
            range: 'Corpo a corpo', dice: 3, bonus: 12, damage: '0', damageType: 'Agarrado'
          },
          {
            name: 'Constrição (Livre)',
            description: 'Causa 2d6+8 de impacto ao início do turno de seres agarrados.',
            range: 'Corpo a corpo', damage: '2d6+8', damageType: 'impacto'
          }
        ],
        abilities: []
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
    console.log('Reality monsters seeded correctly!')
  }
}
