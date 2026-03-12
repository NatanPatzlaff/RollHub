import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'

export default class CampaignsController {
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Usuário não autenticado' })
    }

    const { name, description } = request.only(['name', 'description'])

    // Caso de uma validação básica
    if (!name || name.length < 3) {
      return response.badRequest({ message: 'Nome inválido' })
    }

    const campaign = await Campaign.create({
      gameMasterId: user.id,
      name,
      description,
    })

    return response.redirect().toPath(`/campaigns/${campaign.id}`)
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

  async update({ params, request, auth, response }: HttpContext) {
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

    const name = request.input('name', '').trim()
    const description = request.input('description', '').trim()

    if (!name || name.length < 3 || name.length > 64) {
      return response.badRequest({ message: 'Nome inválido (3-64 caracteres)' })
    }
    if (description.length > 256) {
      return response.badRequest({ message: 'Descrição muito longa (máx. 256 caracteres)' })
    }

    campaign.name = name
    campaign.description = description
    await campaign.save()

    return response.redirect().back()
  }
}
