import vine from '@vinejs/vine'

/**
 * Validators para CharactersController
 */

export const storeCharacterValidator = vine.compile(
  vine.object({
    nex: vine.number().min(0).max(99),
    classId: vine.number().positive(),
    originId: vine.number().positive().optional(),
    name: vine.string().trim().maxLength(100).optional(),
  })
)

export const updateCharacterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100).optional(),
    classId: vine.number().positive().optional(),
    originId: vine.number().positive().optional().nullable(),
    nex: vine.number().min(0).max(99).optional(),
    rank: vine.string().trim().optional().nullable(),
  })
)

export const updateAttributesValidator = vine.compile(
  vine.object({
    strength: vine.number().min(0).max(10),
    agility: vine.number().min(0).max(10),
    intellect: vine.number().min(0).max(10),
    vigor: vine.number().min(0).max(10),
    presence: vine.number().min(0).max(10),
  })
)

export const updateAffinityValidator = vine.compile(
  vine.object({
    affinity: vine.string().trim(),
  })
)

export const configureAbilityValidator = vine.compile(
  vine.object({
    selectedSkills: vine.array(vine.string().trim()).optional(),
    ritualName: vine.string().trim().optional(),
    element: vine.string().trim().optional(),
    favoriteWeapon: vine.string().trim().optional(),
  })
)

export const updateSkillsValidator = vine.compile(
  vine.object({
    trainedSkills: vine.array(vine.string().trim()).optional(),
    veteranSkills: vine.array(vine.string().trim()).optional(),
  })
)

export const addAbilityValidator = vine.compile(
  vine.object({
    abilityId: vine.number().positive(),
  })
)

export const addParanormalPowerValidator = vine.compile(
  vine.object({
    powerId: vine.number().positive(),
    transcendAbilityId: vine.number().positive().optional().nullable(),
  })
)

export const addRitualValidator = vine.compile(
  vine.object({
    ritualId: vine.number().positive(),
    transcendAbilityId: vine.number().positive().optional().nullable(),
  })
)

export const selectTrailValidator = vine.compile(
  vine.object({
    trailId: vine.number().positive(),
  })
)

export const updateTrailConfigValidator = vine.compile(
  vine.object({
    favoriteWeapon: vine.string().trim().optional(),
    useFlagelo: vine.boolean().optional(),
    useLaminaMaldita: vine.boolean().optional(),
    useOcultismoForAttacks: vine.boolean().optional(),
  })
)

export const addItemValidator = vine.compile(
  vine.object({
    type: vine.string().trim(),
    itemId: vine.number().positive(),
    quantity: vine.number().min(1).optional(),
  })
)

export const equipItemValidator = vine.compile(
  vine.object({
    equipped: vine.any(),
  })
)

export const addModificationValidator = vine.compile(
  vine.object({
    modificationId: vine.number().positive(),
  })
)
