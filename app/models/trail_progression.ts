import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Trail from '#models/trail'

export default class TrailProgression extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare trailId: number

  @column()
  declare nex: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare type: string

  @column()
  declare referenceId: number | null

  @column({
    prepare: (value: any) => (value ? JSON.stringify(value) : null),
    consume: (value: any) => {
      if (!value) return null
      if (typeof value === 'string') {
        try { return JSON.parse(value) } catch { return null }
      }
      return value
    },
  })
  declare effects: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Trail)
  declare trail: BelongsTo<typeof Trail>
}
