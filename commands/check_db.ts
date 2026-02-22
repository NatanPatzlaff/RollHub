
import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class CheckDb extends BaseCommand {
  static commandName = 'check:db'
  static description = 'Check database connectivity'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    try {
      this.logger.info('Connecting to database...')

      const dbName = await db.rawQuery('SELECT DATABASE() as db, @@port as port, @@version as version, @@hostname as host, @@datadir as datadir, @@socket as socket')
      this.logger.info(`Server Details: ${JSON.stringify(dbName[0][0])}`)

      const allDbs = await db.rawQuery('SHOW DATABASES')
      this.logger.info(`Databases: ${JSON.stringify(allDbs[0].map((d: any) => d.Database))}`)

      const tables = await db.rawQuery('SHOW TABLES')
      this.logger.info(`Found ${tables[0].length} tables in database.`)

      const classes = await db.from('classes').select('*')
      this.logger.info(`Classes: ${JSON.stringify(classes)}`)

      const abilitiesCount = await db.from('abilities').count('* as total')
      this.logger.info(`Abilities Count: ${abilitiesCount[0].total}`)

      const trails = await db.from('trails').select('name')
      this.logger.info(`Trails: ${JSON.stringify(trails)}`)
      this.logger.info('Tables list:')
      console.log(tables[0].map((t: any) => Object.values(t)[0]))

    } catch (error: any) {
      this.logger.error(`Database check failed: ${error.message}`)
    }
  }
}