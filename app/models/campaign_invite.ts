import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Campaign from '#models/campaign'

export default class CampaignInvite extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare campaignId: number

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column()
  declare maxUses: number | null

  @column()
  declare usesCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Campaign)
  declare campaign: BelongsTo<typeof Campaign>
}
