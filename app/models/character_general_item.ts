import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Character from '#models/character'
import GeneralItem from '#models/general_item'

export default class CharacterGeneralItem extends BaseModel {
  public static table = 'character_general_items'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number | null

  @column()
  declare generalItemId: number

  @column()
  declare quantity: number

  @column()
  declare notes: string | null

  @column()
  declare chosenSkillBonusName: string | null

  @column()
  declare chosenSkillBonusValue: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Character)
  declare character: BelongsTo<typeof Character>

  @belongsTo(() => GeneralItem)
  declare generalItem: BelongsTo<typeof GeneralItem>
}
