import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class DbTest extends BaseCommand {
  static commandName = 'db:test'
  static description = 'Check campaigns in database'

  static options: CommandOptions = {}

  async run() {
    try {
      const db = (await import('@adonisjs/lucid/services/db')).default
      
      // List all tables
      const tables = await db.rawQuery("SELECT name FROM sqlite_master WHERE type='table';")
      this.logger.info('Tables: ' + JSON.stringify(tables, null, 2))
      
      // Try to get campaigns
      try {
        const campaigns = await db.from('campaigns').select('id', 'name', 'dddice_room_slug')
        this.logger.info('Campaigns: ' + JSON.stringify(campaigns, null, 2))
      } catch (e) {
        this.logger.error('Error fetching campaigns: ' + e.message)
      }

      // Try to get characters
      try {
        const characters = await db.from('characters').select('id', 'name').limit(5)
        this.logger.info('Characters: ' + JSON.stringify(characters, null, 2))
      } catch (e) {
        this.logger.error('Error fetching characters: ' + e.message)
      }
    } catch (err) {
      this.logger.error('Global error: ' + err.message)
    }
  }
}