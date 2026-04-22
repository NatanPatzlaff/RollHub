import { Ignitor } from '@adonisjs/core/env'
import app from '@adonisjs/core/services/app'

async function run() {
  const ignitor = new Ignitor(new URL('./', import.meta.url), { importer: (IMPORTER) => import(IMPORTER) })
  await ignitor.boot()
  
  const Monster = (await import('#models/monster')).default
  const dbMonsters = await Monster.query().whereNull('campaignId')
  
  let seederCode = `import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Monster from '#models/monster'

export default class extends BaseSeeder {
  async run() {
    const defaultMonsters = ${JSON.stringify(dbMonsters.map(m => m.toJSON()), null, 4)}

    for (const monster of defaultMonsters) {
      const existing = await Monster.query().where('name', monster.name).first()
      if (!existing) {
        // Garantindo persistência segura
        delete monster.id
        delete monster.createdAt
        delete monster.updatedAt
        await Monster.create(monster)
      }
    }
    console.log('Seeder executado. Monstros carregados!')
  }
}
`
  const fs = require('fs')
  fs.writeFileSync('database/seeders/monster_seeder.ts', seederCode)
  console.log('Seeder reescrito com sucesso!')
  process.exit(0)
}
run()
