import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import OriginBenefit from '#models/origin_benefit'
import Character from '#models/character'

export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare effects: any | null

  @column()
  declare abilityName: string | null

  @column()
  declare abilityDescription: string | null

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => typeof value === 'string' ? JSON.parse(value) : value
  })
  declare trainedSkills: string[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => OriginBenefit)
  declare benefits: HasMany<typeof OriginBenefit>

  @hasMany(() => Character)
  declare characters: HasMany<typeof Character>
}