import type { HttpContext } from '@adonisjs/core/http'
import CharacterStat from '#models/character_stat'

export default class CharacterStatsController {
  async update({ params, request, response }: HttpContext) {
    const { currentHp, currentPe, currentSanity, permanentSanityLoss } = request.only([
      'currentHp',
      'currentPe',
      'currentSanity',
      'permanentSanityLoss',
    ])

    // Buscar stats do personagem
    const stat = await CharacterStat.query().where('characterId', params.id).firstOrFail()

    // Atualizar valores
    if (currentHp !== undefined) stat.currentHp = currentHp
    if (currentPe !== undefined) stat.currentPe = currentPe
    if (currentSanity !== undefined) stat.currentSanity = currentSanity
    if (permanentSanityLoss !== undefined) stat.permanentSanityLoss = permanentSanityLoss
    await stat.save()

    return response.ok({ success: true, stat })
  }
}
