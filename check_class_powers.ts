import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'database.sqlite')

const db = new sqlite3.Database(dbPath)

function closeDB() {
  db.close()
}

function run() {
  console.log('🔍 VERIFICAÇÃO DETALHADA DE PODERES DE CLASSE\n')
  console.log('=' .repeat(60))

  // 1. Contar registros nas tabelas principais
  db.all("SELECT COUNT(*) as count FROM abilities", (err: any, results: any) => {
    console.log(`\n📊 Estatísticas do Banco:`)
    console.log(`   Abilities: ${results?.[0]?.count || 0}`)

    db.all("SELECT COUNT(*) as count FROM class_progressions", (err: any, results2: any) => {
      console.log(`   Class Progressions: ${results2?.[0]?.count || 0}`)

      // 2. Mostrar class_progressions agrupadas por tipo
      db.all(
        "SELECT type, COUNT(*) as count FROM class_progressions GROUP BY type ORDER BY type",
        (err: any, progressionTypes: any) => {
          console.log('\n📈 Tipos de Progressões de Classe:')
          if (progressionTypes && progressionTypes.length > 0) {
            console.table(progressionTypes)
          } else {
            console.log('   (nenhuma progressão encontrada)')
          }

          // 3. Mostrar todas as progressões de classe com detalhes
          db.all(
            `SELECT cp.id, cp.class_id, c.name as class_name, cp.nex, cp.title, cp.type, cp.description, cp.reference_id 
             FROM class_progressions cp 
             LEFT JOIN classes c ON cp.class_id = c.id 
             ORDER BY c.name, cp.nex`,
            (err: any, progressions: any) => {
              console.log('\n⚡ Todas as Progressões de Classe (Detalhado):\n')
              if (progressions && progressions.length > 0) {
                for (const p of progressions) {
                  console.log(`📌 ${p.class_name} (NEX ${p.nex}):`)
                  console.log(`   Título: ${p.title}`)
                  console.log(`   Tipo: ${p.type}`)
                  console.log(`   Descrição: ${p.description || '(sem descrição)'}`)
                  console.log(`   Ref ID: ${p.reference_id || '(sem referência)'}`)
                  console.log('')
                }
              } else {
                console.log('(nenhuma progressão encontrada)')
              }

              // 4. Procurar se há abilities em outras tabelas
              db.all(
                `SELECT type, COUNT(*) as count FROM abilities GROUP BY type`,
                (err: any, abilityTypes: any) => {
                  console.log('\n🎯 Types de Abilities Cadastrados:')
                  if (abilityTypes && abilityTypes.length > 0) {
                    console.table(abilityTypes)

                    // 5. Se houver abilities, mostrar
                    db.all(
                      `SELECT id, name, type, description FROM abilities ORDER BY type, name`,
                      (err: any, abilities: any) => {
                        console.log('\n📋 Todas as Abilities:')
                        if (abilities && abilities.length > 0) {
                          console.table(abilities)
                        }
                        closeDB()
                      }
                    )
                  } else {
                    console.log('❌ Nenhuma ability cadastrada no banco!\n')
                    closeDB()
                  }
                }
              )
            }
          )
        }
      )
    })
  })
}

run()
