import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class BloodMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [

      // ─── Aberração de Carne ───────────────────────────────────────────
      {
        name: 'Aberração de Carne',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'sangue',
        vd: 40,
        defense: 19,
        hpMax: 70, hpCurrent: 70,
        movement: 9,
        nexImmune: 30,
        vulnerabilities: 'morte',
        agi: 1, str: 3, int: 0, pre: 1, vig: 3,
        perceptionDice: 1, perceptionBonus: 5,
        initiativeDice: 1, initiativeBonus: 0,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 1,  reflexBonus: 0,
        willDice: 1,    willBonus: 0,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'impacto': 5, 'perfuração': 5, 'sangue': 10 }
        },
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '2d6+6', damageType: 'impacto' },
          { 
            name: 'Agarrão (Reação)', 
            description: 'Se acertar pancada, tenta agarrar (teste 3d20+12). Mantém até 2 alvos.',
            range: 'Corpo a corpo', dice: 3, bonus: 12, damage: '0', damageType: 'agarrado' 
          },
          { 
            name: 'Abocanhar (Movimento)', 
            description: 'Leva até 2 agarrados para a boca. 3d6 perfuração (Fortitude DT 15 metade) agora e início de turno.',
            range: 'Corpo a corpo', damage: '3d6', damageType: 'perfuração' 
          }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '3d6'
      },

      // ─── Aniquilação ──────────────────────────────────────────────────
      {
        name: 'Aniquilação',
        type: 'Criatura Colossal',
        size: 'Colossal',
        element: 'sangue',
        vd: 380,
        defense: 58,
        hpMax: 1200, hpCurrent: 1200,
        movement: 15,
        vulnerabilities: 'morte',
        agi: 4, str: 5, int: 3, pre: 4, vig: 5,
        perceptionDice: 4, perceptionBonus: 20,
        initiativeDice: 4, initiativeBonus: 20,
        fortitudeDice: 5, fortitudeBonus: 30,
        reflexDice: 4,  reflexBonus: 25,
        willDice: 4,    willBonus: 20,
        additionalSkills: [{ name: 'Atletismo', dice: 5, bonus: 20 }],
        resistances: { flatRD: 50, byType: {} },
        attacks: [
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '4d10+30', damageType: 'sangue' },
          { name: 'Tentáculos Espinhentos', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '2d12+30', damageType: 'sangue' },
          { name: 'Disparo de Espinhos', range: 'Médio', attackCount: 3, dice: 4, bonus: 40, damage: '2d10+20', damageType: 'sangue' },
          { 
            name: 'Apertar e Destruir (Livre)', 
            description: 'Início do turno: 40 de Sangue em quem estiver agarrado.',
            range: 'Corpo a corpo', damage: '40', damageType: 'sangue' 
          },
          { 
            name: 'Bater as Asas (Movimento)', 
            description: 'Alcance longo: 8d6 Mental, empurra 6m e Atordoa (Fortitude DT 40 reduz metade/evita).',
            range: 'Longo', damage: '8d6', damageType: 'mental' 
          },
          { 
            name: 'Estrangulamento Final (Movimento)', 
            description: 'Move 15m asfixiando adjacentes (Reflexos DT 30 evita).',
            range: '15m', damage: 'Especial', damageType: 'morte' 
          },
          { 
            name: 'Tempestade de Espinhos (Completa)', 
            description: '1/cena. Médio sofre 20d6+20 Sangue (Reflexos DT 40 metade). Perde disparos.',
            range: 'Médio', damage: '20d6+20', damageType: 'sangue' 
          },
          { 
            name: 'Agarrão (Reação)', 
            description: 'Se acertar tentáculos, tenta agarrar (teste 5d20+50). Mantém até 4.',
            range: 'Corpo a corpo', dice: 5, bonus: 50, damage: '0', damageType: 'agarrado' 
          }
        ],
        abilities: [
          { name: 'Instinto Aniquilador', description: 'Reação. Se alguém mover +3m em curto, ataca com tentáculos.' },
          { name: 'Enigma de Medo', description: 'Resolvido: perde resistência e Tempestade de Espinhos.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '9d8'
      },

      // ─── Carente ──────────────────────────────────────────────────────
      {
        name: 'Carente',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'sangue',
        secondaryElements: 'morte',
        vd: 300,
        defense: 40,
        hpMax: 700, hpCurrent: 700,
        movement: 12,
        nexImmune: 90,
        vulnerabilities: 'morte',
        agi: 4, str: 4, int: 2, pre: 3, vig: 4,
        perceptionDice: 3, perceptionBonus: 10,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 4, fortitudeBonus: 25,
        reflexDice: 4,  reflexBonus: 25,
        willDice: 3,    willBonus: 15,
        additionalSkills: [{ name: 'Atletismo', dice: 4, bonus: 20 }, { name: 'Enganação', dice: 3, bonus: 15 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Garras de Sangue', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 35, damage: '2d8+20', damageType: 'sangue' },
          { name: 'Ferrão de Sangue', range: 'Corpo a corpo', attackCount: 1, dice: 4, bonus: 35, damage: '2d12+20', damageType: 'sangue' },
          { name: 'Tentáculo', range: 'Corpo a corpo', attackCount: 1, dice: 4, bonus: 35, damage: '2d8+20', damageType: 'sangue' },
          { 
            name: 'Rasteira de Tentáculo (Reação)', 
            description: '1/rodada, adjacente a 2+, ataque de tentáculo derruba e empurra 6m.',
            range: 'Corpo a corpo', dice: 4, bonus: 35, damage: '0', damageType: 'derrubar' 
          },
          { 
            name: 'Sugada Mortal (Livre)', 
            description: 'Alvo do ferrão fica Debilitado e Enjoado (Fortitude DT 35 evita).',
            range: 'Corpo a corpo', damage: '0', damageType: 'enjoo' 
          },
          { 
            name: 'Você é minha mamãe? (Movimento)', 
            description: 'Abraça alvo. Ele fica Paralisado (Reflexos DT 25 evita). Solto com dano de Energia.',
            range: 'Corpo a corpo', damage: '0', damageType: 'paralisia' 
          }
        ],
        abilities: [
          { name: 'Carência', description: 'Ser que já gerou outro recebe +d20 em testes contra ele (e vice-versa).' },
          { name: 'Regeneração de Sangue', description: 'Cura Acelerada 20. Para se sofrer Energia.' },
          { name: 'Forma Infantil', description: 'Passa em locais pequenos.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '7d8'
      },

      // ─── Dama de Sangue ───────────────────────────────────────────────
      {
        name: 'Dama de Sangue',
        type: 'Criatura Enorme',
        size: 'Enorme',
        element: 'sangue',
        secondaryElements: 'morte',
        vd: 60,
        defense: 20,
        hpMax: 105, hpCurrent: 105,
        movement: 12,
        nexImmune: 35,
        vulnerabilities: 'morte',
        agi: 2, str: 3, int: 1, pre: 2, vig: 2,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 0,
        fortitudeDice: 2, fortitudeBonus: 10,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 2,    willBonus: 0,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Tentáculo', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '2d6+5', damageType: 'impacto' },
          { 
            name: 'Arremessar (Flor Rosa)', 
            description: 'Movimento. Arremessa alvo curto, 2d6 impacto + Caído (Reflexos DT 15 evita).',
            range: 'Curto', damage: '2d6', damageType: 'impacto' 
          },
          { 
            name: 'Chuva de Ácido (Flor Vermelha)', 
            description: 'Movimento. 4d4 Químico em curto (Fortitude DT 15 metade).',
            range: 'Curto', damage: '4d4', damageType: 'químico' 
          },
          { 
            name: 'Espinhos (Flor Amarela)', 
            description: 'Movimento. 3 alvos médio, 2d8 perfuração (Reflexos DT 15 metade).',
            range: 'Médio', attackCount: 3, damage: '2d8', damageType: 'perfuração' 
          },
          { 
            name: 'Grito Devastador (Flor Roxa)', 
            description: 'Movimento. Confusão em curto (Vontade DT 15 evita).',
            range: 'Curto', damage: '0', damageType: 'mental' 
          },
          { 
            name: 'Miasma Fétido (Flor Azul)', 
            description: 'Padrão. Enjoo por 1d4+1 rodadas em curto (Fortitude DT 15 reduz p/ 1).',
            range: 'Curto', damage: '0', damageType: 'químico' 
          },
          { 
            name: 'Prisão de Tentáculos (Flor Verde)', 
            description: 'Padrão. Agarra alvo curto até tentáculos (20 PV) serem destruídos.',
            range: 'Curto', damage: '0', damageType: 'agarrado' 
          },
          { 
            name: 'Visão Macabra (Flor Laranja)', 
            description: 'Movimento. 1d6 mental em médio (Vontade DT 15 metade).',
            range: 'Médio', damage: '1d6', damageType: 'mental' 
          }
        ],
        abilities: [
          { name: 'Consumir', description: 'Ganha habilidades das flores ao consumir cadáveres adjacentes.' },
          { name: 'Enigma de Medo', description: 'Resolvido: exige explorar fraquezas botânicas de cada flor.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '3d6'
      },

      // ─── Enpap-X ──────────────────────────────────────────────────────
      {
        name: 'Enpap-X',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'sangue',
        secondaryElements: 'conhecimento',
        vd: 180,
        defense: 36,
        hpMax: 360, hpCurrent: 360,
        movement: 12,
        nexImmune: 60,
        vulnerabilities: 'morte',
        agi: 2, str: 4, int: 1, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 15,
        reflexDice: 2,  reflexBonus: 15,
        willDice: 2,    willBonus: 10,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Socão', range: 'Corpo a corpo', attackCount: 4, dice: 4, bonus: 20, damage: '2d10+10', damageType: 'impacto' },
          { name: 'Correntes', range: 'Curto', attackCount: 3, dice: 2, bonus: 15, damage: '2d8+10', damageType: 'impacto' },
          { 
            name: 'Acorrentar (Livre)', 
            description: 'Acerto de correntes: tenta agarrar (teste 2d20+17). Estrangula (4d6 impacto).',
            range: 'Curto', dice: 2, bonus: 17, damage: '4d6', damageType: 'impacto' 
          },
          { 
            name: 'Marcas do Terror (Movimento)', 
            description: '4d6 mental (Vontade DT 25 metade).',
            range: 'Curto', damage: '4d6', damageType: 'mental' 
          }
        ],
        abilities: [
          { name: 'Transformação', description: 'Começa como Existido. Morreu: vira Enpap-X com full HP.' },
          { name: 'Forma Desencadeada (Reação)', description: 'Crítico: Derruba ou Empurra 3m.' },
          { name: 'Crescer (Reação)', description: 'Acerto de socão: +1d6 no próximo socão do turno.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '6d6'
      },

      // ─── Kerberos ─────────────────────────────────────────────────────
      {
        name: 'Kerberos',
        type: 'Criatura Enorme',
        size: 'Enorme',
        element: 'sangue',
        vd: 340,
        defense: 46,
        hpMax: 1150, hpCurrent: 1150,
        movement: 18,
        nexImmune: 99,
        vulnerabilities: 'morte',
        agi: 4, str: 5, int: 0, pre: 3, vig: 5,
        perceptionDice: 3, perceptionBonus: 20,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 5, fortitudeBonus: 25,
        reflexDice: 4,  reflexBonus: 20,
        willDice: 3,    willBonus: 15,
        additionalSkills: [{ name: 'Atletismo', dice: 5, bonus: 25 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 5, bonus: 40, damage: '4d12+30', damageType: 'sangue' },
          { name: 'Disparo de Espinhos', range: 'Médio', attackCount: 1, dice: 4, bonus: 35, damage: '4d8+20', damageType: 'sangue' },
          { 
            name: 'Devorar (Livre)', 
            description: '1/cena. Se matar com mordida, devora (Fortitude DT 40 evita morte) e recupera metade do PV do alvo.',
            range: 'Corpo a corpo', damage: 'Especial', damageType: 'sangue' 
          },
          { 
            name: 'Derrubar e Devorar (Completa)', 
            description: 'Tenta derrubar (5d20+45). Venceu: faz 3 mordidas causando 4d12+40 cada.',
            range: 'Corpo a corpo', dice: 5, bonus: 45, damage: 'Especial', damageType: 'sangue' 
          }
        ],
        abilities: [
          { name: 'Ataque Flexível', description: '4 ataques/rodada, máximo 3 iguais.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '10d6'
      },

      // ─── Minotauro ────────────────────────────────────────────────────
      {
        name: 'Minotauro',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'sangue',
        vd: 280,
        defense: 44,
        hpMax: 750, hpCurrent: 750,
        movement: 12,
        nexImmune: 80,
        vulnerabilities: 'morte',
        agi: 4, str: 5, int: 1, pre: 3, vig: 5,
        perceptionDice: 3, perceptionBonus: 20,
        initiativeDice: 4, initiativeBonus: 15,
        fortitudeDice: 5, fortitudeBonus: 20,
        reflexDice: 4,  reflexBonus: 15,
        willDice: 3,    willBonus: 10,
        additionalSkills: [{ name: 'Atletismo', dice: 5, bonus: 20 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Chifres', range: 'Corpo a corpo', attackCount: 1, dice: 5, bonus: 30, damage: '6d12+20', damageType: 'perfuração' },
          { name: 'Machado', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 32, damage: '4d12+20', damageType: 'corte' },
          { 
            name: 'Pisotear (Movimento)', 
            description: 'Pisa em seres Médios ou menor no caminho. 4d10+20 impacto + Caído (Reflexos DT 30 metade e evita queda).',
            range: 'Movimento', damage: '4d10+20', damageType: 'impacto' 
          },
          { 
            name: 'Rugido Aterrorizante (Padrão)', 
            description: 'Em curto: apavorado por 1d4 rodadas (Vontade DT 30 evita). Outros ficam abalados.',
            range: 'Curto', damage: '0', damageType: 'mental' 
          }
        ],
        abilities: [
          { name: 'Labirinto Mental', description: 'Imune a labirintos e efeitos de confusão.' },
          { name: 'Fúria Bovina (Reação)', description: 'Se sofrer dano, ganha +2 em ataques e dano até fim da cena (cumulativo 5x).' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },

      // ─── Nereida ──────────────────────────────────────────────────────
      {
        name: 'Nereida',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'sangue',
        secondaryElements: 'morte',
        vd: 140,
        defense: 29,
        hpMax: 210, hpCurrent: 210,
        movement: 9,
        nexImmune: 50,
        vulnerabilities: 'energia',
        agi: 3, str: 3, int: 2, pre: 3, vig: 3,
        perceptionDice: 3, perceptionBonus: 15,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 15,
        reflexDice: 3,  reflexBonus: 15,
        willDice: 3,    willBonus: 10,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Tentáculo Espinhoso', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 20, damage: '2d8+10', damageType: 'perfuração' },
          { 
            name: 'Jato (Movimento)', 
            description: 'Jato de sangue ácido. 6d6 químico alcance médio (Reflexos DT 25 metade).',
            range: 'Médio', damage: '6d6', damageType: 'químico' 
          },
          { 
            name: 'Abraço Mortífero (Completa)', 
            description: 'Agarra alvo. 3d10 Sangue por rodada + sufocamento rápida.',
            range: 'Corpo a corpo', damage: '3d10', damageType: 'sangue' 
          }
        ],
        abilities: [
          { name: 'Canto da Sereia (Padrão)', description: 'Fascina seres em alcance médio (Vontade DT 25 evita).' },
          { name: 'Anfíbio', description: 'Respira na água.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '5d6'
      },

      // ─── O Diabo ──────────────────────────────────────────────────────
      {
        name: 'O Diabo',
        type: 'Relíquia Médio',
        size: 'Médio',
        element: 'sangue',
        secondaryElements: 'conhecimento',
        vd: 400,
        defense: 60,
        hpMax: 1500, hpCurrent: 1500,
        movement: 15,
        agi: 5, str: 6, int: 5, pre: 6, vig: 6,
        perceptionDice: 6, perceptionBonus: 25,
        initiativeDice: 5, initiativeBonus: 35,
        fortitudeDice: 6, fortitudeBonus: 35,
        reflexDice: 5,  reflexBonus: 35,
        willDice: 6,    willBonus: 35,
        resistances: {
          flatRD: 40,
          byType: { 'sangue': 100 }
        },
        attacks: [
          { name: 'Tridente do Ódio', range: 'Corpo a corpo', attackCount: 3, dice: 6, bonus: 45, damage: '4d12+40', damageType: 'sangue' },
          { 
            name: 'Comandar o Caos (Livre)', 
            description: '1/rodada. Alvos em médio atacam uns aos outros (Vontade DT 48 evita).',
            range: 'Médio', damage: '0', damageType: 'mental' 
          },
          { 
            name: 'Explosão de Êxtase (Completa)', 
            description: 'Curto: 20d10 Sangue + Enlouquecido (Fortitude DT 48 metade).',
            range: 'Curto', damage: '20d10', damageType: 'sangue' 
          },
          { 
            name: 'Pular na Garganta (Movimento)', 
            description: 'Teleporta e ataca com Tridente (+2d12 dano).',
            range: 'Médio', damage: '6d12+40', damageType: 'sangue' 
          }
        ],
        abilities: [
          { name: 'O Trato', description: 'Pode oferecer desejos em troca de sanidade/servidão.' },
          { name: 'Onipresença (Livre)', description: 'Teletransporte ilimitado.' },
          { name: 'Regeneração Sangrenta', description: 'Cura Acelerada 50. Só para com Morte Verdadeira.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 48, disturbingPresenceDamage: '15d6'
      },

      // ─── Terror de Duas Cabeças ───────────────────────────────────────
      {
        name: 'Terror de Duas Cabeças',
        type: 'Criatura Enorme',
        size: 'Enorme',
        element: 'sangue',
        vd: 220,
        defense: 35,
        hpMax: 450, hpCurrent: 450,
        movement: 15,
        nexImmune: 70,
        vulnerabilities: 'morte',
        agi: 3, str: 5, int: 0, pre: 3, vig: 4,
        perceptionDice: 3, perceptionBonus: 15,
        initiativeDice: 3, initiativeBonus: 10,
        fortitudeDice: 4, fortitudeBonus: 20,
        reflexDice: 3,  reflexBonus: 15,
        willDice: 3,    willBonus: 10,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Duas Mordidas', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 25, damage: '3d12+15', damageType: 'sangue' },
          { name: 'Patada', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 25, damage: '2d10+15', damageType: 'impacto' },
          { 
            name: 'Garras de Sangue (Reação)', 
            description: 'Se for atacado, realiza contra-ataque de patada.',
            range: 'Corpo a corpo', dice: 5, bonus: 25, damage: '2d10+15', damageType: 'impacto' 
          },
          { 
            name: 'Atropelar (Completa)', 
            description: 'Move 15m. Tudo no caminho sofre 6d10 impacto + Caído (Reflexos DT 28 metade).',
            range: '15m', damage: '6d10', damageType: 'impacto' 
          }
        ],
        abilities: [
          { name: 'Duas Cabeças', description: 'Faz 2 testes de percepção/iniciativa e escolhe o melhor. Imune a flanqueado.' },
          { name: 'Fúria Incontrolável', description: 'Metade do HP: ganha +2d20 de ataque mas perde esquiva.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '6d8'
      },

      // ─── Zumbi de Sangue ──────────────────────────────────────────────
      {
        name: 'Zumbi de Sangue',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'sangue',
        vd: 20,
        defense: 12,
        hpMax: 45, hpCurrent: 45,
        movement: 6,
        nexImmune: 25,
        vulnerabilities: 'morte',
        agi: 1, str: 2, int: 0, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 1,    willBonus: 5,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'impacto': 5, 'perfuração': 5, 'sangue': 10 }
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d8+5', damageType: 'sangue' },
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 5, damage: '1d6+5', damageType: 'corte' },
          { 
            name: 'Abocanhar (Movimento)', 
            description: 'Se mordeu, fica agarrado. Próxima mordida tem +d20.',
            range: 'Corpo a corpo', damage: '0', damageType: 'agarrado' 
          }
        ],
        abilities: [
          { name: 'Lerdeza', description: 'Sempre age por último na rodada.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '1d8'
      },

      // ─── Zumbi de Sangue Bestial ──────────────────────────────────────
      {
        name: 'Zumbi de Sangue Bestial',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'sangue',
        vd: 60,
        defense: 18,
        hpMax: 90, hpCurrent: 90,
        movement: 12,
        nexImmune: 35,
        vulnerabilities: 'morte',
        agi: 3, str: 3, int: 0, pre: 1, vig: 2,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 2,  reflexBonus: 5,
        willDice: 2,    willBonus: 5,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'impacto': 5, 'perfuração': 5, 'sangue': 10 }
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 3, bonus: 10, damage: '2d8+5', damageType: 'sangue' },
          { name: 'Garras x2', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '1d8+5', damageType: 'corte' }
        ],
        abilities: [
          { name: 'Bote (Completa)', description: 'Faz carga e realiza todos os ataques juntos.' },
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. A criatura percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '2d8'
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
    console.log('Blood monsters seeded CORRECTLY (Interactions fixed)!')
  }
}