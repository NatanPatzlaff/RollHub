import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Combat from '#models/combat'
import Character from '#models/character'

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
    declare name: string

    @column()
    declare initiative: number

    @column()
    declare hpCurrent: number | null

    @column({ prepare: (value: any) => JSON.stringify(value) })
    declare status: any | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @belongsTo(() => Combat)
    declare combat: BelongsTo<typeof Combat>

    @belongsTo(() => Character)
    declare character: BelongsTo<typeof Character>
}
