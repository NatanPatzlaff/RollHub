import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Ritual from '#models/ritual'
import fs from 'node:fs'
import path from 'node:path'

export default class extends BaseSeeder {
  async run() {
    // Clear existing rituals
    await Ritual.query().delete()

    const filePath = path.join(process.cwd(), 'Rituais.md')
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`)
      return
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // Split by blocks (double newline)
    const blocks = content.split(/\n\s*\n/)

    for (const block of blocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      if (lines.length < 2) continue

      const name = lines[0]
      const detailsStr = lines[1] // e.g. "ENERGIA 4" or "CONHECIMENTO 1 | ENERGIA 1 | ..."

      const elements: string[] = []
      let circle = 0

      // Parse detailsStr
      const parts = detailsStr.split(/[|/]/)
      for (const part of parts) {
        // Match element name (all caps, spaces, accents) and circle number
        const m = part.trim().match(/^([A-ZÇÃÕÉÊÍÓÔÚ\s]+)\s+(\d)$/i)
        if (m) {
          elements.push(m[1].trim().toUpperCase())
          circle = parseInt(m[2])
        }
      }

      if (elements.length === 0) continue

      let execution = ''
      let range = ''
      let target = ''
      let duration = ''
      let resistance = ''
      
      let descriptionLines: string[] = []
      let discente = ''
      let verdadeiro = ''

      for (let i = 2; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('Execução:')) {
          execution = line.replace('Execução:', '').trim()
        } else if (line.startsWith('Alcance:')) {
          range = line.replace('Alcance:', '').trim()
        } else if (line.startsWith('Alvo:')) {
          target = line.replace('Alvo:', '').trim()
        } else if (line.startsWith('Duração:')) {
          duration = line.replace('Duração:', '').trim()
        } else if (line.startsWith('Resistência:')) {
          resistance = line.replace('Resistência:', '').trim()
        } else if (line.startsWith('Discente')) {
          discente = line
        } else if (line.startsWith('Verdadeiro')) {
          verdadeiro = line
        } else {
          descriptionLines.push(line)
        }
      }

      const description = descriptionLines.join('\n')

      await Ritual.create({
        name,
        element: elements.join(', '),
        circle,
        execution,
        range,
        target,
        duration,
        resistance: resistance || null,
        description: description || null,
        discente: discente || null,
        verdadeiro: verdadeiro || null
      })
    }

    const totalRituals = await Ritual.query().count('* as total')
    console.log(`[RitualSeeder] Successfully imported ${totalRituals[0].$extras.total} rituals.`)
  }
}