import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CharacterWeapon from '#models/character_weapon'
import WeaponModification from '#models/weapon_modification'

export default class CharacterWeaponModification extends BaseModel {
  public static table = 'character_weapon_modifications'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterWeaponId: number

  @column()
  declare modificationId: number | null

  @column()
  declare curseId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => CharacterWeapon)
  declare characterWeapon: BelongsTo<typeof CharacterWeapon>

  @belongsTo(() => WeaponModification, {
    foreignKey: 'modificationId'
  })
  declare modification: BelongsTo<typeof WeaponModification>
}
