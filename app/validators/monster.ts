import vine from '@vinejs/vine'

export const monsterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    type: vine.string().trim().nullable().optional(),
    size: vine.string().trim().nullable().optional(),
    element: vine.string().trim().nullable().optional(),
    secondaryElements: vine.string().trim().nullable().optional(),
    vd: vine.number().min(0).optional(),
    defense: vine.number().min(0).optional(),
    hpMax: vine.number().min(1),
    hpCurrent: vine.number().min(0).optional(),
    movement: vine.number().min(0).optional(),
    alternativeMovements: vine.array(
      vine.object({
        type: vine.string().trim(),
        value: vine.number()
      })
    ).nullable().optional(),
    nexImmune: vine.number().min(0).optional(),
    immunities: vine.string().trim().nullable().optional(),
    additionalImmunities: vine.string().trim().nullable().optional(),
    vulnerabilities: vine.string().trim().nullable().optional(),
    agi: vine.number().optional(),
    str: vine.number().optional(),
    int: vine.number().optional(),
    pre: vine.number().optional(),
    vig: vine.number().optional(),
    perceptionDice: vine.number().optional(),
    perceptionBonus: vine.number().optional(),
    initiativeDice: vine.number().optional(),
    initiativeBonus: vine.number().optional(),
    fortitudeDice: vine.number().optional(),
    fortitudeBonus: vine.number().optional(),
    reflexDice: vine.number().optional(),
    reflexBonus: vine.number().optional(),
    willDice: vine.number().optional(),
    willBonus: vine.number().optional(),
    additionalSkills: vine.array(
      vine.object({
        name: vine.string().trim(),
        dice: vine.number(),
        bonus: vine.number()
      })
    ).nullable().optional(),
    attacks: vine.array(
      vine.object({
        name: vine.string().trim(),
        range: vine.string().trim().optional(),
        attackCount: vine.number().optional(),
        dice: vine.number().optional(),
        bonus: vine.number().optional(),
        critical: vine.number().optional(),
        multiplier: vine.number().optional(),
        damage: vine.string().trim(),
        damageType: vine.string().trim(),
        additionalDamages: vine.array(
          vine.object({
            damage: vine.string().trim(),
            damageType: vine.string().trim()
          })
        ).optional()
      })
    ).nullable().optional(),
    abilities: vine.array(
      vine.object({
        name: vine.string().trim(),
        description: vine.string().trim(),
      })
    ).nullable().optional(),
    resistances: vine.object({
      flatRD: vine.number().min(0).optional(),
      byType: vine.record(vine.string().nullable().optional()).optional(),
    }).nullable().optional(),
    disturbingPresenceDt: vine.number().nullable().optional(),
    disturbingPresenceDamage: vine.string().trim().nullable().optional(),
    description: vine.string().trim().nullable().optional(),
    fearEnigma: vine.string().trim().nullable().optional(),
    notes: vine.string().trim().nullable().optional(),
    campaignId: vine.number().nullable().optional(),
  })
)
