import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class EnergyMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [

      // ─── Anárquico ───────────────────────────────────────────────────
      {
        name: 'Anárquico',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        vd: 20,
        defense: 21,
        hpMax: 30, hpCurrent: 30,
        movement: 9,
        nexImmune: 25,
        resistances: { flatRD: 0, byType: { 'energia': 5 } },
        vulnerabilities: 'conhecimento',
        agi: 3, str: 2, int: 0, pre: 0, vig: 1,
        perceptionDice: -2, perceptionBonus: 0,
        initiativeDice: 3, initiativeBonus: 5,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 3,  reflexBonus: 10,
        willDice: -2,   willBonus: 0,
        attacks: [
          { name: 'Pancada Errática', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '2d12', damageType: 'impacto' },
          {
            name: 'Luz Prismática (Habilidade)',
            description: 'Projeta luz prismática que causa 2d8 de Energia e atordoa (Fortitude DT 14 reduz).',
            range: 'Curto', damage: '2d8', damageType: 'energia'
          },
          {
            name: 'Explosão (Habilidade)',
            description: 'Explosão de energia em área (Reflexos DT 14 reduz).',
            range: 'Área', damage: '2d6', damageType: 'energia'
          },
          {
            name: 'Brilho Enlouquecedor (Livre)',
            description: '1/rodada. 1d6 mental no visual médio (Vontade DT 14).',
            range: 'Médio', damage: '1d6', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Comportamento Errático', description: 'No começo do seu turno, a criatura age de modo aleatório rolando 1d6.' },
          { name: 'Fortalecimento Paranormal (Movimento)', description: 'Buff de +d20 em fisicos e +2d4 Conhec. em ataques baseados no Brilho.' }
        ],
        disturbingPresenceDt: 14, disturbingPresenceDamage: '2d6'
      },

      // ─── Anárquico Descontrolado ──────────────────────────────────────
      {
        name: 'Anárquico Descontrolado',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        vd: 120,
        defense: 28,
        hpMax: 120, hpCurrent: 120,
        movement: 12,
        nexImmune: 50,
        agi: 4, str: 3, int: 2, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 4, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 4,  reflexBonus: 10,
        willDice: 2,    willBonus: 5,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 10, 'corte': 10, 'perfuração': 10, 'energia': 20 } 
        },
        vulnerabilities: 'conhecimento',
        attacks: [
          { name: 'Pancada Energética', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 15, damage: '4d12', damageType: 'impacto' },
          {
            name: 'Autodestruição (Movimento)',
            description: 'Concentra energia e explode, causando 8d12 de dano de Energia em alcance curto (Reflexos DT 25 reduz) e morre imediatamente.',
            range: 'Curto', damage: '8d12', damageType: 'energia'
          },
          {
            name: 'Aceleração (Livre)',
            description: 'Sempre que um alvo sofre dano da pancada energética, entra em estado de aceleração e pode sofrer 4d12 de dano de Energia se realizar ação padrão e de movimento no turno.',
            range: 'Corpo a corpo', damage: '4d12', damageType: 'energia'
          }
        ],
        abilities: [],
        disturbingPresenceDt: 21, disturbingPresenceDamage: '4d6'
      },

      // ─── Anomalia ─────────────────────────────────────────────────────
      {
        name: 'Anomalia',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        vd: 380,
        defense: 0,
        hpMax: 1000, hpCurrent: 1000,
        movement: 0,
        immunities: 'Dano e todas as condições', vulnerabilities: 'conhecimento',
        agi: 0, str: 0, int: 5, pre: 5, vig: 0,
        perceptionDice: 0, perceptionBonus: 0,
        initiativeDice: 0, initiativeBonus: 0,
        fortitudeDice: 5, fortitudeBonus: 15,
        reflexDice: 5,  reflexBonus: 15,
        willDice: 5,    willBonus: 15,
        attacks: [
          {
            name: 'Romper Consciência (Livre)',
            description: 'Sorteia alvo visual e causa 10d6 de dano mental (Vontade DT 41 reduz); absorve a vítima se ela enlouquecer.',
            range: 'Visual', damage: '10d6', damageType: 'mental'
          },
          {
            name: 'Manipular Ondas da Existência (Livre)',
            description: 'Pode ativar/desativar até 6 itens tecnológicos ou sobrecarregá-los, causando 2d12 de dano de Energia por objeto em área (Reflexos DT 30 reduz).',
            range: 'Médio', damage: '2d12', damageType: 'energia'
          }
        ],
        abilities: [
          { name: 'Imaterial', description: 'Possui um corpo físico desprezível e é imune a dano e condições; derrotá-la exige resolver seu Enigma de Medo.' },
          { name: 'Existência Impossível', description: 'Só existe em um objeto ou porta aberta.' },
          { name: 'Manifestar o Impossível (Completa)', description: 'Invoca criaturas de Energia de até 240 VD.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '9d8'
      },

      // ─── Anomiático ───────────────────────────────────────────────────
      {
        name: 'Anomiático',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        vd: 240,
        defense: 41,
        hpMax: 600, hpCurrent: 600,
        movement: 18,
        nexImmune: 75,
        agi: 5, str: 3, int: 1, pre: 4, vig: 3,
        perceptionDice: 4, perceptionBonus: 10,
        initiativeDice: 5, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 5,  reflexBonus: 20,
        willDice: 4,    willBonus: 15,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 10, 'corte': 10, 'perfuração': 10, 'energia': 20 } 
        },
        vulnerabilities: 'conhecimento',
        attacks: [
          { name: 'Garra Desintegradora', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 30, damage: '4d12+20', damageType: 'energia' },
          {
            name: 'Comportamento Errático (Livre)',
            description: 'Rola 1d6 três vezes e age aleatoriamente (salta, facho de energia, explode, risada ou toque extremo).',
            range: 'Variável', damage: 'Especial', damageType: 'energia'
          }
        ],
        abilities: [],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '6d8'
      },

      // ─── Ciborgue ─────────────────────────────────────────────────────
      {
        name: 'Ciborgue',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'energia',
        secondaryElements: 'sangue',
        vd: 80,
        defense: 25,
        hpMax: 160, hpCurrent: 160,
        movement: 9,
        nexImmune: 40,
        immunities: 'Condições de paralisia', vulnerabilities: 'conhecimento',
        agi: 3, str: 3, int: 2, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 3,  reflexBonus: 5,
        willDice: 2,    willBonus: 0,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 10, 'corte': 10, 'perfuração': 10, 'energia': 20 } 
        },
        attacks: [
          { name: 'Braço Laminado (Alpha)', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '1d12+10', damageType: 'corte' },
          { name: 'Punho Energizado (Beta)', range: 'Corpo a corpo', attackCount: 1, dice: 3, bonus: 10, damage: '2d8+10', damageType: 'impacto' },
          { name: 'Canhão (Gama)', range: 'Distância', attackCount: 1, dice: 3, bonus: 10, damage: '4d12+5', damageType: 'energia' },
          { name: 'Raio Energético (Delta)', range: 'Distância', attackCount: 1, dice: 3, bonus: 10, damage: '1d12+5', damageType: 'energia', description: 'Causa Desorientar (alquebra ou atordoa alvo via Vontade DT 20).' },
          {
            name: 'Investida Energética (Completa/Beta)',
            description: 'Avança 24m e ataca (+2d8 dano e derruba).',
            range: '24m', damage: '2d8', damageType: 'impacto'
          }
        ],
        abilities: [
          { name: 'Estado de Combate', description: 'No começo do turno pode alternar entre estados Alpha, Beta, Gama ou Delta.' },
          { name: 'Regeneração Energética', description: 'Recupera 20 PV no começo do turno.' },
          { name: 'Criar Barreira (Movimento/Delta)', description: 'Recebe +5 na Defesa.' },
          { name: 'Reiniciar (Movimento)', description: 'Encerra uma condição.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '2d6'
      },

      // ─── Infecticídio ─────────────────────────────────────────────────
      {
        name: 'Infecticídio',
        type: 'Criatura Enorme',
        size: 'Enorme',
        element: 'energia',
        secondaryElements: 'sangue',
        vd: 280,
        defense: 25,
        hpMax: 600, hpCurrent: 600,
        movement: 9,
        nexImmune: 85,
        vulnerabilities: 'conhecimento',
        agi: 3, str: 5, int: 1, pre: 1, vig: 5,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 15,
        fortitudeDice: 5, fortitudeBonus: 20,
        reflexDice: 3,  reflexBonus: 15,
        willDice: 1,    willBonus: 15,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 20, 'corte': 20, 'perfuração': 20, 'energia': 20 } 
        },
        attacks: [
          { name: 'Pancadas Infectadas', range: 'Corpo a corpo', attackCount: 3, dice: 5, bonus: 30, damage: '4d12+20', damageType: 'energia' },
          {
            name: 'Atropelar (Completa)',
            description: 'Move o dobro e ataca alvos no trajeto.',
            range: 'Movimento', damage: '4d12+20', damageType: 'energia'
          }
        ],
        abilities: [
          { name: 'Horda', description: 'Sofre metade do dano de alvo único, o dobro em área.' },
          { name: 'Infecção (Livre)', description: 'Vítima atingida pelo dano contrai vírus (Fortitude DT 30 evita).' },
          { name: 'Consumação Insidiosa (Reação)', description: 'Recupera 50 PV se derrubar a vítima.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },

      // ─── Perturbado de Energia ───────────────────────────────────────
      {
        name: 'Perturbado de Energia',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        vd: 40,
        defense: 19,
        hpMax: 60, hpCurrent: 60,
        movement: 9,
        nexImmune: 30,
        agi: 4, str: 1, int: 0, pre: 0, vig: 0,
        perceptionDice: -2, perceptionBonus: 0,
        initiativeDice: 4, initiativeBonus: 10,
        fortitudeDice: -2, fortitudeBonus: 0,
        reflexDice: 4,  reflexBonus: 10,
        willDice: -2,   willBonus: 0,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 5, 'corte': 5, 'perfuração': 5, 'energia': 10 } 
        },
        vulnerabilities: 'conhecimento',
        attacks: [
          { name: 'Toque Plasmático', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 10, damage: '2d12', damageType: 'energia' },
          {
            name: 'Implantar Confusão (Livre)',
            description: 'Agarra o alvo após acerto plasmático (4d20+10) e causa 2d8 mental mais vulnerabilidade à Energia (Vontade DT 15 reduz).',
            range: 'Corpo a corpo', damage: '2d8', damageType: 'mental'
          }
        ],
        abilities: [],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '2d8'
      },

      // ─── Sukkalgir ────────────────────────────────────────────────────
      {
        name: 'Sukkalgir',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        secondaryElements: 'conhecimento',
        vd: 160,
        defense: 34,
        hpMax: 220, hpCurrent: 220,
        movement: 18,
        alternativeMovements: [{ type: 'Voo', value: 18 }],
        nexImmune: 55,
        immunities: 'Dano balístico, de corte e de perfuração', vulnerabilities: 'conhecimento',
        agi: 3, str: 2, int: 3, pre: 3, vig: 2,
        perceptionDice: 3, perceptionBonus: 10,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 3,  reflexBonus: 10,
        willDice: 3,    willBonus: 15,
        resistances: { flatRD: 0, byType: { 'impacto': 10, 'energia': 10 } },
        attacks: [
          { name: 'Mordida do Outro Lado', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '2d12', damageType: 'mental' },
          {
            name: 'Aura Desesperada (Passiva/Ataque)',
            description: 'Seres ao redor sofrem 2d12 mental (Vontade DT 25 reduz).',
            range: 'Curto', damage: '2d12', damageType: 'mental'
          },
          {
            name: 'Grito de Desespero (Completa)',
            description: '3d12 mental em alcance médio (Vontade DT 20 reduz).',
            range: 'Médio', damage: '3d12', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Espírito Plasmático', description: 'A criatura é intangível e pode atravessar paredes.' },
          { name: 'Agarrão (Livre)', description: 'Agarra seres de tamanho Médio ou menor (Teste 3d20+15).' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '4d8'
      },

      // ─── Telopsia ─────────────────────────────────────────────────────
      {
        name: 'Telopsia',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        secondaryElements: 'morte',
        vd: 340,
        defense: 48,
        hpMax: 560, hpCurrent: 560,
        movement: 12,
        nexImmune: 99,
        immunities: 'Condições de paralisia', vulnerabilities: 'conhecimento',
        agi: 4, str: 2, int: 3, pre: 5, vig: 2,
        perceptionDice: 5, perceptionBonus: 25,
        initiativeDice: 4, initiativeBonus: 20,
        fortitudeDice: 2, fortitudeBonus: 15,
        reflexDice: 4,  reflexBonus: 20,
        willDice: 5,    willBonus: 25,
        additionalSkills: [{ name: 'Furtividade', dice: 4, bonus: 20 }],
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 20, 'corte': 20, 'perfuração': 20, 'energia': 20 } 
        },
        attacks: [
          { name: 'Toque Desintegrador', range: 'Corpo a corpo', attackCount: 3, dice: 4, bonus: 35, damage: '6d12+30', damageType: 'energia' },
          {
            name: 'Tela Zumbificadora (Padrão)',
            description: 'Causa 6d6 mental e condição de confusão ou fascínio (Vontade DT 30 reduz/evita).',
            range: 'Curto', damage: '6d6', damageType: 'mental'
          },
          {
            name: 'Prender na Tela (Completa)',
            description: 'Desintegra um alvo para a tela, paralisando e gerando 2d12 mental por turno (Fortitude DT 30 evita).',
            range: 'Curto', damage: '2d12', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Viajar pela Tela (Movimento)', description: 'A criatura se desmaterializa em outra tela em alcance longo.' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '10d6'
      },

      // ─── Tempestuoso ──────────────────────────────────────────────────
      {
        name: 'Tempestuoso',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        vd: 360,
        defense: 56,
        hpMax: 950, hpCurrent: 950,
        movement: 24,
        immunities: 'Condições de paralisia', vulnerabilities: 'conhecimento',
        agi: 5, str: 4, int: 2, pre: 5, vig: 4,
        perceptionDice: 5, perceptionBonus: 20,
        initiativeDice: 5, initiativeBonus: 25,
        fortitudeDice: 4, fortitudeBonus: 20,
        reflexDice: 5,  reflexBonus: 30,
        willDice: 5,    willBonus: 25,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 20, 'corte': 20, 'perfuração': 20, 'energia': 20 } 
        },
        attacks: [
          { name: 'Garras Radioativas', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '4d20+20', damageType: 'energia' },
          {
            name: 'Aura Radioativa (Passiva/Ataque)',
            description: '2d20+20 Energia por turno em alvos no curto alcance (Fortitude DT 40 reduz).',
            range: 'Curto', damage: '2d20+20', damageType: 'energia'
          },
          {
            name: 'Raio de Energia Radioativa (Livre)',
            description: 'Se acertar dois ataques, joga um raio em alvo distante, causando 4d20+20 Energia (Reflexos DT 40 reduz).',
            range: 'Longo', damage: '4d20+20', damageType: 'energia'
          },
          {
            name: 'Expandir em Radiação (Completa)',
            description: '10d20+20 Energia em longo alcance à custa de 100 PV (Reflexos DT 40 reduz).',
            range: 'Longo', damage: '10d20+20', damageType: 'energia'
          }
        ],
        abilities: [
          { name: 'Espectro Radioativo', description: 'Ataques corpo a corpo podem atingir curto alcance.' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '8d8'
      },

      // ─── Viajante ─────────────────────────────────────────────────────
      {
        name: 'Viajante',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'energia',
        secondaryElements: 'conhecimento',
        vd: 200,
        defense: 34,
        hpMax: 360, hpCurrent: 360,
        movement: 9,
        alternativeMovements: [{ type: 'Escalada', value: 9 }],
        nexImmune: 60,
        agi: 4, str: 2, int: 3, pre: 4, vig: 2,
        perceptionDice: 4, perceptionBonus: 15,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 2, fortitudeBonus: 10,
        reflexDice: 4,  reflexBonus: 15,
        willDice: 4,    willBonus: 15,
        resistances: { 
          flatRD: 0, 
          byType: { 'balístico': 10, 'corte': 10, 'perfuração': 10, 'energia': 20 } 
        },
        vulnerabilities: 'conhecimento',
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 15, damage: '2d12+10', damageType: 'impacto' },
          {
            name: 'Devorar Memória (Completa)',
            description: 'Causa 4d12 mental, a vítima esquece de um aliado, e o Viajante ganha bônus de dano (Vontade DT 29 reduz e evita).',
            range: 'Corpo a corpo', damage: '4d12', damageType: 'mental'
          }
        ],
        abilities: [
          { name: 'Invisibilidade Permanente', description: 'Possui camuflagem total, +15 em Furtividade.' },
          { name: 'Agarrão (Livre)', description: 'Teste 2d20+15 para agarrar presas.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '6d6'
      },

      // ─── Anfitrião ────────────────────────────────────────────────────
      {
        name: 'Anfitrião',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'conhecimento',
        secondaryElements: 'energia',
        vd: 413,
        defense: 59,
        hpMax: 1413, hpCurrent: 1413,
        movement: 12,
        immunities: 'Condições de paralisia, dano e efeitos de Energia', vulnerabilities: 'conhecimento',
        agi: 7, str: 5, int: 6, pre: 6, vig: 5,
        perceptionDice: 6, perceptionBonus: 25,
        initiativeDice: 7, initiativeBonus: 35,
        fortitudeDice: 5, fortitudeBonus: 25,
        reflexDice: 7,  reflexBonus: 35,
        willDice: 6,    willBonus: 25,
        attacks: [
          { name: 'Corte Caótico (Liber)', range: 'Corpo a corpo', dice: 7, bonus: 45, damage: '3d12+20', damageType: 'energia' },
          { name: 'Lança e Adaga (Plautus)', range: 'Corpo a corpo', attackCount: 2, dice: 7, bonus: 45, damage: '2d12+20', damageType: 'energia' },
          { name: 'Corte de Água (Silenus)', range: 'Corpo a corpo', dice: 7, bonus: 45, damage: '5d12+20', damageType: 'energia', description: 'Causa afogamento/asfixia, Fortitude DT 35 evita.' },
          {
            name: 'Teatro (Amphitruo/Padrão)',
            description: 'Vítima recita texto (Artes DT 35) ou sofre 10d6 mental (Vontade DT 45 evita).',
            range: 'Médio', damage: '10d6', damageType: 'mental'
          },
          {
            name: 'Queimar (Aeneas/Padrão)',
            description: '10d6+20 Energia em cone (Reflexos DT 45).',
            range: 'Curto (Cone)', damage: '10d6+20', damageType: 'energia'
          }
        ],
        abilities: [
          { name: 'Transformar a Morte', description: 'Resolve o enigma do Deus da Morte.' },
          { name: 'Potência de Energia', description: '+35 em testes de AGI e INT, +25 nos demais.' },
          { name: 'Trilha Sonora', description: 'Ato 2: Dano mental passivo e Roleta Maluca aleatória.' },
          { name: 'Teletransporte (Movimento)', description: 'Teletransporte global.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '10d8'
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
    console.log('Energy monsters seeded correctly!')
  }
}
