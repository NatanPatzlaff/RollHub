import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Character from '#models/character'
import Combat from '#models/combat'
import CampaignNote from '#models/campaign_note'
import CampaignInvite from '#models/campaign_invite'

export default class Campaign extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameMasterId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare inviteCode: string | null

  @column()
  declare dddiceRoomSlug: string | null

  @belongsTo(() => User, {
    foreignKey: 'gameMasterId',
  })
  declare gameMaster: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'campaign_members',
    pivotColumns: ['role', 'character_id'],
    pivotTimestamps: true,
  })
  declare players: ManyToMany<typeof User>

  @manyToMany(() => Character, {
    pivotTable: 'campaign_members',
    pivotColumns: ['role', 'character_id'],
    pivotTimestamps: true,
  })
  declare characters: ManyToMany<typeof Character>

  @hasMany(() => Combat)
  declare combats: HasMany<typeof Combat>

  @hasMany(() => CampaignNote)
  declare notes: HasMany<typeof CampaignNote>

  @hasMany(() => CampaignInvite)
  declare invites: HasMany<typeof CampaignInvite>

  @column({ columnName: 'show_player_stats' })
  declare showPlayerStats: boolean

  @column({ columnName: 'require_item_approval' })
  declare requireItemApproval: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}