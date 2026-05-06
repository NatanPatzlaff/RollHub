import db from '@adonisjs/lucid/services/db'

async function check() {
  const info = await db.rawQuery('PRAGMA table_info(character_active_buffs);')
  console.log(JSON.stringify(info, null, 2))
  process.exit(0)
}

check()
