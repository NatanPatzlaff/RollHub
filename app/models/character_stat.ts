import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'

export default class CharacterStat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @column()
  declare maxHp: number

  @column()
  declare currentHp: number

  @column()
  declare maxSanity: number

  @column()
  declare currentSanity: number

  @column()
  declare maxPe: number

  @column()
  declare currentPe: number

  @column()
  declare defenseMisc: number

  @column()
  declare defenseTemp: number

  @column()
  declare dodgeMisc: number

  @column()
  declare dodgeTemp: number

  @column()
  declare blockDrMisc: number

  @column()
  declare blockDrTemp: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>
}