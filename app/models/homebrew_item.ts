import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Character from '#models/character'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class HomebrewItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare itemType: 'weapon' | 'protection' | 'ammunition' | 'general'

  @column()
  declare createdByUserId: number | null

  @column()
  declare damage: string | null

  @column()
  declare damageType: string | null

  @column()
  declare range: string | null

  @column()
  declare defenseBonus: number | null

  @column()
  declare penalty: number | null

  @column()
  declare caliber: string | null

  @column()
  declare quantityPerBox: number | null

  @column()
  declare weight: number | null

  @column()
  declare price: number | null

  @column()
  declare category: number | null

  @column()
  declare skillBonusName: string | null

  @column()
  declare skillBonusValue: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  declare creator: BelongsTo<typeof User>

  @manyToMany(() => Character, {
    pivotTable: 'character_homebrew_items',
    pivotColumns: ['quantity', 'notes', 'status', 'rejection_reason'],
    pivotTimestamps: true,
  })
  declare characters: ManyToMany<typeof Character>
}