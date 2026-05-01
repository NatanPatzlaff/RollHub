import { BaseCommand } from '@adonisjs/core/ace'
import Combat from '#models/combat'

export default class PrintCombat extends BaseCommand {
  static commandName = 'print:combat'
  static description = ''
  static options = { startApp: true }

  async run() {
    const combats = await Combat.query()
      .where('active', true)
      .preload('participants', (query) => {
        query.preload('character', (q) => q.preload('stats').preload('class'))
        query.preload('monster')
        query.preload('roomMonster')
      })

    let found = null
    for (const combat of combats) {
      for (const p of combat.participants) {
        if (p.monster || p.roomMonster) {
          found = p
          break
        }
      }
      if (found) break
    }

    console.log('MONSTER DEBUG:', JSON.stringify(found?.serialize(), null, 2))
  }
}
