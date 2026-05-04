import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Ritual from './ritual.js'

export default class RitualAction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ritualId: number

  @column()
  declare label: string

  @column()
  declare peCost: number

  @column()
  declare dt: number | null

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => (value ? JSON.parse(value) : {}),
  })
  declare actionPayload: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Ritual)
  declare ritual: BelongsTo<typeof Ritual>
}
