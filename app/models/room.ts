import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Mission from '#models/mission'
import RoomClue from '#models/room_clue'
import RoomItem from '#models/room_item'
import RoomNpc from '#models/room_npc'
import RoomMonster from '#models/room_monster'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare missionId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare state: 'unvisited' | 'active' | 'explored'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Mission)
  declare mission: BelongsTo<typeof Mission>

  @hasMany(() => RoomClue)
  declare roomClues: HasMany<typeof RoomClue>

  @hasMany(() => RoomItem)
  declare roomItems: HasMany<typeof RoomItem>

  @hasMany(() => RoomNpc)
  declare roomNpcs: HasMany<typeof RoomNpc>

  @hasMany(() => RoomMonster)
  declare roomMonsters: HasMany<typeof RoomMonster>
}