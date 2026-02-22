import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'

async function main() {
  await app.boot()
  
  const rows = await db.rawQuery(
    "SELECT class_id, nex, title, description FROM class_progressions WHERE title LIKE '%Aumento de Atributo%' ORDER BY class_id, nex"
  )

  console.log('NEX que dão Aumento de Atributo:')
  console.table(rows[0])

  // Resumo por classe
  const classes = ['', 'Combatente', 'Ocultista', 'Especialista']
  for (let classId = 1; classId <= 3; classId++) {
    const classRows = rows[0].filter((r: any) => r.class_id === classId)
    console.log(`\n${classes[classId]}: NEX ${classRows.map((r: any) => r.nex + '%').join(', ')}`)
  }
}

main().catch(console.error)
