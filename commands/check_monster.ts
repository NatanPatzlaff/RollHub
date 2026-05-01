import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class CheckMonster extends BaseCommand {
  static commandName = 'check:monster'
  static description = ''
  static options = { startApp: true }

  async run() {
    const dbMonster = await db.from('monsters').where('name', 'Aberração de Carne').first()
    console.log(dbMonster)
  }
}