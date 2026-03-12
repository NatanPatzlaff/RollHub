import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import { createCampaignValidator, updateCampaignValidator } from '#validators/campaign'

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
}
