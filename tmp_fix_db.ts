import db from '@adonisjs/lucid/services/db'

async function run() {
  try {
    await db.rawQuery('ALTER TABLE room_items ADD COLUMN item_type TEXT')
    console.log('item_type added')
  } catch (e) { console.log(e.message) }
  
  try {
    await db.rawQuery('ALTER TABLE room_items ADD COLUMN catalog_item_id INTEGER')
    console.log('catalog_item_id added')
  } catch (e) { console.log(e.message) }
  
  try {
    await db.rawQuery('ALTER TABLE room_items ADD COLUMN collected BOOLEAN DEFAULT 0')
    console.log('collected added')
  } catch (e) { console.log(e.message) }
  
  try {
    await db.rawQuery('ALTER TABLE room_items ADD COLUMN collected_by_character_id INTEGER')
    console.log('collected_by_character_id added')
  } catch (e) { console.log(e.message) }
  
  process.exit(0)
}

run()
