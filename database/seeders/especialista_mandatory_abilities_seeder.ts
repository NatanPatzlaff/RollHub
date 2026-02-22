import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ClassAbility from '#models/class_ability'
import ClassProgression from '#models/class_progression'
import Class from '#models/class'

export default class extends BaseSeeder {
  async run() {
    const especialista = await Class.findBy('name', 'Especialista')
    if (!especialista) {
      console.log('Classe Especialista não encontrada!')
      return
    }

    // 1. Add mandatory abilities to class_abilities
    const eclético = await ClassAbility.updateOrCreate(
      { classId: especialista.id, name: 'Eclético' },
      {
        classId: especialista.id,
        name: 'Eclético',
        description:
          'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.',
        effects: { pe_cost: 2, mandatory: true },
      }
    )

    const perito = await ClassAbility.updateOrCreate(
      { classId: especialista.id, name: 'Perito' },
      {
        classId: especialista.id,
        name: 'Perito',
        description:
          'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste. Conforme avança de NEX, você pode gastar +1 PE para aumentar o dado de bônus (veja a Tabela 1.4). Por exemplo, em NEX 55%, pode gastar 4 PE para receber +1d10 no teste. (NEX 25%: +1d8; NEX 85%: +1d12).',
        effects: {
          pe_cost: 2,
          bonus_dice: '1d6',
          mandatory: true,
          upgrades: ['25%', '55%', '85%'],
        },
      }
    )

    const engenhosidade = await ClassAbility.updateOrCreate(
      { classId: especialista.id, name: 'Engenhosidade' },
      {
        classId: especialista.id,
        name: 'Engenhosidade',
        description:
          'Em NEX 40%, quando usa sua habilidade Eclético, você pode gastar 2 PE adicionais para receber os benefícios de ser veterano na perícia. Em NEX 75%, pode gastar 4 PE adicionais para receber os benefícios de ser expert na perícia.',
        effects: {
          mandatory: true,
          unlocks_at: '40%',
          veteran_cost: 4,
          expert_cost: 8,
          upgrades: '75%',
        },
      }
    )

    // 2. Add to class_progressions for NEX 0 (initial choice)
    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 0, title: 'Eclético' },
      {
        classId: especialista.id,
        nex: 0,
        title: 'Eclético',
        description:
          'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.',
        type: 'MANDATORY_ABILITY',
        referenceId: eclético.id,
        effects: { pe_cost: 2 },
      }
    )

    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 0, title: 'Perito' },
      {
        classId: especialista.id,
        nex: 0,
        title: 'Perito',
        description:
          'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste.',
        type: 'MANDATORY_ABILITY',
        referenceId: perito.id,
        effects: { pe_cost: 2, bonus_dice: '1d6', skill_count: 2 },
      }
    )

    // 3. Add to class_progressions for NEX 40
    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 40, title: 'Engenhosidade' },
      {
        classId: especialista.id,
        nex: 40,
        title: 'Engenhosidade',
        description:
          'Quando usa sua habilidade Eclético, você pode gastar 2 PE adicionais para receber os benefícios de ser veterano na perícia.',
        type: 'MANDATORY_ABILITY',
        referenceId: engenhosidade.id,
        effects: { veteran_cost: 4 },
      }
    )

    // 4. Upgrades for Perito
    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 25, title: 'Perito - Upgrade +1d8' },
      {
        classId: especialista.id,
        nex: 25,
        title: 'Perito - Upgrade',
        description: 'O dado de bônus do Perito aumenta para +1d8 (custo permanece 3 PE).',
        type: 'ABILITY_UPGRADE',
        referenceId: perito.id,
        effects: { bonus_dice: '1d8', pe_cost: 3 },
      }
    )

    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 55, title: 'Perito - Upgrade +1d10' },
      {
        classId: especialista.id,
        nex: 55,
        title: 'Perito - Upgrade',
        description: 'O dado de bônus do Perito aumenta para +1d10 (custo permanece 3 PE).',
        type: 'ABILITY_UPGRADE',
        referenceId: perito.id,
        effects: { bonus_dice: '1d10', pe_cost: 3 },
      }
    )

    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 85, title: 'Perito - Upgrade +1d12' },
      {
        classId: especialista.id,
        nex: 85,
        title: 'Perito - Upgrade',
        description: 'O dado de bônus do Perito aumenta para +1d12 (custo permanece 3 PE).',
        type: 'ABILITY_UPGRADE',
        referenceId: perito.id,
        effects: { bonus_dice: '1d12', pe_cost: 3 },
      }
    )

    // 5. Upgrade for Engenhosidade
    await ClassProgression.updateOrCreate(
      { classId: especialista.id, nex: 75, title: 'Engenhosidade - Upgrade Expert' },
      {
        classId: especialista.id,
        nex: 75,
        title: 'Engenhosidade - Upgrade',
        description:
          'Você pode gastar 4 PE adicionais quando usa Eclético para receber os benefícios de ser expert na perícia.',
        type: 'ABILITY_UPGRADE',
        referenceId: engenhosidade.id,
        effects: { expert_cost: 8 },
      }
    )

    console.log(
      `✓ Seeded 3 mandatory Especialista abilities with 5 upgrades (8 progressions total)`
    )
  }
}
