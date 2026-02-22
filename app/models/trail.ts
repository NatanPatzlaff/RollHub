import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Class from '#models/class'
import TrailProgression from '#models/trail_progression'
import Character from '#models/character'

export default class Trail extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @hasMany(() => TrailProgression)
  declare progression: HasMany<typeof TrailProgression>

  @hasMany(() => Character)
  declare characters: HasMany<typeof Character>
}