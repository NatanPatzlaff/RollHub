import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Protection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: number

  @column()
  declare type: string

  @column()
  declare defenseBonus: number

  @column()
  declare dodgePenalty: number

  @column()
  declare spaces: number

  @column()
  declare description: string | null

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare special: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
