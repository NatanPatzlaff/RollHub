import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class CleanOrphanedRituals extends BaseCommand {
  static commandName = 'clean:rituals'
  static description = 'Remove character_rituals records that point to non-existent rituals'

  static options = {
    startApp: true
  }

  async run() {
    this.logger.info('Cleaning orphaned character_rituals...')

    const deletedCount = await db
      .from('character_rituals')
      .whereNotIn('ritual_id', db.from('rituals').select('id'))
      .delete()

    this.logger.success(`Removed ${deletedCount} orphaned ritual records.`)
  }
}