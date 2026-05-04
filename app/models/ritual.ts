import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RitualAction from './ritual_action.js'

export default class Ritual extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare element: string

  @column()
  declare circle: number

  @column()
  declare execution: string

  @column()
  declare range: string

  @column()
  declare target: string

  @column()
  declare duration: string

  @column()
  declare resistance: string | null

  @column()
  declare description: string | null

  @column()
  declare discente: string | null

  @column()
  declare verdadeiro: string | null

  @column()
  declare normalDamage: string | null

  @column()
  declare discenteDamage: string | null

  @column()
  declare verdadeiroDamage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => RitualAction)
  declare actions: HasMany<typeof RitualAction>
}
