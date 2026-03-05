import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ProtectionModification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: number

  @column()
  declare type: string

  @column()
  declare element: string | null

  @column()
  declare description: string | null

  @column()
  declare specialProperties: any

  @column()
  declare defenseBonus: number | null

  @column()
  declare protectionTypeRestriction: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}