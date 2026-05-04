import type { HttpContext } from '@adonisjs/core/http'
import Combat from '#models/combat'
import CombatParticipant from '#models/combat_participant'
import transmit from '@adonisjs/transmit/services/main'
import { DateTime } from 'luxon'
import Campaign from '#models/campaign'
import RoomMonster from '#models/room_monster'

export default class CombatsController {
  async store({ params, request, response }: HttpContext) {
    const { roomId, monsterParticipantIds } = request.only(['roomId', 'monsterParticipantIds'])

    const combat = await Combat.create({
      campaignId: params.campaignId,
      roomId: roomId || null,
      round: 1,
      active: true,
      startedAt: DateTime.now()
    })

    // Adiciona todos os jogadores da campanha com initiativePending: true
    const campaign = await Campaign.findOrFail(params.campaignId)
    const characters = await campaign.related('characters').query().preload('stats')

    for (const char of characters) {
      await combat.related('participants').create({
        combatId: combat.id,
        characterId: char.id,
        name: char.name,
        hpMax: char.stats?.maxHp || char.stats?.currentHp || 0,
        hpCurrent: char.stats?.currentHp || 0,
        initiative: 0,
        initiativePending: true
      })
    }

    // Adiciona monstros com iniciativa rolada automaticamente
    if (monsterParticipantIds && Array.isArray(monsterParticipantIds)) {
      for (const item of monsterParticipantIds) {
        const rm = await RoomMonster.findOrFail(item.roomMonsterId)
        const dice = rm.initiativeDice ?? 1
        const bonus = rm.initiativeBonus ?? 0
        let roll = 0
        for (let i = 0; i < dice; i++) {
          roll += Math.floor(Math.random() * 20) + 1
        }
        const initiative = roll + bonus

        await combat.related('participants').create({
          monsterId: rm.monsterId,
          roomMonsterId: rm.id,
          name: rm.name,
          hpMax: rm.hpMax,
          hpCurrent: rm.hpCurrent,
          initiative,
          initiativePending: false
        })
      }
    }

    await transmit.broadcast(`campaign/${params.campaignId}/events`, {
      type: 'COMBAT_STARTED',
      combatId: combat.id
    })

    // Após adicionar todos os participantes, pede iniciativa automaticamente
    await transmit.broadcast(`campaign/${params.campaignId}/events`, {
      type: 'REACTION_REQUEST',
      rollType: 'Iniciativa',
      attribute: 'agi',
      skill: 'iniciativa',
    })

    return response.redirect().back()
  }

  async requestInitiative({ params, response }: HttpContext) {
    await transmit.broadcast(`campaign/${params.campaignId}/events`, {
      type: 'REACTION_REQUEST',
      rollType: 'Iniciativa',
      attribute: 'agi',
      skill: 'iniciativa',
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
    const { damage, damageType } = request.only(['damage', 'damageType'])
    const participant = await CombatParticipant.findOrFail(params.participantId)

    let finalDamage = damage
    if (participant.roomMonsterId) {
      const rm = await RoomMonster.findOrFail(participant.roomMonsterId)
      if (rm.resistances) {
        const typeResistance = rm.resistances.byType?.[damageType] ?? 0
        const afterType = Math.max(0, damage - typeResistance)
        finalDamage = Math.max(0, afterType - (rm.resistances.flatRD ?? 0))
      }
    }

    participant.hpCurrent = Math.max(0, (participant.hpCurrent || 0) - finalDamage)
    await participant.save()

    const combat = await Combat.findOrFail(participant.combatId)

    await transmit.broadcast(`campaign/${combat.campaignId}/events`, {
      type: 'DAMAGE_APPLIED',
      participantId: participant.id,
      rawDamage: damage,
      finalDamage,
      damageType,
      hpCurrent: participant.hpCurrent,
      isDead: participant.hpCurrent === 0
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
