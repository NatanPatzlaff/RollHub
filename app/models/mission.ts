import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Campaign from '#models/campaign'
import Room from '#models/room'

export default class Mission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare campaignId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare status: 'inactive' | 'active' | 'completed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Campaign)
  declare campaign: BelongsTo<typeof Campaign>

  @hasMany(() => Room)
  declare rooms: HasMany<typeof Room>
}