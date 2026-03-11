import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'

export default class CampaignsController {
  async store({ auth, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'User must be logged in' })
    }
    // ...existing code...
  }

  async show({ params, inertia, response }: HttpContext) {
    // ...existing code...
  }

  async shield({ params, inertia, response }: HttpContext) {
    // ...existing code...
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

    return response.ok({ message: 'Campanha atualizada com sucesso', campaign })
  }
}
