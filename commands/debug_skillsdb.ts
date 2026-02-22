import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'

export default class DebugSkillsDb extends BaseCommand {
  static commandName = 'debug:skillsdb'
  static description = 'Debug skills and origins in database'

  async run() {
    try {
      console.log('\n=== SKILLS DATABASE DEBUG ===\n')

      // Check skills
      console.log('1. SKILLS TABLE:')
      const skills = await db.from('skills').select('*')
      console.log(`   Total skills: ${skills.length}`)
      if (skills.length > 0) {
        skills.slice(0, 5).forEach((s: any) => console.log(`   - ${s.name}`))
      }

      // Check origins
      console.log('\n2. ORIGINS WITH TRAINED_SKILLS:')
      const origins = await db.from('origins').select('*').limit(3)
      console.log(`   Total origins checked: ${origins.length}\n`)
      
      origins.forEach((origin: any) => {
        console.log(`   Origin: ${origin.name}`)
        console.log(`   trained_skills column: ${origin.trained_skills}`)
        if (origin.trained_skills) {
          try {
            const parsed = JSON.parse(origin.trained_skills)
            console.log(`   Parsed as: ${JSON.stringify(parsed)}`)
            console.log(`   Is Array: ${Array.isArray(parsed)}`)
          } catch (e: any) {
            console.log(`   (Not JSON: ${e.message})`)
          }
        }
        console.log()
      })

      // Check character_skills
      console.log('3. CHARACTER_SKILLS TABLE:')
      const charSkills = await db.from('character_skills').select('*')
      console.log(`   Total records: ${charSkills.length}`)
      if (charSkills.length > 0) {
        console.log('   Sample records:')
        charSkills.slice(0, 3).forEach((cs: any) => {
          console.log(`   - CharID: ${cs.character_id}, SkillID: ${cs.skill_id}, Degree: ${cs.training_degree}`)
        })
      }

      console.log('\n4. CHARACTERS TABLE:')
      const chars = await db.from('characters').select('id', 'name', 'origin_id').limit(3)
      console.log(`   Total characters: ${chars.length}`)
      chars.forEach((c: any) => {
        console.log(`   - ID: ${c.id}, Name: ${c.name}, OriginID: ${c.origin_id}`)
      })

    } catch (error: any) {
      console.log(`ERROR: ${error.message}`)
      console.log(error)
    }
  }
}
