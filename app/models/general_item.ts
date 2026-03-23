import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GeneralItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: number

  @column()
  declare type: string | null

  @column()
  declare spaces: number

  @column()
  declare description: string | null

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare effects: any | null

  @column()
  declare skillBonusName: string | null

  @column()
  declare skillBonusValue: number | null

  @column()
  declare skillBonusIsChoosable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
