import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Weapon extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare category: number

  @column()
  declare type: string

  @column()
  declare weaponType: string | null

  @column()
  declare damage: string

  @column()
  declare damageType: string | null

  @column()
  declare critical: string | null

  @column()
  declare criticalMultiplier: string

  @column()
  declare range: string | null

  @column()
  declare ammoCapacity: number | null

  @column()
  declare ammoType: string | null

  @column()
  declare spaces: number

  @column()
  declare description: string | null

  @column({ prepare: (value: any) => JSON.stringify(value) })
  declare special: any | null

  @column()
  declare isThrowable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
