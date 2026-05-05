import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Combat from '#models/combat'
import Character from '#models/character'
import Monster from '#models/monster'
import RoomMonster from '#models/room_monster'

export default class CombatParticipant extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare combatId: number

    @column()
    declare characterId: number | null

    @column()
    declare monsterId: number | null

    @column()
    declare roomMonsterId: number | null

    @column()
    declare name: string

    @column()
    declare initiative: number

    @column()
    declare initiativePending: boolean

    @column()
    declare hpCurrent: number | null

    @column()
    declare hpMax: number

    @column({ 
        prepare: (value: any) => JSON.stringify(value),
        consume: (value: any) => typeof value === 'string' ? JSON.parse(value) : value
    })
    declare status: any | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @belongsTo(() => Combat)
    declare combat: BelongsTo<typeof Combat>

    @belongsTo(() => Character)
    declare character: BelongsTo<typeof Character>

    @belongsTo(() => Monster)
    declare monster: BelongsTo<typeof Monster>

    @belongsTo(() => RoomMonster)
    declare roomMonster: BelongsTo<typeof RoomMonster>
}

