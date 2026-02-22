import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Origin from '#models/origin'
import Skill from '#models/skill'
import OriginAbility from '#models/origin_ability'

export default class OriginBenefit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare originId: number

  @column()
  declare skillId: number | null

  @column()
  declare originAbilityId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Origin)
  declare origin: BelongsTo<typeof Origin>

  @belongsTo(() => Skill)
  declare skill: BelongsTo<typeof Skill>

  @belongsTo(() => OriginAbility)
  declare ability: BelongsTo<typeof OriginAbility>
}
