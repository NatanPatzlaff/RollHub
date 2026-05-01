import fs from 'fs'
import path from 'path'

function parseMarkdown(content: string) {
  const lines = content.split('\n')
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
        
        // CORRIGIDO: Remover possível \r do final da linha
        const matchVon = line.match(/\*\*Vontade:\*\*\s*(.*?)(,|\r|$)/)
        if (matchVon) mdMonsters.get(currentMonster).vontade = matchVon[1].trim()
      } else if (line.includes('**Sentidos:**')) {
        const matchPerc = line.match(/Percepção\s*([^,\|]+)/)
        if (matchPerc) mdMonsters.get(currentMonster).percepcao = matchPerc[1].trim()
        
        const matchIni = line.match(/Iniciativa\s*([^,\|]+)/)
        if (matchIni) mdMonsters.get(currentMonster).iniciativa = matchIni[1].trim()
      }
    }
  }
  return mdMonsters
}

function parseSeeder(content: string) {
  const monsters = new Map<string, any>()
  const monsterBlocks = content.split(/name:\s*['"`]/).slice(1)
  for (const block of monsterBlocks) {
    if (!block.includes('vd:')) continue;
    
    const nameMatch = block.match(/^([^'"`]+)['"`]/)
    if (!nameMatch) continue;
    const name = nameMatch[1]
    
    const matchPerc = block.match(/perceptionBonus:\s*(\d+)/)
    const matchIni = block.match(/initiativeBonus:\s*(\d+)/)
    const matchFort = block.match(/fortitudeBonus:\s*(\d+)/)
    const matchRef = block.match(/reflexBonus:\s*(\d+)/)
    const matchVon = block.match(/willBonus:\s*(\d+)/)
    
    monsters.set(name, {
      percepcao: matchPerc ? parseInt(matchPerc[1]) : 0,
      iniciativa: matchIni ? parseInt(matchIni[1]) : 0,
      fortitude: matchFort ? parseInt(matchFort[1]) : 0,
      reflexos: matchRef ? parseInt(matchRef[1]) : 0,
      vontade: matchVon ? parseInt(matchVon[1]) : 0
    })
  }
  return monsters
}

const mdContent = fs.readFileSync('ordem dividido/Criaturas.md', 'utf-8')
const mdMonsters = parseMarkdown(mdContent)

const seedersDir = 'database/seeders/monsters'
const files = fs.readdirSync(seedersDir)

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

let errors = 0
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  const content = fs.readFileSync(path.join(seedersDir, file), 'utf-8')
  const seederMonsters = parseSeeder(content)
  
  for (const [name, seederData] of seederMonsters.entries()) {
    const md = mdMonsters.get(name)
    if (!md) {
      console.log(`❌ Not found in MD: ${name}`)
      continue
    }
    
    const fort = parseDiceAndBonus(md.fortitude).bonus
    const ref = parseDiceAndBonus(md.reflexos).bonus
    const von = parseDiceAndBonus(md.vontade).bonus
    const perc = parseDiceAndBonus(md.percepcao).bonus
    const ini = parseDiceAndBonus(md.iniciativa).bonus
    
    const compare = (field: string, mdVal: number, seederVal: number) => {
      if (mdVal !== seederVal) {
        console.log(`⚠️ [${name}] ${field} mismatch! MD: ${mdVal}, Seeder: ${seederVal}`)
        errors++
      }
    }
    
    compare('Fortitude Bonus', fort, seederData.fortitude)
    compare('Reflexos Bonus', ref, seederData.reflexos)
    compare('Vontade Bonus', von, seederData.vontade)
    compare('Percepcao Bonus', perc, seederData.percepcao)
    compare('Iniciativa Bonus', ini, seederData.iniciativa)
  }
}

if (errors === 0) {
  console.log('✅ All checked skills match between Markdown and Seeders!')
} else {
  console.log(`Found ${errors} mismatches.`)
}
