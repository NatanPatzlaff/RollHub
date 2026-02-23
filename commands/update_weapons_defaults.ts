import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

/**
 * Aplica os valores padrão em armas: alcance "Corpo a corpo" e margem de crítico "20"
 * quando não especificados. Use se a migration travar.
 */
export default class UpdateWeaponsDefaults extends BaseCommand {
  static commandName = 'update:weapons_defaults'
  static description = 'Define alcance "Corpo a corpo" e crítico "20" nas armas onde estiverem vazios'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      this.logger.info('Atualizando armas (alcance e crítico)...')

      await db.rawQuery(
        "UPDATE weapons SET range = ? WHERE range IS NULL OR trim(coalesce(range, '')) = ''",
        ['Corpo a corpo']
      )
      this.logger.info('Alcance: definido "Corpo a corpo" onde estava vazio.')

      await db.rawQuery(
        "UPDATE weapons SET critical = ? WHERE critical IS NULL OR trim(coalesce(critical, '')) = ''",
        ['20']
      )
      this.logger.info('Margem de crítico: definido "20" onde estava vazio.')

      this.logger.success('Concluído.')
    } catch (error: any) {
      this.logger.error(`Erro: ${error.message}`)
    }
  }
}
