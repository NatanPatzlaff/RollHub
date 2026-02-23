import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSchema {
  async up() {
    // Alcance não especificado -> "Corpo a corpo" (SQL direto para evitar travamento)
    await db.rawQuery(
      "UPDATE weapons SET range = ? WHERE range IS NULL OR trim( coalesce(range, '') ) = ''",
      ['Corpo a corpo']
    )
    // Margem de crítico não especificada -> "20"
    await db.rawQuery(
      "UPDATE weapons SET critical = ? WHERE critical IS NULL OR trim( coalesce(critical, '') ) = ''",
      ['20']
    )
  }

  async down() {
    await db.rawQuery("UPDATE weapons SET range = NULL WHERE range = ?", ['Corpo a corpo'])
    await db.rawQuery("UPDATE weapons SET critical = NULL WHERE critical = ?", ['20'])
  }
}
