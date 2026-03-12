import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import ClassProgression from '#models/class_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const combatente = await Class.findBy('name', 'Combatente')
    if (!combatente) {
      console.log('Classe Combatente não encontrada!')
      return
    }

    // 1. Add mandatory ability to class_abilities
    const ataqueEspecial = await ClassAbility.updateOrCreate(
      { classId: combatente.id, name: 'Ataque Especial' },
      {
        classId: combatente.id,
        name: 'Ataque Especial',
        description:
          'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5 (veja a Tabela 1.3). Você pode aplicar cada bônus de +5 em ataque ou dano. Por exemplo, em NEX 55%, você pode gastar 4 PE para receber +5 no teste de ataque e +10 na rolagem de dano.',
        effects: {
          pe_cost: 2,
          mandatory: true,
          upgrades: ['25%', '55%', '85%'],
        },
      }
    )

    // 2. Add to class_progressions for NEX 5
    await ClassProgression.updateOrCreate(
      { classId: combatente.id, nex: 5, title: 'Ataque Especial' },
      {
        classId: combatente.id,
        nex: 5,
        title: 'Ataque Especial',
        description:
          'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano.',
        type: 'MANDATORY_ABILITY',
        referenceId: ataqueEspecial.id,
        effects: { pe_cost: 2, bonus: 5 },
      }
    )

    // 3. Upgrades for Ataque Especial
    const upgrades = [
      { nex: 25, bonus: 10, cost: 3 },
      { nex: 55, bonus: 15, cost: 4 },
      { nex: 85, bonus: 20, cost: 5 },
    ]

    for (const upgrade of upgrades) {
      await ClassProgression.updateOrCreate(
        { classId: combatente.id, nex: upgrade.nex, title: `Ataque Especial (+${upgrade.bonus})` },
        {
          classId: combatente.id,
          nex: upgrade.nex,
          title: `Ataque Especial (+${upgrade.bonus})`,
          description: `Bônus aumenta para +${upgrade.bonus}. Custo total ${upgrade.cost} PE. Você pode aplicar cada bônus de +5 em ataque ou dano.`,
          type: 'ABILITY_UPGRADE',
          referenceId: ataqueEspecial.id,
          effects: { bonus: upgrade.bonus, pe_cost: upgrade.cost },
        }
      )
    }

    console.log(`✓ Seeded mandatory Combatente ability with 3 upgrades`)
  }
}
