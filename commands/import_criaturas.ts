import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class ImportCriaturas extends BaseCommand {
  static commandName = 'import:criaturas'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "ImportCriaturas"')
  }
}