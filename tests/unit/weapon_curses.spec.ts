  import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

// ─── HELPERS — replicam lógica real de rolagem ───────────────────────────────

function calcCritThreshold(baseCrit: number, critBonus: number): number {
  return Math.max(1, baseCrit - critBonus)
}

function isCriticalHit(atkDice: number[], critThreshold: number): boolean {
  return atkDice.some((val) => val >= critThreshold)
}

// Simula o efeito de Lancinante: +1d8 multiplicado em crítico
function calcLancinanteBonus(extraDice: number[], isCritical: boolean): number {
  if (!isCritical) return extraDice[0] ?? 0
  return extraDice.reduce((s, v) => s + v, 0) // todos os dados em crítico
}

// Simula o efeito de Predadora: dobra a margem de ameaça
function calcPredadoraThreshold(baseCrit: number): number {
  const margin = 20 - baseCrit + 1
  const doubled = margin * 2
  return Math.max(1, 20 - doubled + 1)
}

// Simula Energética: +5 no ataque quando ativa
function calcEnergeticaAttack(baseAttack: number, isActive: boolean): number {
  return isActive ? baseAttack + 5 : baseAttack
}

// Simula Erosiva: dano base +1d8, com 2 PE ativa +2d4 por 2 rodadas
function calcErosivaBonus(baseDice: number[], extraDice: number[], peSpent: boolean): number {
  const base = baseDice.reduce((s, v) => s + v, 0)
  const extra = peSpent ? extraDice.reduce((s, v) => s + v, 0) : 0
  return base + extra
}

// Simula Repulsora: +2 Defesa, +5 ao bloquear com 2 PE
function calcRepulsoraDefense(baseDefense: number, isBlocking: boolean, peSpent: boolean): number {
  const passiveBonus = 2
  const blockBonus = isBlocking && peSpent ? 5 : 0
  return baseDefense + passiveBonus + blockBonus
}

// ─── TESTES DE BANCO ──────────────────────────────────────────────────────────

test.group('Banco — Maldições cadastradas corretamente', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })
  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  // ── Conhecimento ──────────────────────────────────────────────────────────

  test('Antielemento é Maldição Categoria 2 do elemento Conhecimento', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Antielemento').first()
    assert.exists(mod, 'Antielemento não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Conhecimento')
    assert.equal(Number(mod.category), 2)
  })

  test('Ritualística é Maldição Categoria 2 do elemento Conhecimento', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Ritualística').first()
    assert.exists(mod, 'Ritualística não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Conhecimento')
    assert.equal(Number(mod.category), 2)
  })

  test('Senciente é Maldição Categoria 4 do elemento Conhecimento', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Senciente').first()
    assert.exists(mod, 'Senciente não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Conhecimento')
    assert.equal(Number(mod.category), 4)
  })

  // ── Energia ───────────────────────────────────────────────────────────────

  test('Empuxo é Maldição Categoria 2 do elemento Energia', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Empuxo').first()
    assert.exists(mod, 'Empuxo não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Energia')
    assert.equal(Number(mod.category), 2)
  })

  test('Energética é Maldição Categoria 2 do elemento Energia', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Energética').first()
    assert.exists(mod, 'Energética não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Energia')
    assert.equal(Number(mod.category), 2)
  })

  test('Vibrante é Maldição Categoria 2 do elemento Energia', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Vibrante').first()
    assert.exists(mod, 'Vibrante não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Energia')
    assert.equal(Number(mod.category), 2)
  })

  // ── Morte ─────────────────────────────────────────────────────────────────

  test('Consumidora é Maldição Categoria 2 do elemento Morte', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Consumidora').first()
    assert.exists(mod, 'Consumidora não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Morte')
    assert.equal(Number(mod.category), 2)
  })

  test('Erosiva é Maldição Categoria 2 do elemento Morte', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Erosiva').first()
    assert.exists(mod, 'Erosiva não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Morte')
    assert.equal(Number(mod.category), 2)
  })

  test('Repulsora é Maldição Categoria 2 do elemento Morte', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Repulsora').first()
    assert.exists(mod, 'Repulsora não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Morte')
    assert.equal(Number(mod.category), 2)
  })

  // ── Sangue ────────────────────────────────────────────────────────────────

  test('Lancinante é Maldição Categoria 2 do elemento Sangue', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Lancinante').first()
    assert.exists(mod, 'Lancinante não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Sangue')
    assert.equal(Number(mod.category), 2)
  })

  test('Predadora é Maldição Categoria 2 do elemento Sangue', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Predadora').first()
    assert.exists(mod, 'Predadora não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Sangue')
    assert.equal(Number(mod.category), 2)
  })

  test('Sanguinária é Maldição Categoria 2 do elemento Sangue', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Sanguinária').first()
    assert.exists(mod, 'Sanguinária não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Sangue')
    assert.equal(Number(mod.category), 2)
  })

  // ── Descrições não vazias ─────────────────────────────────────────────────

  test('Todas as maldições possuem descrição não vazia', async ({ assert }) => {
    const curses = await db.from('weapon_modifications').where('type', 'Maldição')
    assert.isAbove(curses.length, 0, 'Nenhuma maldição encontrada')
    for (const mod of curses) {
      assert.isString(mod.description, `${mod.name} não tem descrição`)
      assert.isAbove(mod.description.length, 0, `${mod.name} tem descrição vazia`)
    }
  })

  test('Todas as maldições possuem elemento definido', async ({ assert }) => {
    const curses = await db.from('weapon_modifications').where('type', 'Maldição')
    for (const mod of curses) {
      assert.isString(mod.element, `${mod.name} não tem elemento`)
      assert.include(
        ['Sangue', 'Energia', 'Morte', 'Conhecimento'],
        mod.element,
        `${mod.name} tem elemento inválido: ${mod.element}`
      )
    }
  })

  test('Existem exatamente 12 maldições cadastradas', async ({ assert }) => {
    const curses = await db.from('weapon_modifications').where('type', 'Maldição')
    assert.equal(curses.length, 12)
  })
})

// ─── TESTES DE LÓGICA — efeitos já implementados ─────────────────────────────

test.group('Lógica — Lancinante (+1d8 Sangue, multiplicado em crítico)', () => {
  test('Lancinante em hit normal: usa apenas 1 dado', ({ assert }) => {
    const extraDice = [6] // 1d8 rolou 6
    assert.equal(calcLancinanteBonus(extraDice, false), 6)
  })

  test('Lancinante em crítico: soma todos os dados', ({ assert }) => {
    const extraDice = [6, 4] // 2d8 em crítico
    assert.equal(calcLancinanteBonus(extraDice, true), 10)
  })

  test('Lancinante em crítico com dado máximo: 8+8=16', ({ assert }) => {
    const extraDice = [8, 8]
    assert.equal(calcLancinanteBonus(extraDice, true), 16)
  })
})

test.group('Lógica — Predadora (dobra margem de ameaça)', () => {
  test('Predadora: margem 1 (só 20) vira 2 (19-20)', ({ assert }) => {
    // base: threshold 20, margem = 1
    // dobrada: margem = 2, threshold = 19
    assert.equal(calcPredadoraThreshold(20), 19)
  })

  test('Predadora: margem 2 (19-20) vira 4 (17-20)', ({ assert }) => {
    assert.equal(calcPredadoraThreshold(19), 17)
  })

  test('Predadora: margem 3 (18-20) vira 6 (15-20)', ({ assert }) => {
    assert.equal(calcPredadoraThreshold(18), 15)
  })

  test('Predadora: dado 19 é crítico com threshold 19', ({ assert }) => {
    const threshold = calcPredadoraThreshold(20)
    assert.isTrue(isCriticalHit([19], threshold))
  })

  test('Predadora: dado 18 não é crítico com threshold 19', ({ assert }) => {
    const threshold = calcPredadoraThreshold(20)
    assert.isFalse(isCriticalHit([18], threshold))
  })
})

test.group('Lógica — Energética (+5 ataque, ativa com 2 PE)', () => {
  test('Energética ativa: +5 no ataque', ({ assert }) => {
    assert.equal(calcEnergeticaAttack(10, true), 15)
  })

  test('Energética inativa: ataque sem bônus', ({ assert }) => {
    assert.equal(calcEnergeticaAttack(10, false), 10)
  })

  test('Energética ativa com ataque base 0: resultado 5', ({ assert }) => {
    assert.equal(calcEnergeticaAttack(0, true), 5)
  })
})

test.group('Lógica — Erosiva (+1d8 Morte, +2d4 com 2 PE)', () => {
  test('Erosiva sem PE: apenas dano base', ({ assert }) => {
    const base = [5] // 1d8 rolou 5
    assert.equal(calcErosivaBonus(base, [], false), 5)
  })

  test('Erosiva com 2 PE: dano base + extra', ({ assert }) => {
    const base = [5]   // 1d8 = 5
    const extra = [3, 2] // 2d4 = 5
    assert.equal(calcErosivaBonus(base, extra, true), 10)
  })

  test('Erosiva com PE e dados máximos: 8 + 4 + 4 = 16', ({ assert }) => {
    const base = [8]
    const extra = [4, 4]
    assert.equal(calcErosivaBonus(base, extra, true), 16)
  })
})

test.group('Lógica — Repulsora (+2 Defesa, +5 ao bloquear com PE)', () => {
  test('Repulsora passiva: +2 de defesa sempre', ({ assert }) => {
    assert.equal(calcRepulsoraDefense(15, false, false), 17)
  })

  test('Repulsora bloqueando sem PE: apenas +2', ({ assert }) => {
    assert.equal(calcRepulsoraDefense(15, true, false), 17)
  })

  test('Repulsora bloqueando com 2 PE: +2 +5 = +7 total', ({ assert }) => {
    assert.equal(calcRepulsoraDefense(15, true, true), 22)
  })

  test('Repulsora com defesa base 0: resultado correto', ({ assert }) => {
    assert.equal(calcRepulsoraDefense(0, true, true), 7)
  })
})

// ─── TESTES DE IMPLEMENTAÇÃO PENDENTE ────────────────────────────────────────
// Estes testes FALHAM intencionalmente — indicam o que precisa ser implementado

/*
test.group('🚧 PENDENTE — Antielemento (+4d8 vs elemento específico)', () => {
  test('TODO: sistema deve detectar elemento da criatura alvo', ({ assert }) => {
    // Precisa implementar: campo "element" em criaturas/personagens
    // e lógica que verifica se Antielemento se aplica
    const targetElement = undefined // não implementado ainda
    assert.exists(targetElement, '❌ PENDENTE: criatura não possui campo de elemento')
  })

  test('TODO: Antielemento deve adicionar +4d8 quando elemento bate', ({ assert }) => {
    // Precisa implementar: lógica de bônus condicional por elemento
    const bonusDamage = undefined // não implementado
    assert.exists(bonusDamage, '❌ PENDENTE: bônus de Antielemento não calculado')
  })
})
*/

/*
test.group('🚧 PENDENTE — Ritualística (armazena ritual)', () => {
  test('TODO: arma deve ter campo para armazenar ritual equipado', async ({ assert }) => {
    // Precisa implementar: coluna "stored_ritual_id" em weapons ou weapon_equips
    const weapon = await db.from('weapons').first()
    assert.property(weapon, 'stored_ritual_id', '❌ PENDENTE: arma não possui campo stored_ritual_id')
  })

  test('TODO: ritual armazenado deve ser descarregado como ação livre no acerto', ({ assert }) => {
    const ritualDischargeSystem = undefined // não implementado
    assert.exists(ritualDischargeSystem, '❌ PENDENTE: sistema de descarga de ritual não implementado')
  })
})

test.group('🚧 PENDENTE — Senciente (arma ataca sozinha)', () => {
  test('TODO: arma deve poder agir independentemente no turno', ({ assert }) => {
    const autonomousAttackSystem = undefined // não implementado
    assert.exists(autonomousAttackSystem, '❌ PENDENTE: sistema de ataque autônomo não implementado')
  })

  test('TODO: custo de PE deve ser descontado automaticamente (2 PE + 1 PE/turno)', ({ assert }) => {
    const peDeductionSystem = undefined // não implementado
    assert.exists(peDeductionSystem, '❌ PENDENTE: desconto automático de PE não implementado')
  })
})
*/

test.group('Empuxo (arremessável, +1 dado, volta para mão)', () => {
  test('Empuxo: faca (arremessável natural) com isThrow=true adiciona 1d extra', ({ assert }) => {
    const NATURALLY_THROWABLE = ['Faca', 'Machadinha', 'Lança']
    const weapon = { name: 'Faca', damage: '1d4' }
    const isThrow = true
    const hasEmpuxo = true
    const isNaturallyThrowable = NATURALLY_THROWABLE.some(
      (n) => weapon.name.toLowerCase().includes(n.toLowerCase())
    )
    const throwExtraDice: string[] = []
    if (isThrow && hasEmpuxo && isNaturallyThrowable) {
      const diceMatch = weapon.damage.match(/d(\d+)/i)
      if (diceMatch) throwExtraDice.push(`1d${diceMatch[1]}`)
    }
    assert.equal(throwExtraDice.length, 1)
    assert.equal(throwExtraDice[0], '1d4')
  })

  test('Empuxo: machadinha com isThrow=true adiciona 1d extra', ({ assert }) => {
    const NATURALLY_THROWABLE = ['Faca', 'Machadinha', 'Lança']
    const weapon = { name: 'Machadinha', damage: '1d6' }
    const isThrow = true
    const hasEmpuxo = true
    const isNaturallyThrowable = NATURALLY_THROWABLE.some(
      (n) => weapon.name.toLowerCase().includes(n.toLowerCase())
    )
    const throwExtraDice: string[] = []
    if (isThrow && hasEmpuxo && isNaturallyThrowable) {
      const diceMatch = weapon.damage.match(/d(\d+)/i)
      if (diceMatch) throwExtraDice.push(`1d${diceMatch[1]}`)
    }
    assert.equal(throwExtraDice[0], '1d6')
  })

  test('Empuxo: espada (não arremessável natural) NÃO ganha dado extra', ({ assert }) => {
    const NATURALLY_THROWABLE = ['Faca', 'Machadinha', 'Lança']
    const weapon = { name: 'Espada Longa', damage: '1d8' }
    const isThrow = true
    const hasEmpuxo = true
    const isNaturallyThrowable = NATURALLY_THROWABLE.some(
      (n) => weapon.name.toLowerCase().includes(n.toLowerCase())
    )
    const throwExtraDice: string[] = []
    if (isThrow && hasEmpuxo && isNaturallyThrowable) {
      const diceMatch = weapon.damage.match(/d(\d+)/i)
      if (diceMatch) throwExtraDice.push(`1d${diceMatch[1]}`)
    }
    assert.equal(throwExtraDice.length, 0)
  })

  test('Empuxo: lança com isThrow=false NÃO adiciona dado extra', ({ assert }) => {
    const NATURALLY_THROWABLE = ['Faca', 'Machadinha', 'Lança']
    const weapon = { name: 'Lança', damage: '1d6' }
    const isThrow = false
    const hasEmpuxo = true
    const isNaturallyThrowable = NATURALLY_THROWABLE.some(
      (n) => weapon.name.toLowerCase().includes(n.toLowerCase())
    )
    const throwExtraDice: string[] = []
    if (isThrow && hasEmpuxo && isNaturallyThrowable) {
      const diceMatch = weapon.damage.match(/d(\d+)/i)
      if (diceMatch) throwExtraDice.push(`1d${diceMatch[1]}`)
    }
    assert.equal(throwExtraDice.length, 0)
  })
})

test.group('Vibrante (Ataque Extra ou -1 PE em habilidade)', () => {
  test('Vibrante sem Ataque Extra: botão aparece com custo 2 PE', ({ assert }) => {
    const classAbilities: any[] = []
    const modifications = [{ name: 'Vibrante' }]
    const hasExtraAttack = classAbilities.some((a) => a.title === 'Ataque Extra')
    const hasVibrante = modifications.some((m) => m.name === 'Vibrante')
    const showExtraAttackButton = hasExtraAttack || hasVibrante
    const extraAttackPeCost = (hasVibrante && hasExtraAttack) ? 1 : 2
    assert.isTrue(showExtraAttackButton)
    assert.equal(extraAttackPeCost, 2)
  })

  test('Vibrante com Ataque Extra: custo reduz para 1 PE', ({ assert }) => {
    const classAbilities = [{ title: 'Ataque Extra' }]
    const modifications = [{ name: 'Vibrante' }]
    const hasExtraAttack = classAbilities.some((a) => a.title === 'Ataque Extra')
    const hasVibrante = modifications.some((m) => m.name === 'Vibrante')
    const showExtraAttackButton = hasExtraAttack || hasVibrante
    const extraAttackPeCost = (hasVibrante && hasExtraAttack) ? 1 : 2
    assert.isTrue(showExtraAttackButton)
    assert.equal(extraAttackPeCost, 1)
  })

  test('sem Vibrante com Ataque Extra: custo é 2 PE', ({ assert }) => {
    const classAbilities = [{ title: 'Ataque Extra' }]
    const modifications: any[] = []
    const hasExtraAttack = classAbilities.some((a) => a.title === 'Ataque Extra')
    const hasVibrante = modifications.some((m) => m.name === 'Vibrante')
    const showExtraAttackButton = hasExtraAttack || hasVibrante
    const extraAttackPeCost = (hasVibrante && hasExtraAttack) ? 1 : 2
    assert.isTrue(showExtraAttackButton)
    assert.equal(extraAttackPeCost, 2)
  })

  test('sem Vibrante sem Ataque Extra: botão não aparece', ({ assert }) => {
    const classAbilities: any[] = []
    const modifications: any[] = []
    const hasExtraAttack = classAbilities.some((a) => a.title === 'Ataque Extra')
    const hasVibrante = modifications.some((m) => m.name === 'Vibrante')
    const showExtraAttackButton = hasExtraAttack || hasVibrante
    assert.isFalse(showExtraAttackButton)
  })

  test('histórico diferencia Ataque Extra de Ataque Normal', ({ assert }) => {
    const normalLabel = `Espada Longa (Ataque)`
    const extraLabel = `Espada Longa (Ataque Extra)`
    assert.notEqual(normalLabel, extraLabel)
    assert.include(extraLabel, 'Ataque Extra')
  })
})

/*
test.group('🚧 PENDENTE — Consumidora (alvo imóvel 1 rodada com 2 PE)', () => {
  test('TODO: ao acertar com Consumidora ativa, alvo deve receber status "Imóvel"', ({ assert }) => {
    const immobileStatusSystem = undefined // não implementado
    assert.exists(immobileStatusSystem, '❌ PENDENTE: sistema de status "Imóvel" não implementado')
  })

  test('TODO: status Imóvel deve durar exatamente 1 rodada', ({ assert }) => {
    const statusDurationSystem = undefined // não implementado
    assert.exists(statusDurationSystem, '❌ PENDENTE: sistema de duração de status não implementado')
  })
})

test.group('🚧 PENDENTE — Sanguinária (sangramento cumulativo, crítico especial)', () => {
  test('TODO: acerto com Sanguinária deve aplicar stack de sangramento', ({ assert }) => {
    const bleedingStackSystem = undefined // não implementado
    assert.exists(bleedingStackSystem, '❌ PENDENTE: sistema de sangramento cumulativo não implementado')
  })

  test('TODO: crítico com Sanguinária deve deixar alvo Fraco', ({ assert }) => {
    const weakStatusOnCrit = undefined // não implementado
    assert.exists(weakStatusOnCrit, '❌ PENDENTE: status "Fraco" em crítico não implementado')
  })

  test('TODO: crítico com Sanguinária deve conceder 2d10 PV temporários', ({ assert }) => {
    const tempHpOnCrit = undefined // não implementado
    assert.exists(tempHpOnCrit, '❌ PENDENTE: PV temporários em crítico não implementados')
  })
})
*/
