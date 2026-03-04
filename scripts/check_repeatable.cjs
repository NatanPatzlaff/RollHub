const db = require('better-sqlite3')('./database.sqlite')
const rows = db
  .prepare(`SELECT id, name, effects FROM class_abilities WHERE name = 'Transcender' LIMIT 3`)
  .all()
rows.forEach((r) => console.log(`[${r.id}] ${r.name}: effects = ${r.effects}`))
