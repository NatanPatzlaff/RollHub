import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Campaign from './campaign.js'

export default class CampaignNote extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare campaignId: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Campaign)
  declare campaign: BelongsTo<typeof Campaign>
}
