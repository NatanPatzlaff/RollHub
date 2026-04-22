import type { HttpContext } from '@adonisjs/core/http'
import Monster from '#models/monster'
import { monsterValidator } from '#validators/monster'

export default class MonstersController {
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(monsterValidator)
    
    await Monster.create({
      ...data,
      attacks: data.attacks || [],
      abilities: data.abilities || [],
      alternativeMovements: data.alternativeMovements || [],
      additionalSkills: data.additionalSkills || [],
      resistances: (data.resistances as any) || { flatRD: 0, byType: {} },
      hpCurrent: data.hpCurrent ?? data.hpMax,
    })

    return response.redirect().back()
  }

  async update({ params, request, response }: HttpContext) {
    const monster = await Monster.findOrFail(params.id)
    const data = await request.validateUsing(monsterValidator)
    
    monster.merge({
      ...data,
      attacks: data.attacks || monster.attacks,
      abilities: data.abilities || monster.abilities,
      alternativeMovements: data.alternativeMovements || monster.alternativeMovements,
      additionalSkills: data.additionalSkills || monster.additionalSkills,
      resistances: (data.resistances as any) || monster.resistances,
      hpCurrent: data.hpCurrent ?? monster.hpCurrent
    })
    await monster.save()

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const monster = await Monster.findOrFail(params.id)
    await monster.delete()

    return response.redirect().back()
  }
}
