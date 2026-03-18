import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await db.from('ammunitions').delete()
    const now = DateTime.now().toSQL()

    await db.table('ammunitions').multiInsert([
      {
        name: 'Balas Curtas',
        category: 0,
        spaces: 1,
        description: 'Compatível com pistolas, revólveres e submetralhadoras.',
        duration: '2 Cenas',
        weapon_type_restriction: JSON.stringify(['Pistola', 'Revólver', 'Submetralhadora']),
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Balas Longas',
        category: 1,
        spaces: 1,
        description: 'Compatível com fuzis e metralhadoras.',
        duration: '1 Cena',
        weapon_type_restriction: JSON.stringify(['Fuzil', 'Metralhadora']),
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Cartuchos',
        category: 1,
        spaces: 1,
        description: 'Compatível com espingardas.',
        duration: '1 Cena',
        weapon_type_restriction: JSON.stringify(['Espingarda']),
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Combustível',
        category: 1,
        spaces: 1,
        description: 'Compatível com lança-chamas.',
        duration: '1 Cena',
        weapon_type_restriction: JSON.stringify(['Lança-chamas']),
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Flechas',
        category: 0,
        spaces: 1,
        description: 'Compatível com arcos e bestas. Podem ser reaproveitadas após cada combate.',
        duration: '1 Missão',
        weapon_type_restriction: JSON.stringify(['Arco', 'Besta']),
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Foguetes',
        category: 1,
        spaces: 1,
        description: 'Compatível com bazucas. Cada item rende apenas um disparo.',
        duration: '1 Disparo',
        weapon_type_restriction: JSON.stringify(['Bazuca']),
        created_at: now,
        updated_at: now,
      },
    ])
  }
}
