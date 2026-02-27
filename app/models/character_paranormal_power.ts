import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'
import ParanormalPower from '#models/paranormal_power'
import CharacterClassAbility from '#models/character_class_ability'

export default class CharacterParanormalPower extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @column()
  declare paranormalPowerId: number

  @column()
  declare characterClassAbilityId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => ParanormalPower)
  declare paranormalPower: BelongsTo<typeof ParanormalPower>

  @belongsTo(() => CharacterClassAbility)
  declare characterClassAbility: BelongsTo<typeof CharacterClassAbility>
}
