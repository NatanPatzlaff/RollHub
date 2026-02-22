import db from '@adonisjs/lucid/services/db'

async function run() {
    try {
        const tables = await db.rawQuery('SHOW TABLES')
        console.log('Tables:', tables[0].map((t: any) => Object.values(t)[0]))

        try {
            const items = await db.rawQuery('DESCRIBE items')
            console.log('Items table:', items[0])
        } catch (e) {
            console.log('Items table check failed:', e.message)
        }

        try {
            const characters = await db.rawQuery('DESCRIBE characters')
            console.log('Characters table:', characters[0])
        } catch (e) {
            console.log('Characters table check failed:', e.message)
        }

    } catch (error) {
        console.error(error)
    }
}

run()
