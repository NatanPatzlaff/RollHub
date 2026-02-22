import db from '@adonisjs/lucid/services/db'

async function run() {
    const classes = await db.from('classes').select('*')
    console.log('Classes:', classes)
    const origins = await db.from('origins').select('*')
    console.log('Origins:', origins)
}

run().then(() => process.exit(0)).catch(console.error)
