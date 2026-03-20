import type { HttpContext } from '@adonisjs/core/http'
import Weapon from '#models/weapon'
import Protection from '#models/protection'
import Ammunition from '#models/ammunition'
import GeneralItem from '#models/general_item'

export default class CatalogsController {
  async index({ response }: HttpContext) {
    const [weapons, protections, ammunitions, generalItems] = await Promise.all([
      Weapon.query().select('id', 'name', 'category'),
      Protection.query().select('id', 'name', 'category'),
      Ammunition.query().select('id', 'name', 'category'),
      GeneralItem.query().select('id', 'name', 'category'),
    ])

    return response.ok({
      weapons,
      protections,
      ammunitions,
      generalItems,
    })
  }
}
