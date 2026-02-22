import mysql from 'mysql2/promise'

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escudo do mestre'
  })

  const [rows] = await conn.query('SELECT id, name, base_hp, hp_per_level, hp_attribute, base_pe, pe_per_level, pe_attribute, base_sanity, sanity_per_level FROM classes ORDER BY id') as any

  console.log('=== ESTATÍSTICAS DAS 3 CLASSES ===')
  
  for (const r of rows) {
    console.log('')
    console.log(`${r.name} (ID: ${r.id}):`)
    console.log(`  PV: ${r.base_hp} + ${r.hp_attribute?.toUpperCase()} | +${r.hp_per_level} PV (+${r.hp_attribute?.substring(0,3).toUpperCase()}) por NEX`)
    console.log(`  PE: ${r.base_pe} + ${r.pe_attribute?.toUpperCase()} | +${r.pe_per_level} PE (+${r.pe_attribute?.substring(0,3).toUpperCase()}) por NEX`)
    console.log(`  SAN: ${r.base_sanity} | +${r.sanity_per_level} SAN por NEX`)
  }

  await conn.end()
}

main().catch(console.error)
