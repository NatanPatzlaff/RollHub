import { HttpContext } from '@adonisjs/core/http'
import HomebrewItem from '#models/homebrew_item'
import { createHomebrewItemValidator } from '#validators/homebrew_item'

export default class HomebrewItemsController {
  async index({ response }: HttpContext) {
    const items = await HomebrewItem.query().preload('creator').orderBy('name', 'asc')
    
    // Grouping by type as requested
    const grouped = {
      weapon: items.filter(i => i.itemType === 'weapon'),
      protection: items.filter(i => i.itemType === 'protection'),
      ammunition: items.filter(i => i.itemType === 'ammunition'),
      general: items.filter(i => i.itemType === 'general'),
    }

    return response.ok(grouped)
  }

  async render({ inertia }: HttpContext) {
    const items = await HomebrewItem.query().preload('creator').orderBy('name', 'asc')
    
    const grouped = {
      weapon: items.filter(i => i.itemType === 'weapon'),
      protection: items.filter(i => i.itemType === 'protection'),
      ammunition: items.filter(i => i.itemType === 'ammunition'),
      general: items.filter(i => i.itemType === 'general'),
    }

    return inertia.render('homebrew/index', grouped)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    const payload = await request.validateUsing(createHomebrewItemValidator)

    const item = await HomebrewItem.create({
      ...payload,
      createdByUserId: user?.id || null,
    })

    return response.created(item)
  }

  async destroy({ params, response }: HttpContext) {
    const item = await HomebrewItem.findOrFail(params.id)
    await item.delete()

    return response.noContent()
  }
}