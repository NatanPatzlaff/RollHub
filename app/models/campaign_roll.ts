import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Campaign from '#models/campaign'
import Character from '#models/character'

export default class CampaignRoll extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare campaignId: number | null

  @column()
  declare characterId: number | null

  @column()
  declare playerName: string

  @column()
  declare action: string

  @column()
  declare rollExpression: string

  @column()
  declare result: number

  @column()
  declare isCritical: boolean

  @column()
  declare isFail: boolean

  @column()
  declare isGm: boolean

  @column({ columnName: 'is_secret' })
  declare isSecret: boolean
  
  @column({ columnName: 'dice_values' })
  declare diceValues: string | null

  @column.dateTime()
  declare rolledAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Campaign)
  declare campaign: BelongsTo<typeof Campaign>

  @belongsTo(() => Character, { foreignKey: 'characterId' })
  declare character: BelongsTo<typeof Character>
}
