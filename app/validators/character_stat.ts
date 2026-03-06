import vine from '@vinejs/vine'

/**
 * Validator para CharacterStatsController.update
 */
export const updateCharacterStatsValidator = vine.compile(
  vine.object({
    currentHp: vine.number().optional(),
    currentPe: vine.number().optional(),
    currentSanity: vine.number().optional(),
    permanentSanityLoss: vine.number().min(0).optional(),
  })
)
