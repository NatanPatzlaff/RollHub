import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

// ─── HELPERS — replicam a lógica real de show.tsx e AttributesDiceTrayCard.tsx ───

function calcModBonuses(modifications: any[]) {
  return {
    attackBonus: modifications.reduce((s, m) => s + (m.attackBonus ?? 0), 0),
    damageBonus: modifications.reduce((s, m) => s + (Number(m.damageBonus) || 0), 0),
    critBonus: modifications.reduce((s, m) => s + (m.criticalBonus ?? 0), 0),
  }
}

function calcCritThreshold(baseCrit: number, critBonus: number): number {
  return Math.max(1, baseCrit - critBonus)
}

function isCriticalHit(atkDice: number[], critThreshold: number): boolean {
  return atkDice.some((val) => val >= critThreshold)
}

function calcFinalDamage(
  dmgDice: number[],
  dmgCount: number,
  isCritical: boolean,
  dmgBonus: number
): number {
  const usedDice = isCritical ? dmgDice : dmgDice.slice(0, dmgCount)
  return usedDice.reduce((s, v) => s + v, 0) + dmgBonus
}

// ─── TESTES DE BANCO — verifica que cada mod está correta no banco real ───

test.group('Banco de Dados — Modificações cadastradas corretamente', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })
  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('Certeira tem attack_bonus = 2', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Certeira').first()
    assert.exists(mod, 'Certeira não encontrada no banco')
    assert.equal(Number(mod.attack_bonus), 2)
  })

  test('Cruel tem damage_bonus = +2', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Cruel').first()
    assert.exists(mod, 'Cruel não encontrada no banco')
    assert.equal(mod.damage_bonus, '+2')
  })

  test('Perigosa tem critical_bonus = 2', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Perigosa').first()
    assert.exists(mod, 'Perigosa não encontrada no banco')
    assert.equal(Number(mod.critical_bonus), 2)
  })

  test('Alongada tem attack_bonus = 2 e restricao a Arma de fogo', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Alongada').first()
    assert.exists(mod, 'Alongada não encontrada no banco')
    assert.equal(Number(mod.attack_bonus), 2)
    const restriction = typeof mod.weapon_type_restriction === 'string'
      ? JSON.parse(mod.weapon_type_restriction)
      : mod.weapon_type_restriction
    assert.include(restriction, 'Arma de fogo')
  })

  test('Calibre Grosso tem damage_bonus = +1d e restricao a Arma de fogo', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Calibre Grosso').first()
    assert.exists(mod, 'Calibre Grosso não encontrada no banco')
    assert.equal(mod.damage_bonus, '+1d')
    const restriction = typeof mod.weapon_type_restriction === 'string'
      ? JSON.parse(mod.weapon_type_restriction)
      : mod.weapon_type_restriction
    assert.include(restriction, 'Arma de fogo')
  })

  test('Discreta tem special_properties com crime_bonus=5 e space_reduction=1', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Discreta').first()
    assert.exists(mod, 'Discreta não encontrada no banco')
    const props = typeof mod.special_properties === 'string'
      ? JSON.parse(mod.special_properties)
      : mod.special_properties
    assert.equal(props.crime_bonus, 5)
    assert.equal(props.space_reduction, 1)
  })

  test('Tática tem special_properties com free_draw=true', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Tática').first()
    assert.exists(mod, 'Tática não encontrada no banco')
    const props = typeof mod.special_properties === 'string'
      ? JSON.parse(mod.special_properties)
      : mod.special_properties
    assert.isTrue(props.free_draw)
  })

  test('Ferrolho Automático tem special_properties com automatic=true', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Ferrolho Automático').first()
    assert.exists(mod, 'Ferrolho Automático não encontrada no banco')
    const props = typeof mod.special_properties === 'string'
      ? JSON.parse(mod.special_properties)
      : mod.special_properties
    assert.isTrue(props.automatic)
  })

  test('Lancinante é Maldição do elemento Sangue', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Lancinante').first()
    assert.exists(mod, 'Lancinante não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Sangue')
  })

  test('Predadora é Maldição do elemento Sangue', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Predadora').first()
    assert.exists(mod, 'Predadora não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Sangue')
  })

  test('Sanguinária é Maldição do elemento Sangue', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Sanguinária').first()
    assert.exists(mod, 'Sanguinária não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Sangue')
  })

  test('Energética é Maldição do elemento Energia', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Energética').first()
    assert.exists(mod, 'Energética não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Energia')
  })

  test('Vibrante é Maldição do elemento Energia', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Vibrante').first()
    assert.exists(mod, 'Vibrante não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Energia')
  })

  test('Empuxo é Maldição do elemento Energia', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Empuxo').first()
    assert.exists(mod, 'Empuxo não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Energia')
  })

  test('Erosiva é Maldição do elemento Morte', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Erosiva').first()
    assert.exists(mod, 'Erosiva não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Morte')
  })

  test('Consumidora é Maldição do elemento Morte', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Consumidora').first()
    assert.exists(mod, 'Consumidora não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Morte')
  })

  test('Repulsora é Maldição do elemento Morte', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Repulsora').first()
    assert.exists(mod, 'Repulsora não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Morte')
  })

  test('Antielemento é Maldição do elemento Conhecimento', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Antielemento').first()
    assert.exists(mod, 'Antielemento não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Conhecimento')
  })

  test('Ritualística é Maldição do elemento Conhecimento', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Ritualística').first()
    assert.exists(mod, 'Ritualística não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Conhecimento')
  })

  test('Senciente é Maldição Categoria 4 do elemento Conhecimento', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Senciente').first()
    assert.exists(mod, 'Senciente não encontrada no banco')
    assert.equal(mod.type, 'Maldição')
    assert.equal(mod.element, 'Conhecimento')
    assert.equal(Number(mod.category), 4)
  })

  test('Dum-Dum tem critical_bonus=2 e restricao a Balas Curtas e Longas', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Dum-Dum').first()
    assert.exists(mod, 'Dum-Dum não encontrada no banco')
    assert.equal(Number(mod.critical_bonus), 2)
    const restriction = typeof mod.weapon_type_restriction === 'string'
      ? JSON.parse(mod.weapon_type_restriction)
      : mod.weapon_type_restriction
    assert.include(restriction, 'Balas Curtas')
    assert.include(restriction, 'Balas Longas')
    assert.notInclude(restriction, 'Cartuchos')
  })

  test('Explosiva tem damage_bonus +2d6 e permitida em Cartuchos', async ({ assert }) => {
    const mod = await db.from('weapon_modifications').where('name', 'Explosiva').first()
    assert.exists(mod, 'Explosiva não encontrada no banco')
    assert.include(mod.damage_bonus, '+2d6')
    const restriction = typeof mod.weapon_type_restriction === 'string'
      ? JSON.parse(mod.weapon_type_restriction)
      : mod.weapon_type_restriction
    assert.include(restriction, 'Cartuchos')
    assert.notInclude(restriction, 'Flechas')
  })
})

// ─── TESTES DE LÓGICA — simulam o ciclo completo de rolagem ───

test.group('Lógica de Rolagem — Margem de Crítico', () => {
  test('Perigosa: crítico 20 vira 18', ({ assert }) => {
    const mods = [{ criticalBonus: 2 }]
    const { critBonus } = calcModBonuses(mods)
    assert.equal(calcCritThreshold(20, critBonus), 18)
  })

  test('Perigosa: dado 18 com threshold 18 É crítico', ({ assert }) => {
    assert.isTrue(isCriticalHit([18], 18))
  })

  test('Perigosa: dado 17 com threshold 18 NÃO é crítico', ({ assert }) => {
    assert.isFalse(isCriticalHit([17], 18))
  })

  test('Dum-Dum: crítico 20 vira 18', ({ assert }) => {
    const mods = [{ criticalBonus: 2 }]
    const { critBonus } = calcModBonuses(mods)
    assert.equal(calcCritThreshold(20, critBonus), 18)
  })

  test('sem mods: dado 20 com threshold 20 É crítico', ({ assert }) => {
    assert.isTrue(isCriticalHit([20], 20))
  })

  test('sem mods: dado 19 com threshold 20 NÃO é crítico', ({ assert }) => {
    assert.isFalse(isCriticalHit([19], 20))
  })

  test('threshold nunca fica abaixo de 1', ({ assert }) => {
    assert.equal(calcCritThreshold(1, 99), 1)
  })
})

test.group('Lógica de Rolagem — Dano Crítico vs Normal', () => {
  test('crítico usa todos os dados de dano (x2)', ({ assert }) => {
    const dmgDice = [4, 3]
    const dmgBonus = 0
    const final = calcFinalDamage(dmgDice, 1, true, dmgBonus)
    assert.equal(final, 7)
  })

  test('normal usa apenas dmgCount dados', ({ assert }) => {
    const dmgDice = [4, 3]
    const dmgBonus = 0
    const final = calcFinalDamage(dmgDice, 1, false, dmgBonus)
    assert.equal(final, 4)
  })

  test('Cruel: +2 de dano aplicado corretamente em hit normal', ({ assert }) => {
    const mods = [{ damageBonus: '+2' }]
    const { damageBonus } = calcModBonuses(mods)
    const final = calcFinalDamage([4], 1, false, damageBonus)
    assert.equal(final, 6)
  })

  test('Cruel: +2 de dano aplicado corretamente em crítico', ({ assert }) => {
    const mods = [{ damageBonus: '+2' }]
    const { damageBonus } = calcModBonuses(mods)
    const final = calcFinalDamage([4, 3], 1, true, damageBonus)
    assert.equal(final, 9)
  })
})

test.group('Lógica de Rolagem — Bônus de Ataque', () => {
  test('Certeira: +2 ataque somado ao trainingBonus', ({ assert }) => {
    const mods = [{ attackBonus: 2 }]
    const { attackBonus } = calcModBonuses(mods)
    const trainingBonus = 5
    assert.equal(trainingBonus + attackBonus, 7)
  })

  test('Alongada: +2 ataque somado ao trainingBonus', ({ assert }) => {
    const mods = [{ attackBonus: 2 }]
    const { attackBonus } = calcModBonuses(mods)
    const trainingBonus = 10
    assert.equal(trainingBonus + attackBonus, 12)
  })

  test('Certeira + Alongada: +4 ataque total', ({ assert }) => {
    const mods = [{ attackBonus: 2 }, { attackBonus: 2 }]
    const { attackBonus } = calcModBonuses(mods)
    assert.equal(attackBonus, 4)
  })
})

test.group('Lógica de Rolagem — Combinações', () => {
  test('Certeira + Perigosa + Cruel: ataque+2, crítico 18, dano+2', ({ assert }) => {
    const mods = [
      { attackBonus: 2, damageBonus: null, criticalBonus: 0 },
      { attackBonus: 0, damageBonus: null, criticalBonus: 2 },
      { attackBonus: 0, damageBonus: '+2', criticalBonus: 0 },
    ]
    const { attackBonus, damageBonus, critBonus } = calcModBonuses(mods)
    assert.equal(attackBonus, 2)
    assert.equal(damageBonus, 2)
    assert.equal(calcCritThreshold(20, critBonus), 18)
  })

  test('sem modificações: todos bônus são zero', ({ assert }) => {
    const { attackBonus, damageBonus, critBonus } = calcModBonuses([])
    assert.equal(attackBonus, 0)
    assert.equal(damageBonus, 0)
    assert.equal(critBonus, 0)
  })
})
