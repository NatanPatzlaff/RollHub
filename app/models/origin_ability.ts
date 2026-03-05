import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Origin from '#models/origin'

export default class OriginAbility extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare originId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  // Tipo: 'ativa' | 'passiva' | 'reação' | 'livre' | null
  @column()
  declare type: string | null

  // Campos de mecânica (opcionais)
  @column()
  declare peCost: string | null

  @column()
  declare range: string | null

  @column()
  declare castTime: string | null

  @column()
  declare duration: string | null

  @column()
  declare target: string | null

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

  @belongsTo(() => Origin)
  declare origin: BelongsTo<typeof Origin>
}
