import vine from '@vinejs/vine'

/**
 * Validator para CharacterStatsController.update
 */
export const updateCharacterStatsValidator = vine.compile(
  vine.object({
    currentHp: vine.number().optional().nullable(),
    currentPe: vine.number().optional().nullable(),
    currentSanity: vine.number().optional().nullable(),
    maxHp: vine.number().min(1).optional().nullable(),
    maxPe: vine.number().min(0).optional().nullable(),
    maxSanity: vine.number().min(0).optional().nullable(),
    permanentSanityLoss: vine.number().min(0).optional().nullable(),
  })
)
