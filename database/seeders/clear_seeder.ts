import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Monster from '#models/monster'

export default class extends BaseSeeder {
  async run() {
    await Monster.query().delete()
    console.log('Tabela monsters limpa!')
  }
}
