import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

async function run() {
  const monster = await db.from('monsters').where('name', 'Aberração de Carne').first()
  console.log(monster)
  process.exit(0)
}

run()
