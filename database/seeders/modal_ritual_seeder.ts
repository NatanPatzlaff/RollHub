import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RitualAction from '#models/ritual_action'

export default class extends BaseSeeder {
  async run() {
    const data = [
      {
        ritualId: 388,
        actions: [
          { label: 'BASE: CONFUSÃO', peCost: 1, dt: 21, actionPayload: { type: 'condition', condition: 'Confuso' } },
          { label: 'BASE: HESITAÇÃO', peCost: 1, dt: 21, actionPayload: { type: 'condition', condition: 'Lento' } },
          { label: 'BASE: PÂNICO', peCost: 1, dt: 21, actionPayload: { type: 'condition', condition: 'Abalado' } },
          { label: 'DISCENTE: CONFUSÃO', peCost: 3, dt: 23, actionPayload: { type: 'condition', condition: 'Confuso' } },
          { label: 'DISCENTE: HESITAÇÃO', peCost: 3, dt: 23, actionPayload: { type: 'condition', condition: 'Lento' } },
          { label: 'DISCENTE: PÂNICO', peCost: 3, dt: 23, actionPayload: { type: 'condition', condition: 'Abalado' } },
          { label: 'VERDADEIRO: CONFUSÃO', peCost: 6, dt: 26, actionPayload: { type: 'condition', condition: 'Confuso' } },
          { label: 'VERDADEIRO: HESITAÇÃO', peCost: 6, dt: 26, actionPayload: { type: 'condition', condition: 'Lento' } },
          { label: 'VERDADEIRO: PÂNICO', peCost: 6, dt: 26, actionPayload: { type: 'condition', condition: 'Abalado' } },
        ],
      },
      {
        ritualId: 390,
        actions: [
          { label: 'BASE: ATRAIR', peCost: 1, dt: 21, actionPayload: { type: 'maneuver', maneuver: 'atrair' } },
          { label: 'BASE: REPELIR', peCost: 1, dt: 21, actionPayload: { type: 'maneuver', maneuver: 'repelir' } },
          { label: 'DISCENTE: ATRAIR', peCost: 3, dt: 23, actionPayload: { type: 'maneuver', maneuver: 'atrair' } },
          { label: 'DISCENTE: REPELIR', peCost: 3, dt: 23, actionPayload: { type: 'maneuver', maneuver: 'repelir' } },
          { label: 'VERDADEIRO: ATRAIR', peCost: 6, dt: 26, actionPayload: { type: 'maneuver', maneuver: 'atrair' } },
          { label: 'VERDADEIRO: REPELIR', peCost: 6, dt: 26, actionPayload: { type: 'maneuver', maneuver: 'repelir' } },
        ],
      },
      {
        ritualId: 397,
        actions: [
          { label: 'BASE: EMPURRAR', peCost: 1, dt: 21, actionPayload: { type: 'combat_maneuver', maneuver: 'empurrar' } },
          { label: 'BASE: DERRUBAR', peCost: 1, dt: 21, actionPayload: { type: 'combat_maneuver', maneuver: 'derrubar' } },
          { label: 'BASE: DISSIPAR', peCost: 1, dt: 21, actionPayload: { type: 'narrative', effect: 'dissipar gases' } },
          { label: 'DISCENTE: EMPURRAR', peCost: 3, dt: 23, actionPayload: { type: 'combat_maneuver', maneuver: 'empurrar' } },
          { label: 'DISCENTE: DERRUBAR', peCost: 3, dt: 23, actionPayload: { type: 'combat_maneuver', maneuver: 'derrubar' } },
          { label: 'VERDADEIRO: EMPURRAR', peCost: 6, dt: 26, actionPayload: { type: 'combat_maneuver', maneuver: 'empurrar' } },
          { label: 'VERDADEIRO: DERRUBAR', peCost: 6, dt: 26, actionPayload: { type: 'combat_maneuver', maneuver: 'derrubar' } },
        ],
      },
      {
        ritualId: 403,
        actions: [
          { label: 'BASE: CHAFARIZ', peCost: 1, dt: 21, actionPayload: { type: 'narrative', effect: 'jato de água' } },
          { label: 'BASE: MODELAR', peCost: 1, dt: 21, actionPayload: { type: 'narrative', effect: 'modelar água' } },
          { label: 'BASE: PURIFICAR/POLUIR', peCost: 1, dt: 21, actionPayload: { type: 'narrative', effect: 'alterar qualidade' } },
          { label: 'DISCENTE: CHAFARIZ', peCost: 3, dt: 23, actionPayload: { type: 'narrative', effect: 'jato forte' } },
          { label: 'VERDADEIRO: CHAFARIZ', peCost: 6, dt: 26, actionPayload: { type: 'narrative', effect: 'torrente' } },
        ],
      },
      {
        ritualId: 404,
        actions: [
          { label: 'BASE: ESCAVAR', peCost: 1, dt: 21, actionPayload: { type: 'narrative', effect: 'escavar' } },
          { label: 'BASE: MOLDAR', peCost: 1, dt: 21, actionPayload: { type: 'narrative', effect: 'moldar terra' } },
          { label: 'DISCENTE: ESCAVAR', peCost: 3, dt: 23, actionPayload: { type: 'narrative', effect: 'escavar área maior' } },
          { label: 'VERDADEIRO: ESCAVAR', peCost: 6, dt: 26, actionPayload: { type: 'narrative', effect: 'túnel' } },
        ],
      },
    ]

    for (const item of data) {
      await RitualAction.query().where('ritual_id', item.ritualId).delete()
      await RitualAction.createMany(item.actions.map(a => ({ ...a, ritualId: item.ritualId })))
    }
  }
}