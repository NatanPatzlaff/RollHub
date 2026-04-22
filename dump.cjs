const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

const db = new sqlite3.Database('./tmp/db.sqlite3') // Caminho correto do lucid v6

db.all('SELECT * FROM monsters WHERE campaign_id IS NULL', [], (err, rows) => {
  if (err) {
    throw err
  }
  
  const parsedRows = rows.map(row => {
    // deserialize json fields if necessary to hardcode them safely
    const m = { ...row }
    try { if (typeof m.attacks === 'string') m.attacks = JSON.parse(m.attacks) } catch(e){}
    try { if (typeof m.abilities === 'string') m.abilities = JSON.parse(m.abilities) } catch(e){}
    try { if (typeof m.resistances === 'string') m.resistances = JSON.parse(m.resistances) } catch(e){}
    try { if (typeof m.alternative_movements === 'string') m.alternative_movements = JSON.parse(m.alternative_movements) } catch(e){}
    try { if (typeof m.additional_immunities === 'string') m.additional_immunities = JSON.parse(m.additional_immunities) } catch(e){}
    try { if (typeof m.additional_skills === 'string') m.additional_skills = JSON.parse(m.additional_skills) } catch(e){}
    
    // keys from snake_case to camelCase since model create uses camelCase
    return {
        name: m.name,
        type: m.type,
        vd: m.vd,
        defense: m.defense,
        hpMax: m.hp_max,
        hpCurrent: m.hp_current,
        size: m.size,
        element: m.element,
        secondaryElements: m.secondary_elements,
        movement: m.movement,
        alternativeMovements: m.alternative_movements,
        nexImmune: m.nex_immune,
        immunities: m.immunities,
        additionalImmunities: m.additional_immunities,
        vulnerabilities: m.vulnerabilities,
        perceptionDice: m.perception_dice,
        perceptionBonus: m.perception_bonus,
        initiativeDice: m.initiative_dice,
        initiativeBonus: m.initiative_bonus,
        fortitudeDice: m.fortitude_dice,
        fortitudeBonus: m.fortitude_bonus,
        reflexDice: m.reflex_dice,
        reflexBonus: m.reflex_bonus,
        willDice: m.will_dice,
        willBonus: m.will_bonus,
        resistances: m.resistances,
        fearEnigma: m.fear_enigma,
        description: m.description,
        agi: m.agi,
        str: m.str,
        int: m.int,
        pre: m.pre,
        vig: m.vig,
        abilities: m.abilities,
        attacks: m.attacks,
        additionalSkills: m.additional_skills
    }
  })

  const seederCode = `import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Monster from '#models/monster'

export default class extends BaseSeeder {
  async run() {
    const defaultMonsters = ${JSON.stringify(parsedRows, null, 4)}

    for (const monster of defaultMonsters) {
      const existing = await Monster.query().where('name', monster.name).first()
      if (!existing) {
        await Monster.create(monster)
      }
    }
    console.log('Seeder executado. Monstros manuais carregados!')
  }
}
`
  
  fs.writeFileSync('database/seeders/monster_seeder.ts', seederCode)
  console.log('Done.')
})
