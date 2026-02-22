import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Class from '#models/class'

export default class ClassProgression extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

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

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare effects: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>
}
