import type { HttpContext } from '@adonisjs/core/http'
import Combat from '#models/combat'
import CombatParticipant from '#models/combat_participant'
import transmit from '@adonisjs/transmit/services/main'
import { DateTime } from 'luxon'
import Campaign from '#models/campaign'
import RoomMonster from '#models/room_monster'

export default class CombatsController {
  async store({ params, request, response }: HttpContext) {
    const campaignId = params.campaignId
    const { roomId, monsterParticipantIds } = request.only(['roomId', 'monsterParticipantIds'])

    const combat = await Combat.create({
      campaignId: campaignId,
      roomId: roomId || null,
      round: 1,
      active: true,
      startedAt: DateTime.now(),
    })

    // 1. Adicionar Jogadores Automaticamente
    const campaign = await Campaign.findOrFail(campaignId)
    const characters = await campaign.related('characters').query().preload('stats')
    
    for (const char of characters) {
      await CombatParticipant.create({
        combatId: combat.id,
        characterId: char.id,
        name: char.name,
        initiative: 0,
        hpMax: char.stats?.maxHp || 0,
        hpCurrent: char.stats?.currentHp || 0,
      })
    }

    // 2. Adicionar Monstros Selecionados
    if (monsterParticipantIds && Array.isArray(monsterParticipantIds)) {
      for (const entry of monsterParticipantIds) {
        const roomMonster = await RoomMonster.query()
          .where('id', entry.roomMonsterId)
          .preload('monster')
          .first()
        
        if (roomMonster) {
          const monster = roomMonster.monster
          for (let i = 1; i <= roomMonster.quantity; i++) {
            const displayName = roomMonster.quantity > 1 
              ? `${monster.name} #${i}` 
              : monster.name

            await CombatParticipant.create({
              combatId: combat.id,
              monsterId: monster.id,
              name: displayName,
              initiative: entry.initiative || 0,
              hpMax: monster.hpMax,
              hpCurrent: monster.hpMax,
            })
          }
        }
      }
    }

    await transmit.broadcast(`campaign/${campaignId}/events`, {
      type: 'COMBAT_STARTED',
      combatId: combat.id,
      timestamp: DateTime.now().toISO(),
    })

    return response.redirect().back()
  }

  async addParticipant({ params, request, response }: HttpContext) {
    const { combatId } = params
    const { type, entityId, name, initiative, hpMax, hpCurrent } = request.all()

    const participant = await CombatParticipant.create({
      combatId,
      characterId: type === 'character' ? entityId : null,
      monsterId: type === 'monster' ? entityId : null,
      name,
      initiative: initiative || 0,
      hpMax: hpMax || 0,
      hpCurrent: hpCurrent || hpMax || 0,
    })

    // Fetch the campaignId to broadcast
    const combat = await Combat.findOrFail(combatId)

    await transmit.broadcast(`campaign/${combat.campaignId}/events`, {
      type: 'PARTICIPANT_ADDED',
      participant: participant.serialize(),
    })

    return response.redirect().back()
  }

  async nextTurn({ params, response }: HttpContext) {
    const { combatId } = params
    const combat = await Combat.query().where('id', combatId).preload('participants').firstOrFail()

    if (combat.participants.length === 0) {
      return response.redirect().back()
    }

    // Sort by initiative desc
    const sortedParticipants = combat.participants.sort((a, b) => b.initiative - a.initiative)
    
    let nextIndex = 0
    if (combat.currentParticipantId) {
      const currentIndex = sortedParticipants.findIndex(p => p.id === combat.currentParticipantId)
      nextIndex = (currentIndex + 1) % sortedParticipants.length
      
      // If we cycled back to start, increase round
      if (nextIndex === 0) {
        combat.round += 1
      }
    }

    const nextParticipant = sortedParticipants[nextIndex]
    combat.currentParticipantId = nextParticipant.id
    await combat.save()

    await transmit.broadcast(`campaign/${combat.campaignId}/events`, {
      type: 'TURN_START',
      characterId: nextParticipant.characterId, // For compatibility
      participantId: nextParticipant.id,
      characterName: nextParticipant.name,
      round: combat.round,
      timestamp: DateTime.now().toISO(),
    })

    return response.redirect().back()
  }

  async applyDamage({ params, request, response }: HttpContext) {
    const { participantId } = params
    const { rawDamage, damageType } = request.all()

    const participant = await CombatParticipant.query()
      .where('id', participantId)
      .preload('monster')
      .firstOrFail()

    let finalDamage = rawDamage

    if (participant.monster) {
      const resistances = participant.monster.resistances || { flatRD: 0, byType: {} }
      const resistanceValue = (resistances.byType as any)?.[damageType] ?? 0
      
      const afterResistance = Math.max(0, rawDamage - resistanceValue)
      finalDamage = Math.max(0, afterResistance - (resistances.flatRD || 0))
    }

    participant.hpCurrent = Math.max(0, (participant.hpCurrent || 0) - finalDamage)
    await participant.save()

    const combat = await Combat.findOrFail(participant.combatId)

    await transmit.broadcast(`campaign/${combat.campaignId}/events`, {
      type: 'DAMAGE_APPLIED',
      participantId: participant.id,
      rawDamage,
      finalDamage,
      damageType,
      hpCurrent: participant.hpCurrent,
      isDead: participant.hpCurrent === 0,
    })

    return response.redirect().back()
  }

  async updateInitiative({ params, request, response }: HttpContext) {
    const { participantId } = params
    const { initiative } = request.all()

    const participant = await CombatParticipant.findOrFail(participantId)
    participant.initiative = initiative
    await participant.save()

    const combat = await Combat.findOrFail(participant.combatId)

    await transmit.broadcast(`campaign/${combat.campaignId}/events`, {
      type: 'INITIATIVE_UPDATED',
      participantId: participant.id,
      initiative,
    })

    return response.redirect().back()
  }

  async endCombat({ params, response }: HttpContext) {
    const { combatId } = params
    const combat = await Combat.findOrFail(combatId)

    combat.active = false
    await combat.save()

    await transmit.broadcast(`campaign/${combat.campaignId}/events`, {
      type: 'SCENE_END',
      combatId: combat.id,
    })

    return response.redirect().back()
  }
}
