import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Alcance não especificado -> "Corpo a corpo"
    await this.db
      .from('weapons')
      .whereNull('range')
      .orWhere('range', '')
      .update({ range: 'Corpo a corpo' })

    // Margem de crítico não especificada -> "20"
    await this.db
      .from('weapons')
      .whereNull('critical')
      .orWhere('critical', '')
      .update({ critical: '20' })
  }

  async down() {
    await this.db.from('weapons').where('range', 'Corpo a corpo').update({ range: null })
    await this.db.from('weapons').where('critical', '20').update({ critical: null })
  }
}
