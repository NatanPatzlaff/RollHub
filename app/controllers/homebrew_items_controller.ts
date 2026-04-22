import { HttpContext } from '@adonisjs/core/http'
import HomebrewItem from '#models/homebrew_item'
import Character from '#models/character'
import Campaign from '#models/campaign'
import { createHomebrewItemValidator } from '#validators/homebrew_item'
import transmit from '@adonisjs/transmit/services/main'
import db from '@adonisjs/lucid/services/db'

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

  async storeForPlayer({ params, request, auth, response, session }: HttpContext) {
    const user = auth.user!
    const characterId = params.characterId
    
    const character = await Character.query()
      .where('id', characterId)
      .where('user_id', user.id)
      .preload('campaigns')
      .firstOrFail()

    const name = request.input('name')?.trim()
    if (name) {
      const existing = await HomebrewItem.query()
        .whereRaw('LOWER(name) = LOWER(?)', [name])
        .first()

      if (existing) {
        session.flash('errors', { name: 'Já existe um item homebrew com esse nome.' })
        return response.redirect().back()
      }
    }

    const payload = await request.validateUsing(createHomebrewItemValidator)

    const campaign = await Campaign.query()
      .whereHas('characters', (q) => q.where('characters.id', characterId))
      .first()

    const requireApproval = campaign?.requireItemApproval ?? false
    const status = requireApproval ? 'pending' : 'active'

    const trx = await db.transaction()
    try {
      const item = await HomebrewItem.create({
        ...payload,
        createdByUserId: user.id,
      }, { client: trx })

      await trx.table('character_homebrew_items').insert({
        character_id: character.id,
        homebrew_item_id: item.id,
        quantity: 1, // Default quantity
        notes: payload.description || '',
        status: status,
        created_at: new Date(),
        updated_at: new Date(),
      })

      await trx.commit()

      // Enviar evento SSE apenas se personagem estiver em campanha
      if (campaign) {
        const type = status === 'pending' ? 'CUSTOM_ITEM_PENDING' : 'CUSTOM_ITEM_ADDED'
        await transmit.broadcast(`campaign/${campaign.id}/events`, {
          type,
          characterId: character.id,
          item: { ...item.serialize(), pivot_status: status },
          timestamp: new Date().toISOString()
        })
      }

      return response.redirect().back()
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Erro ao criar item customizado')
      return response.redirect().back()
    }
  }

  async approveItem({ params, auth, response }: HttpContext) {
    const user = auth.user!
    // Procurar o character_homebrew_items pelo id do homebrewItem
    // Mas precisamos da campaignId para validar o gameMaster
    const pivot = await db.from('character_homebrew_items').where('homebrew_item_id', params.id).firstOrFail()
    const character = await Character.query().where('id', pivot.character_id).preload('campaigns').firstOrFail()
    const campaign = character.campaigns[0]

    if (campaign.gameMasterId !== user.id) {
      return response.forbidden({ error: 'Apenas o mestre pode aprovar itens.' })
    }

    await db.from('character_homebrew_items').where('homebrew_item_id', params.id).update({ status: 'active', updated_at: new Date() })

    await transmit.broadcast(`campaign/${campaign.id}/events`, {
      type: 'CUSTOM_ITEM_APPROVED',
      characterId: character.id,
      timestamp: new Date().toISOString()
    })

    return response.ok({ success: true })
  }

  async rejectItem({ params, request, auth, response }: HttpContext) {
    const user = auth.user!
    const { rejectionReason } = request.only(['rejectionReason'])

    const pivot = await db.from('character_homebrew_items').where('homebrew_item_id', params.id).firstOrFail()
    const character = await Character.query().where('id', pivot.character_id).preload('campaigns').firstOrFail()
    const campaign = character.campaigns[0]

    if (campaign.gameMasterId !== user.id) {
      return response.forbidden({ error: 'Apenas o mestre pode rejeitar itens.' })
    }

    await db.from('character_homebrew_items').where('homebrew_item_id', params.id).update({
      status: 'rejected',
      rejection_reason: rejectionReason,
      updated_at: new Date()
    })

    await transmit.broadcast(`campaign/${campaign.id}/events`, {
      type: 'CUSTOM_ITEM_REJECTED',
      characterId: character.id,
      rejectionReason,
      timestamp: new Date().toISOString()
    })

    return response.ok({ success: true })
  }

  async addExistingToCharacter({ params, request, auth, response }: HttpContext) {
    const user = auth.user!
    const characterId = params.characterId
    const { homebrewItemId } = request.only(['homebrewItemId'])

    // 1. Verificar propriedade do personagem
    const character = await Character.query()
      .where('id', characterId)
      .where('user_id', user.id)
      .firstOrFail()

    // 2. Verificar se o item homebrew existe
    const item = await HomebrewItem.findOrFail(homebrewItemId)

    // 3. Inserir registro pivot
    await db.table('character_homebrew_items').insert({
      character_id: character.id,
      homebrew_item_id: item.id,
      quantity: 1,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    })

    return response.redirect().back()
  }
}