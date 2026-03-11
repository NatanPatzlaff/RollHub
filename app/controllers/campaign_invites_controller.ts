import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import Character from '#models/character'

export default class CampaignInvitesController {
  async show({ params, inertia, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.redirect().toPath('/login')
    }

    try {
      const campaign = await Campaign.query()
        .where('invite_code', params.code)
        .preload('gameMaster')
        .firstOrFail()

      // Buscar personagens do usuário que ainda não estão nessa campanha
      const myCharacters = await Character.query()
        .where('user_id', user.id)
        .whereNotExists((query) => {
          query.from('campaign_members')
            .whereColumn('campaign_members.character_id', 'characters.id')
            .where('campaign_members.campaign_id', campaign.id)
        })

      return inertia.render('campaigns/join', {
        campaign,
        myCharacters
      })
    } catch (error) {
      console.error('Invite error:', error)
      return response.notFound({ message: 'Convite inválido ou expirado' })
    }
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { campaignId, characterId } = request.only(['campaignId', 'characterId'])

    try {
      const campaign = await Campaign.findOrFail(campaignId)

      // Verificar se já é membro
      const isMember = await campaign.related('players').query().where('user_id', user.id).first()
      if (isMember) {
        return response.redirect().toPath(`/campaigns/${campaign.id}`)
      }

      // Adicionar à campanha
      await campaign.related('players').attach({
        [user.id]: {
          character_id: characterId,
        },
      })

      return response.redirect().toPath(`/campaigns/${campaign.id}`)
    } catch (error) {
      console.error('Join error:', error)
      return response.internalServerError({ message: 'Erro ao entrar na campanha' })
    }
  }
}