import { HttpContext } from '@adonisjs/core/http'
import CampaignNote from '#models/campaign_note'
import Campaign from '#models/campaign'

export default class CampaignNotesController {
  public async index({ params, response }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    const notes = await campaign.related('notes').query().orderBy('updated_at', 'desc')
    return response.ok(notes)
  }

  public async store({ params, request, response }: HttpContext) {
    const campaign = await Campaign.findOrFail(params.id)
    const payload = request.only(['title', 'content'])
    
    const note = await campaign.related('notes').create({
      title: payload.title || 'Nova Anotação',
      content: payload.content || '',
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
