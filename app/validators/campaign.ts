import vine from '@vinejs/vine'

export const createCampaignValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(64),
    description: vine.string().trim().maxLength(256).optional(),
  })
)

export const updateCampaignValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(64),
    description: vine.string().trim().maxLength(256).optional(),
  })
)
