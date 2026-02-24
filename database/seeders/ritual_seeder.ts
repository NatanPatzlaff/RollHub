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

      const firstLine = lines[0]
      const headerMatch = firstLine.match(/^(.+?)\s*\((.+?)\)/)
      if (!headerMatch) continue

      const name = headerMatch[1].trim()
      const detailsStr = headerMatch[2].trim() // e.g. "ENERGIA 4" or "CONHECIMENTO 1 / ..."

      const elements: string[] = []
      let circle = 0

      // Parse detailsStr
      const parts = detailsStr.split('/')
      for (const part of parts) {
        // Match element name (all caps, spaces, accents) and circle number
        const m = part.trim().match(/^([A-ZÇÃÕÉÊÍÓÔÚ]+)\s+(\d)$/i)
        if (m) {
          elements.push(m[1].toUpperCase())
          circle = parseInt(m[2])
        }
      }

      const infoLine = lines[1]
      const infoParts = infoLine.split('|').map(p => p.trim())

      let execution = ''
      let range = ''
      let target = ''
      let duration = ''
      let resistance = ''

      for (const part of infoParts) {
        if (part.startsWith('Execução:')) execution = part.replace('Execução:', '').trim()
        if (part.startsWith('Alcance:')) range = part.replace('Alcance:', '').trim()
        if (part.startsWith('Alvo:')) target = part.replace('Alvo:', '').trim()
        if (part.startsWith('Duração:')) duration = part.replace('Duração:', '').trim()
        if (part.startsWith('Resistência:')) resistance = part.replace('Resistência:', '').trim()
      }

      let description = ''
      let discente = ''
      let verdadeiro = ''

      for (let i = 2; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('Discente')) {
          discente = line
        } else if (line.startsWith('Verdadeiro')) {
          verdadeiro = line
        } else {
          if (description) description += '\n'
          description += line
        }
      }

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

    console.log(`[RitualSeeder] Imported ${blocks.length} rituals blocks potentially.`)
  }
}