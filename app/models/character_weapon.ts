import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'
import Weapon from '#models/weapon'

export default class CharacterWeapon extends BaseModel {
  public static table = 'character_weapons'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number | null

  @column()
  declare weaponId: number

  @column()
  declare customName: string | null

  @column()
  declare isEquipped: boolean

  @column()
  declare currentAmmo: number | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => Weapon)
  declare weapon: BelongsTo<typeof Weapon>
}
