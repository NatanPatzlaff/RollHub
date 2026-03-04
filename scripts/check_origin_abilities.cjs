const s = require('better-sqlite3')
const db = s('./database.sqlite')
const r = db
  .prepare(
    'SELECT id, name, type, pe_cost, cast_time, range, duration, target FROM origin_abilities ORDER BY id'
  )
  .all()
console.table(r)
db.close()
