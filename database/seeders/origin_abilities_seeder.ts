import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Origin from '#models/origin'
import OriginAbility from '#models/origin_ability'

export default class extends BaseSeeder {
  async run() {
    // Fetch all origins that have ability data
    const origins = await Origin.query().whereNotNull('abilityName')

    for (const origin of origins) {
      if (origin.abilityName) {
        await OriginAbility.updateOrCreate(
          { originId: origin.id, name: origin.abilityName },
          {
            originId: origin.id,
            name: origin.abilityName,
            description: origin.abilityDescription || null,
          }
        )
      }
    }

    console.log(`Seeded ${origins.length} origin abilities from origins table.`)
  }
}
