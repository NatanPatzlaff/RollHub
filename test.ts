import fs from 'fs'
import path from 'path'

const mdContent = fs.readFileSync('ordem dividido/Criaturas.md', 'utf-8')
const lines = mdContent.split('\n')
let currentMonster = null
const mdMonsters = new Map<string, any>()

for (let line of lines) {
  if (line.startsWith('### ')) {
    currentMonster = line.replace('### ', '').trim()
    mdMonsters.set(currentMonster, {
      fortitude: '', reflexos: '', vontade: '',
      percepcao: '', iniciativa: ''
    })
  } else if (currentMonster) {
    if (line.includes('**Fortitude:**')) {
      const matchFort = line.match(/\*\*Fortitude:\*\*\s*(.*?)(,|$)/)
      if (matchFort) mdMonsters.get(currentMonster).fortitude = matchFort[1].trim()
      
      const matchRef = line.match(/\*\*Reflexos:\*\*\s*(.*?)(,|$)/)
      if (matchRef) mdMonsters.get(currentMonster).reflexos = matchRef[1].trim()
      
      const matchVon = line.match(/\*\*Vontade:\*\*\s*(.*?)(,|\r|$)/)
      if (matchVon) mdMonsters.get(currentMonster).vontade = matchVon[1].trim()
    }
  }
}

const parseDiceAndBonus = (str: string) => {
  if (!str || str === '—') return { dice: 0, bonus: 0 }
  str = str.replace(/\s/g, '').toLowerCase()
  const match = str.match(/(?:(\d+)d)?20(?:\+(\d+))?/)
  if (!match) return { dice: 1, bonus: 0 }
  return { 
    dice: match[1] ? parseInt(match[1]) : 1, 
    bonus: match[2] ? parseInt(match[2]) : 0 
  }
}

const seedersDir = 'database/seeders/monsters'
const content = fs.readFileSync(path.join(seedersDir, 'death_monster_seeder.ts'), 'utf-8')

const regex = /name:\s*['"`]([^'"`]+)['"`][\s\S]*?willBonus:\s*(\d+)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const name = match[1]
  const seederVon = parseInt(match[2])
  const md = mdMonsters.get(name)
  if (md) {
    const von = parseDiceAndBonus(md.vontade).bonus
    if (von !== seederVon) {
      console.log(`[${name}] MD String: '${md.vontade}' -> Parsed: ${von} | Seeder: ${seederVon}`)
    }
  }
}
