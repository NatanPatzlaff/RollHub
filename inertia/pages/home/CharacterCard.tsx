import { Trash2 } from 'lucide-react'
import EntityCard from './EntityCard'
import { getClassStyle } from '../../utils/classStyles'

interface Character {
  id: number
  name: string
  nex: number
  class?: { name: string } | null
  origin?: { name: string } | null
}

interface CharacterCardProps {
  character: Character
  index: number
  onClick?: () => void
  onDelete?: (e: React.MouseEvent) => void
}

const CharacterCard = ({ character, index, onClick, onDelete }: CharacterCardProps) => {
  const { color, bg, Icon } = getClassStyle(character.class?.name)

  return (
    <EntityCard index={index} onClick={onClick}>
      <div className="flex items-center gap-4">
        {/* ícone da classe com cor temática */}
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-7 w-7 ${color}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {character.name || 'Agente Sem Nome'}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded font-bold whitespace-nowrap">
                NEX {character.nex}%
              </span>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  title="Deletar personagem"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {character.class?.name || 'N/A'} • {character.origin?.name || 'N/A'}
          </p>
        </div>
      </div>
    </EntityCard>
  )
}

export default CharacterCard
