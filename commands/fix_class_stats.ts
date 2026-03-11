import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Class from '#models/class'

export default class FixClassStats extends BaseCommand {
  static commandName = 'fix:class-stats'
  static description = 'Verifica e corrige os valores de PV, PE e SAN das classes'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔍 Verificando valores das classes...')

    // Valores corretos conforme o livro de regras
    const correctValues = {
      Combatente: {
        baseHp: 20,
        hpPerLevel: 4,
        basePe: 2,
        pePerLevel: 2,
        baseSanity: 12,
        sanityPerLevel: 3,
      },
      Especialista: {
        baseHp: 16,
        hpPerLevel: 3,
        basePe: 3,
        pePerLevel: 3,
        baseSanity: 16,
        sanityPerLevel: 4,
      },
      Ocultista: {
        baseHp: 12,
        hpPerLevel: 2,
        basePe: 4,
        pePerLevel: 4,
        baseSanity: 20,
        sanityPerLevel: 5,
      },
      Mundano: {
        baseHp: 8,
        hpPerLevel: 0,
        basePe: 1,
        pePerLevel: 0,
        baseSanity: 8,
        sanityPerLevel: 0,
      },
    }

    // Buscar classes atuais
    const classes = await Class.all()

    this.logger.info(`\n📊 Classes encontradas: ${classes.length}`)
    this.logger.info('═══════════════════════════════════════════════════════')

    let hasErrors = false

    for (const cls of classes) {
      const correct = correctValues[cls.name as keyof typeof correctValues]
      if (!correct) {
        this.logger.warning(`⚠️  Classe desconhecida: ${cls.name}`)
        continue
      }

      const errors = []
      if (cls.baseHp !== correct.baseHp) errors.push(`baseHp: ${cls.baseHp} → ${correct.baseHp}`)
      if (cls.hpPerLevel !== correct.hpPerLevel)
        errors.push(`hpPerLevel: ${cls.hpPerLevel} → ${correct.hpPerLevel}`)
      if (cls.basePe !== correct.basePe) errors.push(`basePe: ${cls.basePe} → ${correct.basePe}`)
      if (cls.pePerLevel !== correct.pePerLevel)
        errors.push(`pePerLevel: ${cls.pePerLevel} → ${correct.pePerLevel}`)
      if (cls.baseSanity !== correct.baseSanity)
        errors.push(`baseSanity: ${cls.baseSanity} → ${correct.baseSanity}`)
      if (cls.sanityPerLevel !== correct.sanityPerLevel)
        errors.push(`sanityPerLevel: ${cls.sanityPerLevel} → ${correct.sanityPerLevel}`)

      if (errors.length > 0) {
        hasErrors = true
        this.logger.error(`\n❌ ${cls.name} - VALORES INCORRETOS:`)
        errors.forEach((e) => this.logger.error(`   ${e}`))

        // Corrigir valores
        cls.baseHp = correct.baseHp
        cls.hpPerLevel = correct.hpPerLevel
        cls.basePe = correct.basePe
        cls.pePerLevel = correct.pePerLevel
        cls.baseSanity = correct.baseSanity
        cls.sanityPerLevel = correct.sanityPerLevel
        await cls.save()

        this.logger.success(`   ✅ Valores corrigidos!`)
      } else {
        this.logger.success(`✅ ${cls.name} - OK`)
      }
    }

    this.logger.info('\n═══════════════════════════════════════════════════════')

    if (hasErrors) {
      this.logger.success('\n🎉 Todas as correções foram aplicadas!')
      this.logger.info('\n📋 Resumo dos valores corretos:')
      this.logger.info('   Combatente:  PV 20+4/VIG | PE 2+PRE | SAN 12+3')
      this.logger.info('   Especialista: PV 16+3/VIG | PE 3+PRE | SAN 16+4')
      this.logger.info('   Ocultista:    PV 12+2/VIG | PE 4+PRE | SAN 20+5')
      this.logger.info('   Mundano:      PV 8+0/VIG  | PE 1+PRE | SAN 8+0')
    } else {
      this.logger.success('\n✨ Todas as classes já estão com valores corretos!')
    }
  }
}
