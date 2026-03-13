import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import { createCampaignValidator, updateCampaignValidator } from '#validators/campaign'
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

      return response.redirect().toPath(`/campaigns/${campaign.id}`)
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
      campaign,
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

    return inertia.render('campaigns/shield', {
      campaign,
      isGM,
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
}
