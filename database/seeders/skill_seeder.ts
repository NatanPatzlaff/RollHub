import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Skill from '#models/skill'

export default class extends BaseSeeder {
  async run() {
    // Create all skills
    const skills = [
      { name: 'Acrobacia' },
      { name: 'Adestramento' },
      { name: 'Artes' },
      { name: 'Atletismo' },
      { name: 'Atualidades' },
      { name: 'Ciências' },
      { name: 'Crime' },
      { name: 'Diplomacia' },
      { name: 'Enganação' },
      { name: 'Fortitude' },
      { name: 'Furtividade' },
      { name: 'Iniciativa' },
      { name: 'Intimidação' },
      { name: 'Intuição' },
      { name: 'Investigação' },
      { name: 'Luta' },
      { name: 'Medicina' },
      { name: 'Ocultismo' },
      { name: 'Percepção' },
      { name: 'Pilotagem' },
      { name: 'Pontaria' },
      { name: 'Profissão' },
      { name: 'Reflexos' },
      { name: 'Religião' },
      { name: 'Sobrevivência' },
      { name: 'Tática' },
      { name: 'Tecnologia' },
      { name: 'Vontade' }
    ]

    await Skill.updateOrCreateMany('name', skills)
  }
}
