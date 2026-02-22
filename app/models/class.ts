import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ClassProgression from '#models/class_progression'
import Trail from '#models/trail'
import Character from '#models/character'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  // Stats base da classe
  @column({ columnName: 'base_hp' })
  declare baseHp: number

  @column()
  declare hpPerLevel: number

  @column()
  declare hpAttribute: string | null

  @column({ columnName: 'base_pe' })
  declare basePe: number

  @column()
  declare pePerLevel: number

  @column()
  declare peAttribute: string | null

  @column({ columnName: 'base_sanity' })
  declare baseSanity: number

  @column()
  declare sanityPerLevel: number

  @column()
  declare proficiencies: string | null

  @column({ columnName: 'trained_skills_rules' })
  declare trainedSkillsRules: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => ClassProgression)
  declare progression: HasMany<typeof ClassProgression>

  @hasMany(() => Trail)
  declare trails: HasMany<typeof Trail>

  @hasMany(() => Character)
  declare characters: HasMany<typeof Character>
}