
import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class CreateProbe extends BaseCommand {
    static commandName = 'db:probe'
    static description = 'Creates a visible probe table for debugging'

    static options = {
        startApp: true
    }

    async run() {
        this.logger.info('Creating probe table...')
        try {
            // Direct execution without explicit transaction block for DDL
            await db.rawQuery('DROP TABLE IF EXISTS _debug_probe_verify')
            await db.rawQuery('CREATE TABLE _debug_probe_verify (id INT PRIMARY KEY, message VARCHAR(255))')
            await db.rawQuery("INSERT INTO _debug_probe_verify (id, message) VALUES (1, 'If you see this, we are connected!')")

            this.logger.info('Probe table "_debug_probe_verify" created successfully.')

            const check = await db.rawQuery('SELECT * FROM _debug_probe_verify')
            const rows = check[0]
            this.logger.info(`Verification from App: ${JSON.stringify(rows)}`)

        } catch (error: any) {
            this.logger.error(`Failed to create probe: ${error.message}`)
        }
    }
}
