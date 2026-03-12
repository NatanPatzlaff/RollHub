import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import CampaignInvite from '#models/campaign_invite'
import Character from '#models/character'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export default class CampaignInvitesController {
  /**
   * Gera um novo token para a campanha ou retorna o existente (apenas GM)
   */
  async generate({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const campaign = await Campaign.findOrFail(params.id)

    if (campaign.gameMasterId !== user.id) {
      return response.forbidden({ message: 'Apenas o mestre pode gerar convites' })
    }

    // Tenta encontrar um convite ativo e válido
    let invite = await CampaignInvite.query()
      .where('campaign_id', campaign.id)
      .where((query) => {
        query.whereNull('expires_at').orWhere('expires_at', '>', DateTime.now().toSQL())
      })
      .first()

    if (!invite) {
      invite = await CampaignInvite.create({
        campaignId: campaign.id,
        token: crypto.randomBytes(32).toString('hex'),
      })
    }

    return response.ok({ token: invite.token })
  }

  /**
   * Preview público do convite + personagens do usuário (se logado)
   */
  async preview({ params, inertia, response, auth }: HttpContext) {
    const user = auth.user
    const invite = await CampaignInvite.query()
      .where('token', params.token)
      .preload('campaign', (q) => {
        q.preload('gameMaster')
        q.preload('players')
      })
      .first()

    if (!invite) {
      return response.notFound({ message: 'Convite não encontrado' })
    }

    // Verifica expiração
    if (invite.expiresAt && invite.expiresAt < DateTime.now()) {
      return response.gone({ message: 'Convite expirado' })
    }

    // Verifica limite de usos
    if (invite.maxUses && invite.usesCount >= invite.maxUses) {
      return response.gone({ message: 'Convite esgotado' })
    }

    let myCharacters: Character[] = []
    if (user) {
      // Buscar personagens do usuário que ainda não estão nessa campanha
      myCharacters = await Character.query()
        .where('user_id', user.id)
        .whereNotExists((query) => {
          query.from('campaign_members')
            .whereColumn('campaign_members.character_id', 'characters.id')
            .where('campaign_members.campaign_id', invite.campaign.id)
        })
    }

    return inertia.render('invite/show', {
      campaign: {
        id: invite.campaign.id,
        name: invite.campaign.name,
        description: invite.campaign.description,
        gameMaster: {
          id: invite.campaign.gameMaster.id,
          username: invite.campaign.gameMaster.fullName || invite.campaign.gameMaster.email,
        },
        playerCount: invite.campaign.players.length,
      },
      token: invite.token,
      myCharacters: myCharacters.map(c => ({
        id: c.id,
        name: c.name,
      }))
    })
  }

  /**
   * Usuário aceita o convite escolhendo um personagem
   */
  async accept({ params, auth, request, response, session }: HttpContext) {
    const user = auth.user!
    const { characterId } = request.only(['characterId'])
    
    if (!characterId) {
      session.flash('errors', { characterId: 'Você precisa escolher um personagem' })
      return response.redirect().back()
    }

    const invite = await CampaignInvite.query()
      .where('token', params.token)
      .preload('campaign')
      .first()

    // 1. Token existe?
    if (!invite) {
      return response.notFound({ message: 'Convite não encontrado' })
    }

    // 2. Expirado?
    if (invite.expiresAt && invite.expiresAt < DateTime.now()) {
      session.flash('errors', { invite: 'Convite expirado' })
      return response.redirect().back()
    }

    // 3. Esgotou?
    if (invite.maxUses && invite.usesCount >= invite.maxUses) {
      session.flash('errors', { invite: 'Convite esgotado' })
      return response.redirect().back()
    }

    // 4. Já é membro com ESSE personagem?
    const isMember = await invite.campaign
      .related('players')
      .query()
      .where('user_id', user.id)
      .andWherePivot('character_id', characterId)
      .first()

    if (isMember) {
      return response.redirect().toPath(`/campaigns/${invite.campaign.id}`)
    }

    // 5. Adicionar jogador vinculado ao personagem e incrementar uses_count
    await invite.campaign.related('players').attach({
      [user.id]: {
        character_id: characterId,
        role: 'PLAYER'
      }
    })
    
    invite.usesCount++
    await invite.save()

    session.flash('success', 'Bem-vindo à campanha!')
    return response.redirect().toPath(`/campaigns/${invite.campaign.id}`)
  }
}