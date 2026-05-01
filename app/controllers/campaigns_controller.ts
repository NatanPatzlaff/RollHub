import { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import Combat from '#models/combat'
import Monster from '#models/monster'
import HomebrewItem from '#models/homebrew_item'
import { createCampaignValidator, updateCampaignValidator } from '#validators/campaign'
import CampaignRoll from '#models/campaign_roll'
import { DateTime } from 'luxon'
import transmit from '@adonisjs/transmit/services/main'
import db from '@adonisjs/lucid/services/db'

export default class CampaignsController {
  async store({ request, auth, response, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Usuário não autenticado' })
    }

    try {
      const payload = await request.validateUsing(createCampaignValidator)

      const campaign = await Campaign.create({
        gameMasterId: user.id,
        name: payload.name,
        description: payload.description,
      })

      return response.redirect().toPath(`/campaigns/${campaign.id}/shield`)
    } catch (error) {
      session.flash('errors', error.messages || { name: 'Erro ao criar campanha' })
      return response.redirect().back()
    }
  }

  async show({ params, auth, inertia, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.redirect().toPath('/login')

    const campaign = await Campaign.query()
      .where('id', params.id)
      .preload('characters', (query) => {
        query.preload('user')
        query.preload('stats')
        query.preload('class')
      })
      .first()

    if (!campaign) {
      return response.notFound({ message: 'Campanha não encontrada' })
    }

    const isGM = campaign.gameMasterId === user.id
    const isPlayer = await campaign.related('players').query().where('user_id', user.id).first()

    if (!isGM && !isPlayer) {
      return response.forbidden({ message: 'Você não tem acesso a esta campanha' })
    }

    return inertia.render('campaigns/show', {
      campaign: {
        ...campaign.serialize(),
        isOwner: isGM,
        showPlayerStats: campaign.showPlayerStats
      },
      isGM,
    })
  }

  async shield({ params, auth, inertia, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.redirect().toPath('/login')

    const campaign = await Campaign.query()
      .where('id', params.id)
      .preload('characters', (query) => {
        query.preload('user')
        query.preload('stats')
        query.preload('class')
      })
      .first()

    if (!campaign) {
      return response.notFound({ message: 'Campanha não encontrada' })
    }

    const isGM = campaign.gameMasterId === user.id

    if (!isGM) {
      return response.forbidden({ message: 'Apenas o mestre pode acessar o escudo' })
    }

    const homebrewItems = await HomebrewItem.query().orderBy('name', 'asc')

    const activeCombat = await Combat.query()
      .where('campaign_id', params.id)
      .where('active', true)
      .preload('participants', (query) => {
        query.preload('character', (q) => q.preload('stats').preload('class'))
        query.preload('monster')
        query.preload('roomMonster')
      })
      .first()

    const campaignMonsters = await Monster.query()
      .where('campaign_id', params.id)
      .orWhereNull('campaign_id')
      .orderBy('name', 'asc')

    console.log('MONSTER DEBUG:', JSON.stringify(activeCombat?.participants?.[0], null, 2))

    return inertia.render('campaigns/shield', {
      campaign: {
        ...campaign.serialize(),
        isOwner: true,
        showPlayerStats: campaign.showPlayerStats
      },
      isGM: true,
      homebrewItems,
      activeCombat: activeCombat ? activeCombat.serialize() : null,
      campaignMonsters: campaignMonsters.map(m => m.serialize()),
    })
  }

  async update({ params, request, auth, response, session }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Usuário não autenticado' })
    }

    const campaign = await Campaign.find(params.id)
    if (!campaign) {
      return response.notFound({ message: 'Campanha não encontrada' })
    }

    if (campaign.gameMasterId !== user.id) {
      return response.forbidden({ message: 'Apenas o mestre pode editar a campanha' })
    }

    try {
      const payload = await request.validateUsing(updateCampaignValidator)

      campaign.name = payload.name
      campaign.description = payload.description || ''
      await campaign.save()

      return response.redirect().back()
    } catch (error) {
      session.flash('errors', error.messages || { name: 'Erro ao atualizar campanha' })
      return response.redirect().back()
    }
  }

  /**
   * Retorna o histórico de rolagens da campanha
   */
  async getRolls({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const campaign = await Campaign.findOrFail(params.id)

    // Verificar se o usuário é membro da campanha (Mestre ou Jogador)
    const isGM = campaign.gameMasterId === user.id
    const isMember = await db
      .from('campaign_members')
      .where('campaign_id', campaign.id)
      .where('user_id', user.id)
      .first()

    if (!isGM && !isMember) {
      return response.forbidden({ error: 'Acesso negado' })
    }

    // Buscar timestamp de limpeza (se existir) para o usuário na campanha
    const clearRecord = await db
      .from('character_roll_clears')
      .whereIn('character_id', 
        db.from('campaign_members')
          .select('character_id')
          .where('user_id', user.id)
          .where('campaign_id', campaign.id)
          .whereNotNull('character_id')
      )
      .first()

    // Buscar as rolagens da campanha
    let query = db
      .from('campaign_rolls')
      .where('campaign_id', campaign.id)

    // Se não for o mestre, não ver rolagens secretas
    if (!isGM) {
      query = query.where('is_secret', false)
    }

    if (clearRecord) {
      query = query.where('rolled_at', '>', clearRecord.cleared_at)
    }

    const rolls = await query.orderBy('rolled_at', 'desc').limit(100)
    
    // Mapear dice_values
    const formattedRolls = rolls.map((r) => ({
      ...r,
      diceValues: (() => {
        try {
          return typeof r.dice_values === 'string' ? JSON.parse(r.dice_values) : r.dice_values
        } catch {
          return null
        }
      })(),
    }))

    return response.ok({ rolls: formattedRolls })
  }

  /**
   * Salva uma nova rolagem na campanha (geralmente para monstros ou mestre)
   */
  async saveRoll({ params, request, response, auth }: HttpContext) {
    const user = auth.user!
    const campaignId = params.id
    const campaign = await Campaign.findOrFail(campaignId)

    // Verificar se o usuário é o mestre ou membro da campanha
    const isGM = campaign.gameMasterId === user.id
    const isMember = await db
      .from('campaign_members')
      .where('campaign_id', campaign.id)
      .where('user_id', user.id)
      .first()

    if (!isGM && !isMember) {
      return response.forbidden({ error: 'Acesso negado' })
    }

    const data = request.only([
      'action',
      'roll_expression',
      'result',
      'is_critical',
      'is_fail',
      'is_gm',
      'is_secret',
      'diceValues',
      'playerName',
      'characterId',
    ])

    const roll = await CampaignRoll.create({
      campaignId: campaign.id,
      characterId: data.characterId || null,
      playerName: data.playerName || user.fullName || 'Mestre',
      action: data.action,
      rollExpression: data.roll_expression,
      result: data.result,
      isCritical: data.is_critical || false,
      isFail: data.is_fail || false,
      isGm: data.is_gm !== undefined ? data.is_gm : isGM,
      isSecret: data.is_secret || false,
      diceValues: data.diceValues
        ? typeof data.diceValues === 'string'
          ? data.diceValues
          : JSON.stringify(data.diceValues)
        : null,
      rolledAt: DateTime.now(),
    })

    if (!roll.isSecret) {
      await transmit.broadcast(`campaign/${campaign.id}/events`, {
        type: 'MONSTER_ROLL',
        roll: {
          id: roll.id,
          playerName: roll.playerName,
          action: roll.action,
          result: roll.result,
          rollExpression: roll.rollExpression,
          isCritical: roll.isCritical,
          isFail: roll.isFail,
          isGm: roll.isGm,
          rolledAt: roll.rolledAt.toISO(),
        }
      })
    }

    return response.ok({ success: true, roll })
  }

  async updateSettings({ params, request, auth, response }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    if (campaign.gameMasterId !== auth.user!.id) {
      return response.status(403).send('Forbidden')
    }

    const { showPlayerStats } = request.only(['showPlayerStats'])
    campaign.showPlayerStats = showPlayerStats
    await campaign.save()

    return { success: true, showPlayerStats: campaign.showPlayerStats }
  }

  async getSettings({ params }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    return { showPlayerStats: campaign.showPlayerStats }
  }

  /**
   * Remove permanentemente todas as rolagens da campanha (apenas Mestre)
   */
  async clearAllRolls({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const campaign = await Campaign.findOrFail(params.id)

    // Verificar se o usuário é o mestre da campanha
    if (campaign.gameMasterId !== user.id) {
      return response.forbidden({ error: 'Apenas o mestre pode limpar todo o histórico da campanha' })
    }

    try {
      // 1. Deletar todas as rolagens da campanha
      await db.from('campaign_rolls').where('campaign_id', campaign.id).delete()

      // 2. Deletar registros de limpeza individual para resetar o estado de todos os jogadores
      // Buscamos os character_ids ligados à campanha através de campaign_members
      await db.from('character_roll_clears')
        .whereIn('character_id', 
          db.from('campaign_members')
            .select('character_id')
            .where('campaign_id', campaign.id)
            .whereNotNull('character_id')
        )
        .delete()

      return response.ok({ success: true })
    } catch (error) {
      console.error('Erro ao limpar histórico total:', error)
      return response.internalServerError({ error: 'Erro ao limpar histórico da campanha' })
    }
  }

  async sendReactionRequest({ params, request, response, auth }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    if (campaign.gameMasterId !== auth.user!.id) {
      return response.forbidden({ error: 'Apenas o mestre pode solicitar reações' })
    }

    const { characterId, attackerName, actionType } = request.all()

    // Transmitir evento para o canal do personagem específico
    await transmit.broadcast(`character/${characterId}/reactions`, {
      type: 'REACTION_REQUEST',
      attackerName,
      actionType, // 'attack' | 'spell' | 'other'
      timestamp: new Date().toISOString()
    })

    return response.ok({ success: true })
  }

  async sendReactionResponse({ params, request, response, auth }: HttpContext) {
    const { reactionType, type, value, characterId } = request.all()
    
    // Default flow for initiative type
    if (type === 'initiative') {
      const Combat = (await import('#models/combat')).default
      const CombatParticipant = (await import('#models/combat_participant')).default

      const combat = await Combat.query()
        .where('campaign_id', params.id)
        .where('active', true)
        .first()

      if (combat) {
        await CombatParticipant.query()
          .where('combat_id', combat.id)
          .where('character_id', characterId)
          .update({ initiative: value, initiative_pending: false })

        await transmit.broadcast(`campaign/${params.id}/events`, {
          type: 'INITIATIVE_UPDATED',
          characterId,
          initiative: value
        })

        // Verifica se todos responderam
        const pending = await CombatParticipant.query()
          .where('combat_id', combat.id)
          .where('initiative_pending', true)
          .count('* as total')

        if (Number(pending[0].$extras.total) === 0) {
          await transmit.broadcast(`campaign/${params.id}/events`, {
            type: 'COMBAT_READY',
            combatId: combat.id
          })
        }
      }
    }

    const campaignId = params.id

    // Notificar o mestre da resposta
    await transmit.broadcast(`campaign/${campaignId}/reaction-responses`, {
      type: 'REACTION_RESPONSE',
      characterId,
      reactionType: reactionType || type,
      playerName: auth.user!.fullName || auth.user!.email,
      timestamp: new Date().toISOString()
    })

    return response.ok({ success: true })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Usuário não autenticado' })
    }

    const campaign = await Campaign.find(params.id)
    if (!campaign) {
      return response.notFound({ message: 'Campanha não encontrada' })
    }

    if (campaign.gameMasterId !== user.id) {
      return response.forbidden({ message: 'Apenas o mestre pode excluir a campanha' })
    }

    await campaign.delete()

    return response.redirect().toPath('/')
  }

  async notifyTurn({ params, request, response }: HttpContext) {
    const campaignId = params.id
    const { characterId, characterName } = request.all()

    await transmit.broadcast(`campaign/${campaignId}/events`, {
      type: 'TURN_START',
      characterId,
      characterName,
      timestamp: new Date().toISOString(),
    })

    return response.ok({ success: true })
  }

  async endScene({ params, response }: HttpContext) {
    const campaignId = params.id

    await transmit.broadcast(`campaign/${campaignId}/events`, {
      type: 'SCENE_END',
      timestamp: new Date().toISOString(),
    })

    return response.ok({ success: true })
  }
}
