import { BaseCommand } from '@adonisjs/core/ace'
import db from '@adonisjs/lucid/services/db'
import Skill from '#models/skill'
import Origin from '#models/origin'

export default class DiagnoseSkills extends BaseCommand {
  static commandName = 'diagnose:skills'
  static description = 'Diagnose skills and origins'

  async run() {
    this.logger.info('=== SKILLS DIAGNOSIS ===\n')

    // Check skills count
    const skillsCount = await Skill.query().count('*')
    this.logger.info(`✓ Total skills in database: ${skillsCount[0].$extras.count || 0}`)

    // List first 5 skills
    const skills = await Skill.query().limit(5)
    if (skills.length > 0) {
      this.logger.info('\nFirst 5 skills:')
      skills.forEach(s => this.logger.info(`  - ${s.name}`))
    }

    // Check origins with trainedSkills
    const origins = await Origin.query().limit(3)
    this.logger.info(`\n✓ Total origins checked: ${origins.length}`)

    origins.forEach(origin => {
      this.logger.info(`\nOrigin: ${origin.name}`)
      this.logger.info(`  trainedSkills: ${JSON.stringify(origin.trainedSkills)}`)
      this.logger.info(`  Type: ${typeof origin.trainedSkills}`)
      this.logger.info(`  Is Array: ${Array.isArray(origin.trainedSkills)}`)
    })

    // Check character_skills count
    const charSkillsCount = await db.from('character_skills').count('*')
    this.logger.info(`\n✓ Total character_skills records: ${charSkillsCount[0].$extras.count || 0}`)

    // Sample character with skills
    const charSkills = await db
      .from('character_skills')
      .select('*')
      .limit(5)
    
    if (charSkills.length > 0) {
      this.logger.info('\nSample character_skills:')
      charSkills.forEach(cs => {
        this.logger.info(`  - CharID: ${cs.character_id}, SkillID: ${cs.skill_id}, Degree: ${cs.training_degree}`)
      })
    } else {
      this.logger.info('  No character_skills found')
    }
  }
}
