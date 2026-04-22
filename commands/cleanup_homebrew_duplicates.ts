import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'
import HomebrewItem from '#models/homebrew_item'

export default class CleanupHomebrewDuplicates extends BaseCommand {
  static commandName = 'cleanup:homebrew-duplicates'
  static description = 'Identifica e funde itens homebrew duplicados (case-insensitive)'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Iniciando limpeza de duplicatas de itens homebrew...')

    // 1. Buscar todos os itens homebrew via Database diretamente para evitar problemas de Model
    const allItems = await db.from('homebrew_items').select('*')
    
    // 2. Agrupar por nome (case-insensitive)
    const groups = new Map<string, any[]>()
    for (const item of allItems) {
      const normalizedName = item.name.trim().toLowerCase()
      if (!groups.has(normalizedName)) {
        groups.set(normalizedName, [])
      }
      groups.get(normalizedName)!.push(item)
    }

    let itemsCleaned = 0
    let linksRedirected = 0

    // 3. Processar cada grupo
    for (const [name, items] of groups.entries()) {
      if (items.length <= 1) continue

      // Ordenar por ID para manter o mais antigo
      items.sort((a, b) => a.id - b.id)
      const [original, ...duplicates] = items
      const duplicateIds = duplicates.map(d => d.id)

      this.logger.info(`Processando duplicatas para "${name}" (Mantendo ID: ${original.id})`)

      // 4. Redirecionar vínculos na tabela pivot
      for (const duplicateId of duplicateIds) {
        // Buscar vínculos da duplicata
        const links = await db.from('character_homebrew_items').where('homebrew_item_id', duplicateId)
        
        for (const link of links) {
          // Verificar se o personagem já tem o item original
          const hasOriginal = await db.from('character_homebrew_items')
            .where('character_id', link.character_id)
            .where('homebrew_item_id', original.id)
            .first()

          if (!hasOriginal) {
            // Se não tem, atualiza o vínculo para o original
            await db.from('character_homebrew_items')
              .where('id', link.id)
              .update({ homebrew_item_id: original.id })
            linksRedirected++
          } else {
            // Se já tem, deleta o vínculo duplicado (personagem não precisa de dois vínculos pro mesmo item original)
            await db.from('character_homebrew_items')
              .where('id', link.id)
              .delete()
          }
        }
      }

      // 5. Deletar os itens duplicados
      for (const duplicateId of duplicateIds) {
        await db.from('homebrew_items').where('id', duplicateId).delete()
        itemsCleaned++
      }
    }

    this.logger.success(`Limpeza concluída!`)
    this.logger.info(`Itens removidos: ${itemsCleaned}`)
    this.logger.info(`Vínculos redirecionados: ${linksRedirected}`)
  }
}