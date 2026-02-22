import { BaseCommand } from '@adonisjs/core/ace'
import { inject } from '@adonisjs/core/container'
import db from '@adonisjs/lucid/services/db'

export default class CheckClassPowers extends BaseCommand {
  static commandName = 'check:class:powers'
  static description = 'Verifica quais poderes de classe existem no banco de dados'

  @inject()
  async handle() {
    console.log('🔍 Checando Poderes de Classe\n')

    // Listar todas as classes
    console.log('📚 Classes no banco:\n')
    const classes = await db.query().from('classes').select('*')
    console.table(classes)

    // Verificar os poderes por classe
    console.log('\n⚡ Poderes por Classe:\n')

    for (const cls of classes) {
      console.log(`\n=== Classe: ${cls.name} (ID: ${cls.id}) ===`)
      
      // Procurar por class_progressions relacionados
      const progressions = await db.query()
        .from('class_progressions')
        .where('class_id', cls.id)
        .orderBy('nex', 'asc')
        .select('*')
      
      if (progressions.length === 0) {
        console.log('Nenhum power ou progressão encontrada')
        continue
      }
      
      for (const prog of progressions) {
        console.log(`  NEX ${prog.nex}: ${prog.title}`)
        console.log(`    Tipo: ${prog.type}`)
        if (prog.description) {
          console.log(`    Descrição: ${prog.description}`)
        }
        
        // Se houver reference_id, buscar a ability
        if (prog.reference_id) {
          const ability = await db.query()
            .from('abilities')
            .where('id', prog.reference_id)
            .first()
          
          if (ability) {
            console.log(`    Ability: ${ability.name} (${ability.type})`)
          }
        }
      }
    }

    // Listar todas as abilities por tipo
    console.log('\n\n=== Abilities por Tipo ===\n')
    
    const abilityTypes = await db.query()
      .from('abilities')
      .select('type')
      .distinct()
    
    for (const typeRow of abilityTypes) {
      const type = typeRow.type
      const abilities = await db.query()
        .from('abilities')
        .where('type', type)
        .select('*')
      
      console.log(`\n${type}: (${abilities.length} total)`)
      console.table(abilities)
    }

    console.log('\n✅ Verificação concluída!')
  }
}
