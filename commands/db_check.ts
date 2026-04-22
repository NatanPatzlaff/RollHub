import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class DbCheck extends BaseCommand {
  static commandName = 'db:check'
  static description = 'Verifica itens homebrew no banco de dados'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('--- homebrew_items ---')
    const items = await db.from('homebrew_items').orderBy('created_at', 'desc').limit(5)
    console.log(items)

    this.logger.info('--- character_homebrew_items ---')
    const links = await db.from('character_homebrew_items').orderBy('created_at', 'desc').limit(5)
    console.log(links)
  }
}