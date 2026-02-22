import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'
import ClassAbility from '#models/class_ability'

export default class CharacterClassAbility extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @column()
  declare classAbilityId: number

  @column({ 
    prepare: (value: any) => value ? JSON.stringify(value) : null,
    consume: (value: any) => value ? JSON.parse(value) : null
  })
  declare config: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => ClassAbility)
  declare classAbility: BelongsTo<typeof ClassAbility>
}
