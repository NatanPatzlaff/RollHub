import type { HttpContext } from '@adonisjs/core/http'
import CharacterStat from '#models/character_stat'
import { updateCharacterStatsValidator } from '#validators/character_stat'

export default class CharacterStatsController {
  async update({ params, request, response }: HttpContext) {
    const { currentHp, currentPe, currentSanity, permanentSanityLoss, maxHp, maxPe, maxSanity } = await request.validateUsing(updateCharacterStatsValidator)

    // Buscar stats do personagem
    const stat = await CharacterStat.query().where('characterId', params.id).firstOrFail()

    // Atualizar valores
    if (currentHp !== undefined) stat.currentHp = currentHp ?? stat.currentHp
    if (currentPe !== undefined) stat.currentPe = currentPe ?? stat.currentPe
    if (currentSanity !== undefined) stat.currentSanity = currentSanity ?? stat.currentSanity
    if (permanentSanityLoss !== undefined) stat.permanentSanityLoss = permanentSanityLoss ?? stat.permanentSanityLoss
    if (maxHp !== undefined) stat.maxHp = maxHp ?? stat.maxHp
    if (maxPe !== undefined) stat.maxPe = maxPe ?? stat.maxPe
    if (maxSanity !== undefined) stat.maxSanity = maxSanity ?? stat.maxSanity
    await stat.save()

    return response.ok({ success: true, stat })
  }
}
