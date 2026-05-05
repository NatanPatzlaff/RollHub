import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'
import Protection from '#models/protection'

export default class CharacterProtection extends BaseModel {
  public static table = 'character_protections'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number | null

  @column()
  declare protectionId: number

  @column()
  declare customName: string | null

  @column()
  declare isEquipped: boolean

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => Protection)
  declare protection: BelongsTo<typeof Protection>
}
