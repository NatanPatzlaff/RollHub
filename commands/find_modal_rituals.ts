import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Ritual from '#models/ritual'

export default class FindModalRituals extends BaseCommand {
  static commandName = 'find:modal-rituals'
  static description = 'Encontra rituais que possuem múltiplas escolhas de efeitos'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const rituals = await Ritual.all()
    
    const keywords = [
      'escolha um dos',
      'seguintes efeitos',
      'escolha entre'
    ]

    const modalRituals = rituals.filter((ritual) => {
      if (!ritual.description) return false
      const desc = ritual.description.toLowerCase()
      return keywords.some((k) => desc.includes(k))
    })

    if (modalRituals.length === 0) {
      this.logger.info('Nenhum ritual modal encontrado.')
      return
    }

    this.logger.info(`Encontrados ${modalRituals.length} rituais suspeitos:\n`)

    for (const ritual of modalRituals) {
      this.logger.info(`ID: ${ritual.id} - Nome: ${ritual.name}`)
    }
  }
}