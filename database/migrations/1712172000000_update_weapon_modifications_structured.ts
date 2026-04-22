import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    const db = this.db

    // 1. Dum-Dum (+1 Crítico)
    await db.from('weapon_modifications').where('name', 'Dum-Dum').update({
      special_properties: JSON.stringify({ criticalMultiplierBonus: 1 })
    })

    // 2. Mira Laser (+2 Margem)
    await db.from('weapon_modifications').where('name', 'Mira Laser').update({
      special_properties: JSON.stringify({ threatMarginBonus: 2 })
    })

    // 3. Lancinante (+1d8 Sangue)
    await db.from('weapon_modifications').where('name', 'Lancinante').update({
      special_properties: JSON.stringify({ extraDamage: '1d8', extraDamageType: 'blood' })
    })

    // 4. Erosiva (+1d8 Morte)
    await db.from('weapon_modifications').where('name', 'Erosiva').update({
      special_properties: JSON.stringify({ extraDamage: '1d8', extraDamageType: 'death' })
    })

    // 5. Vibrante (Ataque Extra)
    await db.from('weapon_modifications').where('name', 'Vibrante').update({
      special_properties: JSON.stringify({ grantsBonusAttack: true })
    })

    // 6. Energética (Conversão e Ignorar RD)
    await db.from('weapon_modifications').where('name', 'Energética').update({
      special_properties: JSON.stringify({ convertsDamageType: 'energy', ignoresRD: true })
    })
  }

  async down() {
    const items = ['Dum-Dum', 'Mira Laser', 'Lancinante', 'Erosiva', 'Vibrante', 'Energética']
    await this.db.from('weapon_modifications')
      .whereIn('name', items)
      .update({ special_properties: null })
  }
}
