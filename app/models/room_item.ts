import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Room from '#models/room'
import CharacterWeapon from '#models/character_weapon'
import CharacterProtection from '#models/character_protection'
import CharacterGeneralItem from '#models/character_general_item'

export default class RoomItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roomId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare quantity: number

  @column()
  declare itemType: string | null

  @column()
  declare catalogItemId: number | null

  @column()
  declare homebrewItemId: number | null

  @column()
  declare collected: boolean

  @column()
  declare collectedByCharacterId: number | null

  @column()
  declare characterWeaponId: number | null

  @column()
  declare characterProtectionId: number | null

  @column()
  declare characterGeneralItemId: number | null

  @column()
  declare itemName: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @belongsTo(() => CharacterWeapon)
  declare characterWeapon: BelongsTo<typeof CharacterWeapon>

  @belongsTo(() => CharacterProtection)
  declare characterProtection: BelongsTo<typeof CharacterProtection>

  @belongsTo(() => CharacterGeneralItem)
  declare characterGeneralItem: BelongsTo<typeof CharacterGeneralItem>
}