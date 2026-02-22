
import db from '@adonisjs/lucid/services/db'

async function run() {
    try {
        console.log('Dropping campaign_members...')
        await db.rawQuery('DROP TABLE IF EXISTS campaign_members')

        console.log('Dropping characters...')
        await db.rawQuery('DROP TABLE IF EXISTS characters')

        console.log('Tables dropped successfully.')
    } catch (error) {
        console.error(`Drop failed: ${error.message}`)
    }
}

run()
