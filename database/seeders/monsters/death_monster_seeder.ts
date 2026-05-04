import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class DeathMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [
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
        immunities: 'Dano (exceto fogo)',
        vulnerabilities: 'energia',
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
          { name: 'Estacar', description: 'Livre. Acerto de mordida dá +1d10 Morte e agarra (Atletismo DT 20 solta).', range: 'Corpo a corpo', damage: '1d10', damageType: 'morte' },
          { name: 'Desovar Aranhas', description: 'Reação. Ao ficar machucada, desova. Ciclo de 4 turnos com dano mental, dano de Morte em área e nascimento de nova criatura.', range: 'Área', damage: 'Especial', damageType: 'mental/morte' },
          { name: 'Disparar Teia', description: 'Movimento. 3m x 3m, agarra (Reflexos DT 20). 2d8+10 Morte /turno. Rasgar exige 15 corte ou Atletismo 20.', range: 'Curto', damage: '2d8+10', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Percepção Tátil', description: 'Sente tudo pela teia perfeitamente.' },
          { name: 'Enigma de Medo', description: 'Sofrer dano de fogo anula imunidade a dano por 1 turno.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '4d6'
      },
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
        immunities: 'Dano balístico',
        vulnerabilities: 'energia',
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
          { name: 'Pancada Poderosa', description: 'Reação. Crítico da garra empurra 6m; se colidir em objeto/ser, sofre 4d6 impacto.', range: 'Corpo a corpo', damage: '4d6', damageType: 'impacto' },
          { name: 'Comando', description: 'Movimento. Como ritual Perturbação (Vontade DT 29).', range: 'Curto', damage: '0', damageType: 'mental' },
          { name: 'Hipnose', description: 'Padrão. Controle total sobre alvo (Vontade DT 29). Resiste de novo fim de turno.', range: 'Curto', damage: '0', damageType: 'controle' },
          { name: 'Reanimar Corpos', description: 'Completa. 1/cena, invoca 2d4+2 Esqueletos de Lodo.', range: 'Especial', damage: '0', damageType: 'nenhum' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Físico Paranormal', description: 'Salta o dobro do deslocamento.' },
          { name: 'Instinto Mortal', description: 'Se machucado (<=200 PV), usa Hipnose como Livre. Ganha ataque extra de Garra se atacar alvo com as duas.' },
          { name: 'Corpo Fechado', description: 'Mirar na cabeça ignora imunidade a balístico.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '6d6'
      },
      {
        name: 'Ceifador Espiral',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'morte',
        vd: 380,
        defense: 58,
        hpMax: 999, hpCurrent: 999,
        movement: 15,
        immunities: 'Paralisia, dano e efeitos de Morte',
        vulnerabilities: 'energia',
        agi: 5, str: 5, int: 5, pre: 5, vig: 5,
        perceptionDice: 5, perceptionBonus: 20,
        initiativeDice: 5, initiativeBonus: 20,
        fortitudeDice: 5, fortitudeBonus: 25,
        reflexDice: 5, reflexBonus: 25,
        willDice: 5, willBonus: 25,
        resistances: { flatRD: 50, byType: {} },
        attacks: [
          { name: 'Foice da Morte', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '5d10+20', damageType: 'morte' },
          { name: 'Contemplar a Espiral', description: 'Completa. 10d10+30 mental em longo (Vontade DT 43).', range: 'Longo', damage: '10d10+30', damageType: 'mental' },
          { name: 'Cinzas das Terras Desoladas', description: 'Completa. Raio longo vira cinzas; 10d10+20 Morte + Enjoo (Fortitude DT 43 metade/evita). Dano extra 20 Morte quem fica na área.', range: 'Longo', damage: '10d10+20', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Decepar', description: 'Crítico joga vítima a 25 PV, perde 1 atributo permanentemente. Se PV < 25 morre. Ceifador ganha 50 PV temporários e +1d10 dano pra cena.' },
          { name: 'Transporte pelo Pó', description: 'Movimento. Pode teletransportar dentro das cinzas e atacar grátis com a foice.' },
          { name: 'Enigma de Medo', description: 'Quando resolvido, perde resistência a dano e anula Terras Desoladas.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '9d8'
      },
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
          { name: 'Punho Espinhento', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '2d8+8', damageType: 'impacto', additionalDamages: [{ damage: '2d12', damageType: 'morte' }] }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Imortalidade', description: 'Desfaz como poça ao morrer; volta em 1d2 rodadas com 70 PV. Sofrer 20 dano (Fogo/Energia) na poça destrói permanentemente.' },
          { name: 'Veneno Pútrido', description: 'O primeiro ataque causa veneno. Fortitude DT 23 todo turno ou sofre 4d12 Morte.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '4d6'
      },
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
          { name: 'Vomitar Lodo', description: 'Movimento. 1/cena por cópia, 4d10+10 Morte e Lento em curto (Reflexos DT 25).', range: 'Curto', damage: '4d10+10', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Multiplicação Melódica', description: 'Gera cópias do Escutado (145 PV sem imunidade).' },
          { name: 'Enigma de Medo', description: 'Tocar melodia por 4 turnos anula a sua imunidade a dano.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '4d8'
      },
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
          { name: 'Espiral de Lodo', description: 'Completa. 9m em linha reta vira lodo perfurante. 2d10 Morte (Reflexos DT 14).', range: '9m Linha', damage: '2d10', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Imortalidade', description: 'Retorna da morte (poça) em 1d3 rodadas. Dano Fogo/Energia destrói definitivo.' }
        ],
        disturbingPresenceDt: 14, disturbingPresenceDamage: '2d4'
      },
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
          { name: 'Reflexos Guiados por Corda', description: 'Reação. 1x/rodada ataca quem fica adjacente a ela.', range: 'Corpo a corpo', dice: 5, bonus: 30, damage: '10d8+10', damageType: 'morte' },
          { name: 'Ironia do Destino', description: 'Completa. Se acerta dois golpes adjacentes, agarra com a arma, divide qualquer dano sofrido com o alvo.', range: 'Corpo a corpo', damage: '0', damageType: 'agarrado' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Momento Passivo', description: 'Não tem deslocamento reduzido, ignora terreno difícil e imune a efeitos/dano no chão.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },
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
          { name: 'Vomitar Lodo', range: 'Distância', attackCount: 2, dice: 5, bonus: 15, damage: '3d6+30', damageType: 'morte', additionalDamages: [{ damage: '3d8', damageType: 'mental' }] },
          { name: 'Agarrada Mumificadora', description: 'Livre. Acerto de Garra agarra. Drena 4d8+30 Morte por turno (e se cura). A zero PV converte vítima em Esqueleto de Lodo.', range: 'Corpo a corpo', damage: '4d8+30', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Faixas da Permanência', description: 'A 0 PV não morre logo. Se não regenerar ao menos 1 PV no final do seu próximo turno, é destruída.' },
          { name: 'Amalgamar', description: 'Padrão. Com 0 PV se amalgama a corpo morto/monstro de Morte, cura 200 PV e ganha buff agressivo de Garra (+5 e +ataque). Pode fazer até 2x.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '6d8'
      },
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
          { name: 'Reverter', description: 'Livre. O dano de garra deixa o alvo Enjoado.', range: 'Corpo a corpo', damage: '0', damageType: 'status' }
        ],
        abilities: [
          { name: 'Faro', description: 'Habilidade Passiva.' },
          { name: 'Caçador Veloz', description: 'Move normalmente enquanto em Furtividade.' },
          { name: 'Regeneração Acelerada', description: 'Cura Acelerada 50. (Perde se o enigma for resolvido).' },
          { name: 'Senso de Direção Perfeito', description: '+2d20 Percepção/Sobrevivência (Perde se enigma resolvido).' },
          { name: 'Rastrear e Abater', description: 'Livre. Causa +6d6 de dano contra alvos desprevenidos.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },
      {
        name: 'Sempiternal',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'morte',
        vd: 360,
        defense: 53,
        hpMax: 990, hpCurrent: 990,
        movement: 12,
        immunities: 'Paralisia, dano e efeitos de Morte',
        vulnerabilities: 'energia',
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
          { name: 'Correntes de Lodo', description: 'Movimento. 20d6 Morte em todos em médio alcance (Fortitude DT 40 metade). Se machucar, dá vulnerabilidade a Morte. Se 0 PV -> vira Enraizado.', range: 'Médio', damage: '20d6', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Toque Acelerador', description: 'O dano dos dedos envelhece o alvo em 1d10 anos. 20 anos = Fraco; 40 anos = Debilitado; 60 anos = Morto.' }
        ],
        disturbingPresenceDt: 40, disturbingPresenceDamage: '8d8'
      },
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
          { name: 'Sucção', description: 'Livre. Agarra a face (Fortitude DT 17). Se falhar = Inconsciente, e no próximo turno cai pra 0 PV (Morrendo). Solta se sofrer 10+ dano.', range: 'Corpo a corpo', damage: '0', damageType: 'asfixia' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '3d6'
      },
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
        immunities: 'Atordoado, paralisia, dano e efeitos de Morte',
        vulnerabilities: 'energia',
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
          { name: 'Agarrão', description: 'Livre. Agarra ser de tamanho Médio ou menor (6d20+47).', range: 'Corpo a corpo', dice: 6, bonus: 47, damage: '0', damageType: 'agarrado' },
          { name: 'Espiral Descendente', description: 'Movimento. Envelhece o ser agarrado em 3d20 anos (a soma = dano mental sofrido).', range: 'Corpo a corpo', damage: '3d20', damageType: 'mental' },
          { name: 'Espiral Destrutiva', description: 'Padrão. 12m raio em alcance longo, 10d10+50 Morte (Fortitude DT 45 reduz à metade).', range: 'Longo', damage: '10d10+50', damageType: 'morte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Ciclo Infinito', description: 'Cura 50 PV/turno. A 0 PV manifesta em cadáver/pessoa com alta NEX na hora, restaurado a 100%. (O Enigma o remove).' },
          { name: 'Destruir o Diabo', description: 'Resolve o enigma do Diabo.' },
          { name: 'Potência de Morte', description: 'Modificador +35 em FOR/VIG/PRE, e +25 para o resto.' },
          { name: 'Senhor do Tempo', description: 'Ao rolar o d20 de Iniciativa ganha 1 turno a mais.' },
          { name: 'Controlar Mortos', description: 'Movimento. Manda criatura de Morte agir em alcance longo.' },
          { name: 'Controlar Relógio Interno', description: 'Livre. Encerra 2 condições.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '10d8'
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
  }
}