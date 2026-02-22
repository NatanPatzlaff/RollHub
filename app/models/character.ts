import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Campaign from '#models/campaign'
import Class from '#models/class'
import Origin from '#models/origin'
import Trail from '#models/trail'
import CharacterAttribute from '#models/character_attribute'
import CharacterStat from '#models/character_stat'
import CharacterSkill from '#models/character_skill'
import CharacterClassAbility from '#models/character_class_ability'
import CharacterOriginAbility from '#models/character_origin_ability'
import CharacterParanormalPower from '#models/character_paranormal_power'
import CharacterRitual from '#models/character_ritual'
import CharacterItem from '#models/character_item'
import CombatParticipant from '#models/combat_participant'

export default class Character extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare classId: number

  @column()
  declare originId: number

  @column()
  declare trailId: number | null

  @column()
  declare nex: number

  @column()
  declare xp: number

  @column()
  declare name: string

  @column()
  declare lore: string | null

  @column()
  declare appearance: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @belongsTo(() => Origin)
  declare origin: BelongsTo<typeof Origin>

  @belongsTo(() => Trail)
  declare trail: BelongsTo<typeof Trail>

  @hasOne(() => CharacterAttribute)
  declare attributes: HasOne<typeof CharacterAttribute>

  @hasOne(() => CharacterStat)
  declare stats: HasOne<typeof CharacterStat>

  @hasMany(() => CharacterSkill)
  declare skills: HasMany<typeof CharacterSkill>

  @hasMany(() => CharacterClassAbility)
  declare classAbilities: HasMany<typeof CharacterClassAbility>

  @hasMany(() => CharacterOriginAbility)
  declare originAbilities: HasMany<typeof CharacterOriginAbility>

  @hasMany(() => CharacterParanormalPower)
  declare paranormalPowers: HasMany<typeof CharacterParanormalPower>

  @hasMany(() => CharacterRitual)
  declare rituals: HasMany<typeof CharacterRitual>

  @hasMany(() => CharacterItem)
  declare items: HasMany<typeof CharacterItem>

  @hasMany(() => CombatParticipant)
  declare combatParticipations: HasMany<typeof CombatParticipant>

  @manyToMany(() => Campaign, {
    pivotTable: 'campaign_members',
  })
  declare campaigns: ManyToMany<typeof Campaign>
}
