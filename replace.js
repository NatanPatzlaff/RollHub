import fs from 'fs'

const file = 'c:/Users/natan/Desktop/RollHub/database/seeders/monster_seeder.ts'
let content = fs.readFileSync(file, 'utf8')

const oldStr = `    for (const monster of defaultMonsters) {
      const existing = await Monster.query().where('name', monster.name).first()
      if (!existing) {
        await Monster.create(monster)
      }
    }
    console.log('Seeder executado. Monstros manuais carregados!')
  }`

const newStr = `    for (const monster of defaultMonsters) {
      const existing = await Monster.query().where('name', monster.name).first()
      if (!existing) {
        await Monster.create(monster)
      } else {
        await existing.merge(monster).save()
      }
    }
    console.log('Seeder executado. Monstros manuais carregados e atualizados!')
  }`

content = content.replace(oldStr, newStr)
fs.writeFileSync(file, content)
console.log('Done.')
