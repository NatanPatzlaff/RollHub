
import db from '@adonisjs/lucid/services/db'

async function run() {
  console.log('--- homebrew_items ---')
  const items = await db.from('homebrew_items').orderBy('created_at', 'desc').limit(5)
  console.log(JSON.stringify(items, null, 2))

  console.log('\n--- character_homebrew_items ---')
  const links = await db.from('character_homebrew_items').orderBy('created_at', 'desc').limit(5)
  console.log(JSON.stringify(links, null, 2))
}

run().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1) })
