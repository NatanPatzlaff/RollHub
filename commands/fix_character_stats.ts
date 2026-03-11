import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Character from '#models/character'

export default class FixCharacterStats extends BaseCommand {
  static commandName = 'fix:character-stats'
  static description = 'Recalcula PV, PE e SAN de todos os personagens baseado na classe e NEX'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔍 Recalculando stats dos personagens...')

    const characters = await Character.query()
      .preload('class')
      .preload('attributes')
      .preload('stats')
      .preload('classAbilities', (query) => query.preload('classAbility'))

    this.logger.info(`\n📊 Personagens encontrados: ${characters.length}`)
    this.logger.info('═══════════════════════════════════════════════════════')

    let fixedCount = 0

    for (const character of characters) {
      const classData = character.class
      const attributes = character.attributes
      const stats = character.stats
      const nex = character.nex
      const level = Math.floor(nex / 5)

      if (!classData || !attributes || !stats) {
        this.logger.warning(`⚠️  ${character.name} - Dados incompletos, pulando...`)
        continue
      }

      // Cálculo correto de PV
      let calculatedMaxHp = classData.baseHp
      if (classData.hpAttribute === 'vigor') {
        calculatedMaxHp += attributes.vigor
      }
      if (level > 1) {
        if (classData.hpAttribute === 'vigor') {
          calculatedMaxHp += (classData.hpPerLevel + attributes.vigor) * (level - 1)
        } else {
          calculatedMaxHp += classData.hpPerLevel * (level - 1)
        }
      }

      // Cálculo correto de PE
      let calculatedMaxPe = classData.basePe
      if (classData.peAttribute === 'presence') {
        calculatedMaxPe += attributes.presence
      }
      if (level > 1) {
        if (classData.peAttribute === 'presence') {
          calculatedMaxPe += (classData.pePerLevel + attributes.presence) * (level - 1)
        } else {
          calculatedMaxPe += classData.pePerLevel * (level - 1)
        }
      }

      // Cálculo correto de SAN
      let calculatedMaxSanity = classData.baseSanity
      if (level > 1) {
        calculatedMaxSanity += classData.sanityPerLevel * (level - 1)
      }

      // Ajuste por Transcender
      const transcendCount =
        character.classAbilities?.filter((ca) => ca.classAbility?.name === 'Transcender').length ||
        0
      calculatedMaxSanity -= transcendCount * classData.sanityPerLevel

      // Ajuste por perda permanente de sanidade
      calculatedMaxSanity -= stats.permanentSanityLoss || 0

      // Verificar se precisa corrigir
      const needsFix =
        stats.maxHp !== calculatedMaxHp ||
        stats.maxPe !== calculatedMaxPe ||
        stats.maxSanity !== calculatedMaxSanity

      if (needsFix) {
        this.logger.info(`\n❌ ${character.name} (${classData.name} ${nex}% NEX):`)
        if (stats.maxHp !== calculatedMaxHp) {
          this.logger.error(`   PV: ${stats.maxHp} → ${calculatedMaxHp}`)
        }
        if (stats.maxPe !== calculatedMaxPe) {
          this.logger.error(`   PE: ${stats.maxPe} → ${calculatedMaxPe}`)
        }
        if (stats.maxSanity !== calculatedMaxSanity) {
          this.logger.error(`   SAN: ${stats.maxSanity} → ${calculatedMaxSanity}`)
        }

        // Aplicar correção
        stats.maxHp = calculatedMaxHp
        stats.maxPe = calculatedMaxPe
        stats.maxSanity = calculatedMaxSanity

        // Garantir que valores atuais não excedam os máximos
        stats.currentHp = Math.min(stats.currentHp, calculatedMaxHp)
        stats.currentPe = Math.min(stats.currentPe, calculatedMaxPe)
        stats.currentSanity = Math.min(stats.currentSanity, calculatedMaxSanity)

        await stats.save()
        this.logger.success(`   ✅ Corrigido!`)
        fixedCount++
      } else {
        this.logger.success(`✅ ${character.name} - OK`)
      }
    }

    this.logger.info('\n═══════════════════════════════════════════════════════')
    if (fixedCount > 0) {
      this.logger.success(`\n🎉 ${fixedCount} personagem(s) corrigido(s)!`)
    } else {
      this.logger.success('\n✨ Todos os personagens já estão com stats corretos!')
    }
  }
}
