import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CharacterActiveBuff extends BaseModel {
  public static table = 'character_active_buffs'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare characterId: number

  @column()
  declare buffType: string

  @column()
  declare buffId: string

  @column()
  declare label: string

  @column({
    prepare: (v: any) => JSON.stringify(v),
    consume: (v: any) => typeof v === 'string' ? JSON.parse(v) : v
  })
  declare data: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
