
import db from '@adonisjs/lucid/services/db'
import Campaign from '#models/campaign'

async function run() {
  const campaigns = await db.from('campaigns').select('id', 'name', 'dddice_room_slug')
  console.log('Campaigns in DB:', JSON.stringify(campaigns, null, 2))
  process.exit(0)
}

run()
