import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import ClassProgression from '#models/class_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const mundano = await Class.findBy('name', 'Mundano')
    if (!mundano) {
      console.log('Classe Mundano não encontrada!')
      return
    }

    // 1. Add mandatory ability to class_abilities
    const empenho = await ClassAbility.updateOrCreate(
      { classId: mundano.id, name: 'Empenho' },
      {
        classId: mundano.id,
        name: 'Empenho',
        description:
          'Você pode gastar 1 PE para receber +2 em um teste de perícia que esteja realizando (exceto testes de ataque).',
        effects: {
          pe_cost: 1,
          mandatory: true,
          bonus: 2,
        },
      }
    )

    // 2. Add to class_progressions for NEX 0
    await ClassProgression.updateOrCreate(
      { classId: mundano.id, nex: 0, title: 'Empenho' },
      {
        classId: mundano.id,
        nex: 0,
        title: 'Empenho',
        description:
          'Você pode gastar 1 PE para receber +2 em um teste de perícia que esteja realizando (exceto testes de ataque).',
        type: 'MANDATORY_ABILITY',
        referenceId: empenho.id,
        effects: { pe_cost: 1, bonus: 2 },
      }
    )

    console.log(`✓ Seeded mandatory Mundano ability`)
  }
}
