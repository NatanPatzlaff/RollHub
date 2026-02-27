import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'
import Ritual from '#models/ritual'
import CharacterClassAbility from '#models/character_class_ability'

export default class CharacterRitual extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @column()
  declare ritualId: number

  @column()
  declare characterClassAbilityId: number | null

  @column()
  declare dt: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => Ritual)
  declare ritual: BelongsTo<typeof Ritual>

  @belongsTo(() => CharacterClassAbility)
  declare characterClassAbility: BelongsTo<typeof CharacterClassAbility>
}