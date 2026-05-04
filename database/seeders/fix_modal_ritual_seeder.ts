import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RitualAction from '#models/ritual_action'

export default class extends BaseSeeder {
  async run() {
    await RitualAction.query().whereIn('ritual_id', [340, 388, 390, 397, 403, 404]).delete()

    await RitualAction.createMany([
      {
        ritualId: 340,
        label: 'BASE: CHAMEJAR',
        peCost: 3,
        actionPayload: { type: 'buff', effect: '+1d6', element: 'fogo' }
      },
      {
        ritualId: 340,
        label: 'BASE: ESQUENTAR',
        peCost: 3,
        actionPayload: { type: 'damage', roll: '1d6', element: 'fogo' }
      },
      {
        ritualId: 340,
        label: 'BASE: EXTINGUIR',
        peCost: 3,
        actionPayload: { type: 'narrative' }
      },
      {
        ritualId: 340,
        label: 'BASE: MODELAR',
        peCost: 3,
        actionPayload: { type: 'damage', roll: '3d6', element: 'fogo' }
      },
      {
        ritualId: 340,
        label: 'DISCENTE: LABAREDA',
        peCost: 6,
        dt: 26,
        actionPayload: { type: 'damage', roll: '4d6', element: 'energia' }
      },
      {
        ritualId: 340,
        label: 'VERDADEIRO: LABAREDA',
        peCost: 10,
        dt: 26,
        actionPayload: { type: 'damage', roll: '8d6', element: 'energia' }
      },
      {
        ritualId: 388,
        label: 'BASE: COMANDOS',
        peCost: 1,
        actionPayload: { type: 'narrative', description: 'Fuja, Largue, Pare, Sente-se ou Venha.' }
      },
      {
        ritualId: 388,
        label: 'DISCENTE: SOFRA',
        peCost: 3,
        actionPayload: { type: 'damage', roll: '3d8', element: 'conhecimento' }
      },
      {
        ritualId: 388,
        label: 'VERDADEIRO: ATAQUE',
        peCost: 6,
        actionPayload: { type: 'narrative', description: 'Ataca alvo extra.' }
      },
      {
        ritualId: 390,
        label: 'BASE: ATRAIR / REPELIR',
        peCost: 1,
        actionPayload: { type: 'narrative' }
      },
      {
        ritualId: 390,
        label: 'DISCENTE: ARREMESSO',
        peCost: 3,
        actionPayload: { type: 'damage', roll: '1d6', element: 'fisico' }
      },
      {
        ritualId: 390,
        label: 'VERDADEIRO: LEVITAR',
        peCost: 6,
        actionPayload: { type: 'narrative' }
      },
      {
        ritualId: 397,
        label: 'BASE: MANOBRAS E VENTO',
        peCost: 3,
        actionPayload: { type: 'narrative', description: 'Ascender, Sopro ou Vento.' }
      },
      {
        ritualId: 397,
        label: 'DISCENTE: ALVOS GRANDES',
        peCost: 6,
        actionPayload: { type: 'narrative' }
      },
      {
        ritualId: 397,
        label: 'VERDADEIRO: ALVOS ENORMES',
        peCost: 12,
        actionPayload: { type: 'narrative' }
      },
      {
        ritualId: 403,
        label: 'BASE: UTILITÁRIO',
        peCost: 6,
        actionPayload: { type: 'narrative', description: 'Congelar, Derreter, Enchente, Partir.' }
      },
      {
        ritualId: 403,
        label: 'BASE: EVAPORAR',
        peCost: 6,
        actionPayload: { type: 'damage', roll: '5d8', element: 'energia' }
      },
      {
        ritualId: 403,
        label: 'VERDADEIRO: UTILITÁRIO',
        peCost: 11,
        actionPayload: { type: 'narrative', description: 'Enchente aprimorada (+12m).' }
      },
      {
        ritualId: 403,
        label: 'VERDADEIRO: EVAPORAR',
        peCost: 11,
        actionPayload: { type: 'damage', roll: '10d8', element: 'energia' }
      },
      {
        ritualId: 404,
        label: 'BASE: UTILITÁRIO',
        peCost: 6,
        actionPayload: { type: 'narrative', description: 'Modelar, Solidificar, Amolecer chão.' }
      },
      {
        ritualId: 404,
        label: 'BASE: DESABAMENTO',
        peCost: 6,
        actionPayload: { type: 'damage', roll: '10d6', element: 'fisico' }
      },
      {
        ritualId: 404,
        label: 'DISCENTE: ÁREA MAIOR',
        peCost: 9,
        actionPayload: { type: 'narrative' }
      },
      {
        ritualId: 404,
        label: 'VERDADEIRO: METAIS',
        peCost: 13,
        actionPayload: { type: 'narrative' }
      }
    ])
  }
}