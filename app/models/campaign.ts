import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Character from '#models/character'
import Combat from '#models/combat'

export default class Campaign extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameMasterId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @belongsTo(() => User, {
    foreignKey: 'gameMasterId',
  })
  declare gameMaster: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'campaign_members',
  })
  declare players: ManyToMany<typeof User>

  @manyToMany(() => Character, {
    pivotTable: 'campaign_members',
  })
  declare characters: ManyToMany<typeof Character>

  @hasMany(() => Combat)
  declare combats: HasMany<typeof Combat>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}