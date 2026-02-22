import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Campaign from '#models/campaign'
import CombatParticipant from '#models/combat_participant'

export default class Combat extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare campaignId: number

    @column()
    declare round: number

    @column()
    declare active: boolean

    @column.dateTime()
    declare startedAt: DateTime | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @belongsTo(() => Campaign)
    declare campaign: BelongsTo<typeof Campaign>

    @hasMany(() => CombatParticipant)
    declare participants: HasMany<typeof CombatParticipant>
}
