import { BaseCommand } from '@adonisjs/core/ace'
import Origin from '#models/origin'
import Skill from '#models/skill'

export default class ShowOriginSkills extends BaseCommand {
  static commandName = 'show:originsks'
  static description = 'Show origins and their skills'

  async run() {
    console.log('\n=== ORIGINS AND SKILLS ===\n')

    // Get all origins
    const origins = await Origin.all()
    console.log(`Total origins: ${origins.length}\n`)

    origins.slice(0, 5).forEach((origin) => {
      console.log(`Origin: ${origin.name}`)
      console.log(`  trainedSkills field: ${JSON.stringify(origin.trainedSkills)}`)
      console.log(`  Type: ${typeof origin.trainedSkills}`)
      console.log(`  Is Array: ${Array.isArray(origin.trainedSkills)}`)
      if (Array.isArray(origin.trainedSkills)) {
        console.log(`  Skills (${origin.trainedSkills.length}): ${origin.trainedSkills.join(', ')}`)
      }
      console.log()
    })

    // Check skills
    const skills = await Skill.all()
    console.log(`\nTotal skills: ${skills.length}`)
    skills.slice(0, 10).forEach(s => console.log(`  - ${s.name}`))
  }
}
