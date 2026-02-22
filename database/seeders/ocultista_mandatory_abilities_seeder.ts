import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import ClassProgression from '#models/class_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const ocultista = await Class.findBy('name', 'Ocultista')
    if (!ocultista) {
      console.log('Classe Ocultista não encontrada!')
      return
    }

    // 1. Add mandatory ability to class_abilities
    const escolhido = await ClassAbility.updateOrCreate(
      { classId: ocultista.id, name: 'Escolhido pelo Outro Lado' },
      {
        classId: ocultista.id,
        name: 'Escolhido pelo Outro Lado',
        description:
          'Você teve uma experiência paranormal e foi marcado pelo Outro Lado, absorvendo o conhecimento e poder necessários para realizar rituais. Você pode lançar rituais de 1º círculo. À medida que aumenta seu NEX, pode lançar rituais de círculos maiores (2º círculo em NEX 25%, 3º círculo em NEX 55% e 4º círculo em NEX 85%). Você começa com três rituais de 1º círculo. Sempre que avança de NEX, aprende um ritual de qualquer círculo que possa lançar. Esses rituais não contam no seu limite de rituais conhecidos. Veja o CAPÍTULO 5 para as regras de rituais.',
        effects: {
          mandatory: true,
          ritual_circles: '1º',
          starting_rituals: 3,
          upgrades: ['25%', '55%', '85%'],
        },
      }
    )

    // 2. Add to class_progressions for NEX 0
    await ClassProgression.updateOrCreate(
      { classId: ocultista.id, nex: 0, title: 'Escolhido pelo Outro Lado' },
      {
        classId: ocultista.id,
        nex: 0,
        title: 'Escolhido pelo Outro Lado',
        description:
          'Você foi marcado pelo Outro Lado e pode lançar rituais de 1º círculo. Você começa com três rituais de 1º círculo.',
        type: 'MANDATORY_ABILITY',
        referenceId: escolhido.id,
        effects: { ritual_circles: '1º', starting_rituals: 3 },
      }
    )

    // 3. Add ritual circle upgrades
    await ClassProgression.updateOrCreate(
      { classId: ocultista.id, nex: 25, title: 'Rituais de 2º Círculo' },
      {
        classId: ocultista.id,
        nex: 25,
        title: 'Rituais de 2º Círculo',
        description:
          'Você pode agora lançar rituais de 2º círculo e aprende um ritual adicional deste círculo.',
        type: 'ABILITY_UPGRADE',
        referenceId: escolhido.id,
        effects: { ritual_circles: '2º', learn_ritual: 'circle_2' },
      }
    )

    await ClassProgression.updateOrCreate(
      { classId: ocultista.id, nex: 55, title: 'Rituais de 3º Círculo' },
      {
        classId: ocultista.id,
        nex: 55,
        title: 'Rituais de 3º Círculo',
        description:
          'Você pode agora lançar rituais de 3º círculo e aprende um ritual adicional deste círculo.',
        type: 'ABILITY_UPGRADE',
        referenceId: escolhido.id,
        effects: { ritual_circles: '3º', learn_ritual: 'circle_3' },
      }
    )

    await ClassProgression.updateOrCreate(
      { classId: ocultista.id, nex: 85, title: 'Rituais de 4º Círculo' },
      {
        classId: ocultista.id,
        nex: 85,
        title: 'Rituais de 4º Círculo',
        description:
          'Você pode agora lançar rituais de 4º círculo e aprende um ritual adicional deste círculo.',
        type: 'ABILITY_UPGRADE',
        referenceId: escolhido.id,
        effects: { ritual_circles: '4º', learn_ritual: 'circle_4' },
      }
    )

    console.log(`✓ Seeded 1 mandatory Ocultista ability with 3 upgrades`)
  }
}
