import Monster from '#models/monster'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class BloodMonsterSeeder extends BaseSeeder {
  async run() {
    const monsters: any[] = [
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
        reflexDice: 1, reflexBonus: 0,
        willDice: 1, willBonus: 0,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'impacto': 5, 'perfuração': 5, 'sangue': 10 }
        },
        attacks: [
          { name: 'Pancada', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '2d6+6', damageType: 'impacto' },
          { name: 'Agarrão', description: 'Reação. Se acertar um ataque de pancada, pode tentar agarrar (teste 3d20+12). Pode manter até dois personagens agarrados por vez.', range: 'Corpo a corpo', dice: 3, bonus: 12, damage: '0', damageType: 'agarrado' },
          { name: 'Abocanhar', description: 'Movimento. Leva até dois personagens agarrados para dentro da boca. O personagem sofre 3d6 pontos de dano de perfuração (Fortitude DT 15 reduz à metade) ao ser abocanhado e no início de cada turno.', range: 'Corpo a corpo', damage: '3d6', damageType: 'perfuração' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva. Percebe o ambiente usando outros sentidos que não a visão.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '3d6'
      },
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
        reflexDice: 4, reflexBonus: 25,
        willDice: 4, willBonus: 20,
        additionalSkills: [{ name: 'Atletismo', dice: 5, bonus: 20 }],
        resistances: { flatRD: 50, byType: {} },
        attacks: [
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '4d10+30', damageType: 'sangue' },
          { name: 'Tentáculos Espinhentos', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 40, damage: '2d12+30', damageType: 'sangue' },
          { name: 'Disparo de Espinhos', range: 'Médio', attackCount: 3, dice: 4, bonus: 40, damage: '2d10+20', damageType: 'sangue' },
          { name: 'Agarrão', description: 'Reação. Se acertar um ataque de tentáculos, pode tentar agarrar (teste 5d20+50). Mantém até 4 personagens agarrados por vez.', range: 'Corpo a corpo', dice: 5, bonus: 50, damage: '0', damageType: 'agarrado' },
          { name: 'Instinto Aniquilador', description: 'Reação. Sempre que um personagem em alcance curto se movimenta mais do que 3m, realiza um ataque de tentáculos espinhentos contra ele.', range: 'Curto', damage: 'Especial', damageType: 'sangue' },
          { name: 'Apertar e Destruir', description: 'Livre. No início do seu turno, causa 40 pontos de dano de Sangue aos personagens agarrados.', range: 'Corpo a corpo', damage: '40', damageType: 'sangue' },
          { name: 'Bater as Asas', description: 'Movimento. Personagens em alcance longo sofrem 8d6 pontos de dano Mental, empurrados 6m e ficam atordoados por 1 rodada (Fortitude DT 40 reduz metade e evita efeitos).', range: 'Longo', damage: '8d6', damageType: 'mental' },
          { name: 'Estrangulamento Final', description: 'Movimento. Desloca 15m agarrando e asfixiando os adjacentes (Reflexos DT 30 evita). Escapar gasta ação padrão + Reflexos (DT 30).', range: 'Corpo a corpo', damage: 'Especial', damageType: 'morte' },
          { name: 'Tempestade de Espinhos', description: 'Completa. Alcance médio sofre 20d6+20 dano de Sangue (Reflexos DT 40 reduz metade). 1x por cena. Perde o ataque "Disparo de Espinhos" até o fim da cena.', range: 'Médio', damage: '20d6+20', damageType: 'sangue' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Enigma de Medo', description: 'Quando resolvido, perde sua resistência a dano e sua habilidade Tempestade de Espinhos.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '9d8'
      },
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
        reflexDice: 4, reflexBonus: 25,
        willDice: 3, willBonus: 15,
        additionalSkills: [{ name: 'Atletismo', dice: 4, bonus: 20 }, { name: 'Enganação', dice: 3, bonus: 15 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Garras de Sangue', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 35, damage: '2d8+20', damageType: 'sangue' },
          { name: 'Ferrão de Sangue', range: 'Corpo a corpo', attackCount: 1, dice: 4, bonus: 35, damage: '2d12+20', damageType: 'sangue' },
          { name: 'Tentáculo', range: 'Corpo a corpo', attackCount: 1, dice: 4, bonus: 35, damage: '2d8+20', damageType: 'sangue' },
          { name: 'Forma Infantil', description: 'Movimento. Contorce de volta para o corpo da criança para passar em espaços pequenos. Não abre a primeira porta.', range: 'Pessoal', damage: '0', damageType: 'nenhum' },
          { name: 'Rasteira de Tentáculo', description: 'Reação. 1x por rodada, adjacente a 2+ seres, ataque de tentáculo derruba e empurra 6m.', range: 'Corpo a corpo', damage: '0', damageType: 'impacto' },
          { name: 'Sugada Mortal', description: 'Livre. Alvo do ferrão fica debilitado e enjoado (Fortitude DT 35 evita).', range: 'Corpo a corpo', damage: '0', damageType: 'status' },
          { name: 'Você é minha mamãe?', description: 'Movimento. Abraça um alvo que fica paralisado (Reflexos DT 25 evita). Solto se o carente sofrer dano de Energia.', range: 'Corpo a corpo', damage: '0', damageType: 'paralisia' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Carência', description: 'Ser que já gerou/gestou outro ser recebe +d20 em ataques contra ele, porém o carente também recebe +d20 em ataques contra esse ser.' },
          { name: 'Regeneração de Sangue', description: 'Cura Acelerada 20. Desativa se inconsciente ou sofrer dano de Energia.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '7d8'
      },
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
        reflexDice: 2, reflexBonus: 5,
        willDice: 2, willBonus: 0,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Tentáculo', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 10, damage: '2d6+5', damageType: 'impacto' },
          { name: 'Arremessar (Flor Rosa)', description: 'Movimento. Arremessa alvo curto, 2d6 impacto + caído (Reflexos DT 15 evita).', range: 'Curto', damage: '2d6', damageType: 'impacto' },
          { name: 'Chuva de Ácido (Flor Vermelha)', description: 'Movimento. 4d4 químico em alcance curto (Fortitude DT 15 metade).', range: 'Curto', damage: '4d4', damageType: 'químico' },
          { name: 'Espinhos (Flor Amarela)', description: 'Movimento. 3 alvos médio, 2d8 perfuração (Reflexos DT 15 metade).', range: 'Médio', damage: '2d8', damageType: 'perfuração' },
          { name: 'Grito Devastador (Flor Roxa)', description: 'Movimento. Confusão alcance curto (Vontade DT 15 evita).', range: 'Curto', damage: '0', damageType: 'mental' },
          { name: 'Miasma Fétido (Flor Azul)', description: 'Padrão. Enjoo por 1d4+1 rodadas alcance curto (Fortitude DT 15 reduz para 1).', range: 'Curto', damage: '0', damageType: 'status' },
          { name: 'Prisão de Tentáculos (Flor Verde)', description: 'Padrão. Agarra alvo curto até tentáculos (20 PV) serem destruídos.', range: 'Curto', damage: '0', damageType: 'agarrado' },
          { name: 'Visão Macabra (Flor Laranja)', description: 'Movimento. 1d6 mental alcance médio (Vontade DT 15 metade).', range: 'Médio', damage: '1d6', damageType: 'mental' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Consumir', description: 'Precisa gastar ação padrão adjacente a cadáveres. Cada um dá uma habilidade nova.' },
          { name: 'Enigma de Medo', description: 'Exige explorar cada fraqueza botânica listada nas habilidades.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '3d6'
      },
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
        reflexDice: 2, reflexBonus: 15,
        willDice: 2, willBonus: 10,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Socão', range: 'Corpo a corpo', attackCount: 4, dice: 4, bonus: 20, damage: '2d10+10', damageType: 'impacto' },
          { name: 'Correntes', range: 'Curto', attackCount: 3, dice: 2, bonus: 15, damage: '2d8+10', damageType: 'impacto' },
          { name: 'Acorrentar', description: 'Livre. Se acertar corrente, pode tentar agarrar à distância (teste 2d20+17). Estrangula no início do turno (4d6 impacto).', range: 'Curto', dice: 2, bonus: 17, damage: '4d6', damageType: 'impacto' },
          { name: 'Marcas do Terror', description: 'Movimento. 4d6 mental (Vontade DT 25 reduz metade).', range: 'Especial', damage: '4d6', damageType: 'mental' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Transformação', description: 'Inicia o combate usando as estatísticas do Existido comum. Reduzido a 0 PV, transforma-se no Enpap-X, recupera até 360 PV.' },
          { name: 'Forma Desencadeada', description: 'Reação. Crítico permite derrubar ou empurrar 3m.' },
          { name: 'Crescer', description: 'Reação. Acerto de socão dá +1d6 de dano cumulativo no próximo socão do mesmo turno.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '6d6'
      },
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
        reflexDice: 4, reflexBonus: 20,
        willDice: 3, willBonus: 15,
        additionalSkills: [{ name: 'Atletismo', dice: 5, bonus: 25 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 5, bonus: 40, damage: '4d12+30', damageType: 'sangue' },
          { name: 'Disparo de Espinhos', range: 'Médio', attackCount: 1, dice: 4, bonus: 35, damage: '4d8+20', damageType: 'sangue' },
          { name: 'Devorar', description: 'Livre. 1x por cena, se alvo chegar a 0 PV com mordida, ele devora e mata instantaneamente (Fortitude DT 40 evita).', range: 'Corpo a corpo', damage: 'Especial', damageType: 'sangue' },
          { name: 'Derrubar e Devorar', description: 'Completa. Tenta derrubar (teste 5d20+45). Se vencer, dá 3 ataques de mordida causando 4d12+40 cada.', range: 'Corpo a corpo', dice: 5, bonus: 45, damage: 'Especial', damageType: 'sangue' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Ataque Flexível', description: '4 ataques por rodada, máximo 3 vezes o mesmo ataque.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '10d6'
      },
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
        reflexDice: 4, reflexBonus: 15,
        willDice: 3, willBonus: 10,
        additionalSkills: [{ name: 'Atletismo', dice: 5, bonus: 20 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Chifres', range: 'Corpo a corpo', attackCount: 1, dice: 5, bonus: 30, damage: '6d12+20', damageType: 'perfuração' },
          { name: 'Machado', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 32, damage: '4d12+20', damageType: 'corte' },
          { name: 'Cravar Chifres', description: 'Livre. Se investir e acertar, agarra. Alvo agarrado sofre 4d12+20 Sangue no final do seu próprio turno.', range: 'Corpo a corpo', damage: '4d12+20', damageType: 'sangue' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' }
        ],
        disturbingPresenceDt: 35, disturbingPresenceDamage: '8d6'
      },
      {
        name: 'Mulher Afogada',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'sangue',
        secondaryElements: 'energia',
        vd: 140,
        defense: 28,
        hpMax: 240, hpCurrent: 240,
        movement: 9,
        nexImmune: 50,
        vulnerabilities: 'morte',
        agi: 4, str: 3, int: 2, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 5,
        initiativeDice: 4, initiativeBonus: 10,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 4, reflexBonus: 10,
        willDice: 2, willBonus: 5,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 10, 'energia': 10, 'impacto': 10, 'perfuração': 10, 'sangue': 20 }
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 4, bonus: 10, damage: '4d8+8', damageType: 'perfuração' },
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 4, bonus: 10, damage: '4d6+6', damageType: 'corte' },
          { name: 'Jato de Sangue', range: 'Distância', attackCount: 1, dice: 4, bonus: 10, damage: '4d8+8', damageType: 'sangue' },
          { name: 'Sugar Sangue', description: 'Movimento. Devora corpo morto adjacente, recuperando 40 PV.', range: 'Corpo a corpo', damage: '0', damageType: 'nenhum' },
          { name: 'Afogar em Sangue', description: 'Padrão (Forma de Sangue). Asfixia alvo. Teste de Fortitude (DT 24) encerra e repele.', range: 'Corpo a corpo', damage: '0', damageType: 'status' },
          { name: 'Arrancar Sangue', description: 'Reação (Forma de Sangue). Se arrancada de um alvo, causa 6d6 Sangue e o deixa fraco.', range: 'Corpo a corpo', damage: '6d6', damageType: 'sangue' },
          { name: 'Invadir Órgãos', description: 'Movimento (Forma de Sangue). 6d6 de Sangue e deixa o alvo enjoado.', range: 'Corpo a corpo', damage: '6d6', damageType: 'sangue' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Forma de Sangue', description: 'Estado líquido. Deslocamento 36m. Resistência a corte 20. Dá ações especiais.' },
          { name: 'Enigma de Medo', description: 'Bloquear saídas de água forçando manifestação e retirando a Forma de Sangue.' }
        ],
        disturbingPresenceDt: 25, disturbingPresenceDamage: '4d8'
      },
      {
        name: 'Titã de Sangue',
        type: 'Criatura Enorme',
        size: 'Enorme',
        element: 'sangue',
        vd: 220,
        defense: 35,
        hpMax: 550, hpCurrent: 550,
        movement: 12,
        nexImmune: 70,
        vulnerabilities: 'morte',
        agi: 2, str: 5, int: 1, pre: 1, vig: 4,
        perceptionDice: 1, perceptionBonus: 15,
        initiativeDice: 2, initiativeBonus: 10,
        fortitudeDice: 4, fortitudeBonus: 15,
        reflexDice: 2, reflexBonus: 10,
        willDice: 1, willBonus: 10,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20, 'sangue': 20 }
        },
        attacks: [
          { name: 'Mordida', range: 'Corpo a corpo', attackCount: 1, dice: 5, bonus: 25, damage: '4d12+10', damageType: 'perfuração' },
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 5, bonus: 25, damage: '4d8+10', damageType: 'corte' },
          { name: 'Estraçalhar', description: 'Livre. Se acertar mordida, causa +4d12+10 perfuração e condição sangrando (Reflexos DT 30 reduz metade e evita sangramento).', range: 'Corpo a corpo', damage: '4d12+10', damageType: 'perfuração' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Sede de Sangue', description: 'Ataques dão +4d6 Sangue em machucados ou sangrando.' }
        ],
        disturbingPresenceDt: 30, disturbingPresenceDamage: '7d6'
      },
      {
        name: 'Zumbi de Sangue',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'sangue',
        vd: 20,
        defense: 17,
        hpMax: 45, hpCurrent: 45,
        movement: 9,
        nexImmune: 25,
        vulnerabilities: 'morte',
        agi: 2, str: 2, int: 0, pre: 1, vig: 2,
        perceptionDice: 1, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 5,
        fortitudeDice: 2, fortitudeBonus: 5,
        reflexDice: 2, reflexBonus: 5,
        willDice: 1, willBonus: 5,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'impacto': 5, 'perfuração': 5, 'sangue': 10 }
        },
        attacks: [
          { name: 'Garras', range: 'Corpo a corpo', attackCount: 2, dice: 2, bonus: 5, damage: '1d6+5', damageType: 'corte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' }
        ],
        disturbingPresenceDt: 15, disturbingPresenceDamage: '2d6'
      },
      {
        name: 'Zumbi de Sangue Bestial',
        type: 'Criatura Grande',
        size: 'Grande',
        element: 'sangue',
        vd: 100,
        defense: 23,
        hpMax: 200, hpCurrent: 200,
        movement: 12,
        nexImmune: 45,
        vulnerabilities: 'morte',
        agi: 2, str: 3, int: 0, pre: 2, vig: 3,
        perceptionDice: 2, perceptionBonus: 10,
        initiativeDice: 2, initiativeBonus: 15,
        fortitudeDice: 3, fortitudeBonus: 10,
        reflexDice: 2, reflexBonus: 5,
        willDice: 2, willBonus: 5,
        additionalSkills: [{ name: 'Furtividade', dice: 2, bonus: 13 }],
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 5, 'impacto': 5, 'perfuração': 5, 'sangue': 10 }
        },
        attacks: [
          { name: 'Mordida de Sangue', range: 'Corpo a corpo', attackCount: 1, dice: 3, bonus: 15, damage: '2d10+5', damageType: 'perfuração' },
          { name: 'Garras de Sangue', range: 'Corpo a corpo', attackCount: 2, dice: 3, bonus: 15, damage: '2d6+5', damageType: 'corte' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Furtivo e Letal', description: '+d20 ataque em alvo desprevenido e +2 dados de dano base do mesmo tipo.' },
          { name: 'Instinto Predatório', description: 'Sem penalidade Furtividade movendo normal.' }
        ],
        disturbingPresenceDt: 20, disturbingPresenceDamage: '4d6'
      },
      {
        name: 'O Diabo',
        type: 'Criatura Médio',
        size: 'Médio',
        element: 'sangue',
        secondaryElements: 'conhecimento',
        vd: 400,
        defense: 66,
        hpMax: 1666, hpCurrent: 1666,
        movement: 18,
        vulnerabilities: 'morte',
        immunities: 'Atordoado, paralisia, dano direto, e todos efeitos de Sangue',
        agi: 6, str: 6, int: 6, pre: 6, vig: 6,
        perceptionDice: 6, perceptionBonus: 25,
        initiativeDice: 6, initiativeBonus: 35,
        fortitudeDice: 6, fortitudeBonus: 35,
        reflexDice: 6, reflexBonus: 35,
        willDice: 6, willBonus: 35,
        resistances: {
          flatRD: 0,
          byType: { 'balístico': 20, 'impacto': 20, 'perfuração': 20 }
        },
        attacks: [
          { name: 'Arma Sangrenta', range: 'Corpo a corpo', attackCount: 2, dice: 6, bonus: 45, damage: '2d10+50', damageType: 'sangue' },
          { name: 'Chifre do Diabo', range: 'Corpo a corpo', attackCount: 1, dice: 6, bonus: 45, damage: '2d8+50', damageType: 'sangue' },
          { name: 'Arma Sangrenta (Distância)', range: 'Distância', attackCount: 2, dice: 6, bonus: 45, damage: '2d10+50', damageType: 'sangue' },
          { name: 'Explodir em Sangue', description: 'Livre (2x/turno). Contato causa 10d6 Sangue extra.', range: 'Corpo a corpo', damage: '10d6', damageType: 'sangue' },
          { name: 'Sangrar', description: 'Livre. Deixa chifre preso (vulnerabilidade Sangue). Tirar dá 8d8 Sangue.', range: 'Corpo a corpo', damage: '8d8', damageType: 'sangue' },
          { name: 'Transportar pelo Sangue', description: 'Movimento. Surge em sangue/alvos morrendo.', range: 'Especial', damage: '0', damageType: 'nenhum' },
          { name: 'Senhor do Sangue', description: 'Padrão. 1/cena, invoca Sangue de VD somado até 400.', range: 'Especial', damage: '0', damageType: 'nenhum' },
          { name: 'Pacto', description: 'Padrão. Faz promessa por 10d6 mental; se alvo enlouquecer vira lacaio permanente.', range: 'Especial', damage: '10d6', damageType: 'mental' },
          { name: 'Desejos de Sangue', description: 'Completa. Força alvos em médio a atacar quem o Diabo quiser (Vontade DT 45).', range: 'Médio', damage: '0', damageType: 'mental' }
        ],
        abilities: [
          { name: 'Percepção às cegas', description: 'Habilidade Passiva.' },
          { name: 'Ardiloso', description: 'Pode ocultar Presença Perturbadora.' },
          { name: 'Decepar Máscara', description: 'Rompe Enigma da Máscara do Desespero.' },
          { name: 'Potência de Sangue', description: 'Cura 50 PV turno. Testes FOR/VIG/PRE ganham +35. Resto +25.' },
          { name: 'Enigma de Medo', description: 'Quando resolvido, perde imunidade a dano e resistência reduz para +25.' }
        ],
        disturbingPresenceDt: 45, disturbingPresenceDamage: '10d8'
      }
    ]

    for (const data of monsters) {
      await Monster.updateOrCreate({ name: data.name }, data)
    }
  }
}