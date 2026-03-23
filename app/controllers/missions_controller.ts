import Mission from '#models/mission'
import Room from '#models/room'
import RoomClue from '#models/room_clue'
import RoomItem from '#models/room_item'
import RoomNpc from '#models/room_npc'
import type { HttpContext } from '@adonisjs/core/http'

export default class MissionsController {

  async index({ params, response }: HttpContext) {
    const missions = await Mission.query()
      .where('campaign_id', params.campaignId)
      .preload('rooms', (q) => q
        .preload('roomClues')
        .preload('roomItems')
        .preload('roomNpcs')
      )
    return response.ok({ missions })
  }

  async store({ params, request, response }: HttpContext) {
    const { name, description } = request.only(['name', 'description'])
    const mission = await Mission.create({
      campaignId: params.campaignId,
      name,
      description,
    })
    return response.created({ mission })
  }

  async show({ params, response }: HttpContext) {
    const mission = await Mission.query()
      .where('id', params.id)
      .where('campaign_id', params.campaignId)
      .preload('rooms', (q) => q
        .preload('roomClues')
        .preload('roomItems')
        .preload('roomNpcs')
      )
      .firstOrFail()
    return response.ok(mission)
  }

  async update({ params, request, response }: HttpContext) {
    const mission = await Mission.query()
      .where('id', params.id)
      .where('campaign_id', params.campaignId)
      .firstOrFail()
    const data = request.only(['name', 'description', 'status'])
    mission.merge(data)
    await mission.save()
    return response.ok(mission)
  }

  async destroy({ params, response }: HttpContext) {
    const mission = await Mission.query()
      .where('id', params.id)
      .where('campaign_id', params.campaignId)
      .firstOrFail()
    await mission.delete()
    return response.ok({ success: true })
  }

  // --- ROOMS ---

  async storeRoom({ params, request, response }: HttpContext) {
    const { name, description } = request.only(['name', 'description'])
    const room = await Room.create({ missionId: params.missionId, name, description })
    return response.created(room)
  }

  async updateRoom({ params, request, response }: HttpContext) {
    const room = await Room.findOrFail(params.roomId)
    room.merge(request.only(['name', 'description', 'state']))
    await room.save()
    return response.ok(room)
  }

  async destroyRoom({ params, response }: HttpContext) {
    const room = await Room.findOrFail(params.roomId)
    await room.delete()
    return response.ok({ success: true })
  }

  // --- CLUES ---

  async storeClue({ params, request, response }: HttpContext) {
    const { content } = request.only(['content'])
    const clue = await RoomClue.create({ roomId: params.roomId, content })
    return response.created(clue)
  }

  async updateClue({ params, request, response }: HttpContext) {
    const clue = await RoomClue.findOrFail(params.clueId)
    clue.merge(request.only(['content', 'revealed']))
    await clue.save()
    return response.ok(clue)
  }

  async destroyClue({ params, response }: HttpContext) {
    const clue = await RoomClue.findOrFail(params.clueId)
    await clue.delete()
    return response.ok({ success: true })
  }

  // --- ITEMS ---

  async storeItem({ params, request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'quantity', 'item_type', 'catalog_item_id', 'homebrew_item_id'])
    
    // Mapear snake_case do request para camelCase do modelo Lucid
    const item = await RoomItem.create({
      roomId: params.roomId,
      name: data.name,
      description: data.description,
      quantity: data.quantity,
      itemType: data.item_type,
      catalogItemId: data.catalog_item_id,
      homebrewItemId: data.homebrew_item_id,
    })
    
    return response.created(item)
  }

  async collectItem({ params, request, response }: HttpContext) {
    const { characterId } = request.only(['characterId'])
    
    if (!characterId) {
      return response.badRequest({ error: 'ID do personagem é obrigatório' })
    }

    // Busca segura do item garantindo que pertence à sala correta
    const item = await RoomItem.query()
      .where('id', params.itemId)
      .where('room_id', params.roomId)
      .firstOrFail()

    if (item.collected) {
      return response.badRequest({ error: 'Item já coletado' })
    }

    // Import dinâmico do modelo Character para evitar dependência circular se necessário
    // Mas movendo findOrFail para um local onde characterId é garantido
    const Character = (await import('#models/character')).default
    const character = await Character.findOrFail(characterId)

    // Iniciar transação para garantir que a coleta e adição ao inventário sejam atômicas
    const db = (await import('@adonisjs/lucid/services/db')).default
    const trx = await db.transaction()

    try {
      item.useTransaction(trx)
      character.useTransaction(trx)

      item.merge({
        collected: true,
        collectedByCharacterId: characterId,
      })
      await item.save()

      // Adiciona ao inventário dependendo do tipo
      if (item.catalogItemId) {
        if (item.itemType === 'weapon') {
          await character.related('weapons').attach([item.catalogItemId], trx)
        } else if (item.itemType === 'protection') {
          await character.related('protections').attach([item.catalogItemId], trx)
        } else if (item.itemType === 'ammunition') {
          const existing = await character
            .related('ammunitions')
            .pivotQuery()
            .useTransaction(trx)
            .where('ammunition_id', item.catalogItemId)
            .first()

          if (existing) {
            await character.related('ammunitions').sync(
              {
                [item.catalogItemId]: { quantity: existing.$extras.pivot_quantity + item.quantity },
              },
              false,
              trx
            )
          } else {
            await character
              .related('ammunitions')
              .attach({ [item.catalogItemId]: { quantity: item.quantity } }, trx)
          }
        } else if (item.itemType === 'general') {
          await character
            .related('generalItems')
            .attach({ [item.catalogItemId]: { quantity: item.quantity } }, trx)
        }
      } else if (item.homebrewItemId) {
        // Caso para itens homebrew (focado por enquanto em item_type === 'general' conforme plano)
        if (item.itemType === 'general') {
          const now = new Date()
          await trx.table('character_homebrew_items').insert({
            character_id: characterId,
            homebrew_item_id: item.homebrewItemId,
            quantity: item.quantity,
            notes: item.description,
            created_at: now,
            updated_at: now,
          })
        }
      }

      await trx.commit()
      return response.ok(item)
    } catch (error) {
      await trx.rollback()
      console.error('[COLLECT_ITEM] Erro:', error)
      return response.internalServerError({ error: 'Falha ao coletar item', details: error.message })
    }
  }

  async destroyItem({ params, response }: HttpContext) {
    const item = await RoomItem.findOrFail(params.itemId)
    await item.delete()
    return response.ok({ success: true })
  }

  // --- NPCS ---

  async storeNpc({ params, request, response }: HttpContext) {
    const npc = await RoomNpc.create({
      roomId: params.roomId,
      ...request.only(['name', 'notes', 'quantity', 'is_monster']),
    })
    return response.created(npc)
  }

  async updateNpc({ params, request, response }: HttpContext) {
    const npc = await RoomNpc.findOrFail(params.npcId)
    npc.merge(request.only(['name', 'notes', 'quantity', 'is_monster']))
    await npc.save()
    return response.ok(npc)
  }

  async destroyNpc({ params, response }: HttpContext) {
    const npc = await RoomNpc.findOrFail(params.npcId)
    await npc.delete()
    return response.ok({ success: true })
  }
}
