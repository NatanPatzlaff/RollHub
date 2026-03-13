import { HttpContext } from '@adonisjs/core/http'
import CampaignNote from '#models/campaign_note'
import Campaign from '#models/campaign'

export default class CampaignNotesController {
  public async index({ params, response, auth }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    const isOwner = campaign.userId === auth.user!.id

    const notes = await campaign
      .related('notes')
      .query()
      .where((q) => {
        if (isOwner) return // mestre vê tudo
        q.where('is_private', false).orWhere('user_id', auth.user!.id)
      })
      .orderBy('created_at', 'desc')

    return response.ok({ notes })
  }

  public async store({ params, request, response, auth }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    const payload = request.only(['title', 'content', 'isPrivate'])
    
    const note = await campaign.related('notes').create({
      title: payload.title || 'Nova Anotação',
      content: payload.content || '',
      isPrivate: payload.isPrivate ?? false,
      userId: auth.user!.id
    })

    return response.created(note)
  }

  public async update({ params, request, response }: HttpContext) {
    const note = await CampaignNote.findOrFail(params.id)
    const payload = request.only(['title', 'content'])
    
    note.merge(payload)
    await note.save()

    return response.ok(note)
  }

  public async destroy({ params, response }: HttpContext) {
    const note = await CampaignNote.findOrFail(params.id)
    await note.delete()
    return response.noContent()
  }
}
