import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Room from '#models/room'
import Monster from '#models/monster'
import type { 
  MonsterAttack, 
  MonsterAbility, 
  MonsterResistances, 
  AlternativeMovement, 
  AdditionalSkill 
} from '#models/monster'

export default class RoomMonster extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roomId: number

  @column()
  declare monsterId: number | null

  @column()
  declare quantity: number

  // Espelhamento de Monster.ts
  @column()
  declare name: string

  @column()
  declare type: string | null

  @column()
  declare size: string | null

  @column()
  declare element: string | null

  @column()
  declare secondaryElements: string | null

  @column()
  declare vd: number

  @column()
  declare defense: number

  @column()
  declare hpMax: number

  @column()
  declare hpCurrent: number

  @column()
  declare movement: number

  @column({
    prepare: (value: AlternativeMovement[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '[]')
  })
  declare alternativeMovements: AlternativeMovement[]

  @column()
  declare nexImmune: number

  @column()
  declare immunities: string | null

  @column()
  declare additionalImmunities: string | null

  @column()
  declare vulnerabilities: string | null

  @column()
  declare agi: number

  @column()
  declare str: number

  @column()
  declare int: number

  @column()
  declare pre: number

  @column()
  declare vig: number

  @column()
  declare perceptionDice: number

  @column()
  declare perceptionBonus: number

  @column()
  declare initiativeDice: number

  @column()
  declare initiativeBonus: number

  @column()
  declare fortitudeDice: number

  @column()
  declare fortitudeBonus: number

  @column()
  declare reflexDice: number

  @column()
  declare reflexBonus: number

  @column()
  declare willDice: number

  @column()
  declare willBonus: number

  @column({
    prepare: (value: AdditionalSkill[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '[]')
  })
  declare additionalSkills: AdditionalSkill[]

  @column({
    prepare: (value: MonsterAttack[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '[]')
  })
  declare attacks: MonsterAttack[]

  @column({
    prepare: (value: MonsterAbility[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '[]')
  })
  declare abilities: MonsterAbility[]

  @column({
    prepare: (value: MonsterResistances) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value || '{"flatRD":0,"byType":{}}')
  })
  declare resistances: MonsterResistances

  @column()
  declare disturbingPresenceDt: number | null

  @column()
  declare disturbingPresenceDamage: string | null

  @column()
  declare description: string | null

  @column()
  declare fearEnigma: string | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @belongsTo(() => Monster)
  declare monster: BelongsTo<typeof Monster>
}
