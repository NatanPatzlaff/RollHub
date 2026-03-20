import { Users, Heart, Zap, Brain } from 'lucide-react'

interface PlayersSidebarProps {
  characters: any[]
  localInitiatives?: Record<number, number>
  requestingInitiative?: boolean
  onRequestInitiative?: () => void
  showStats: boolean
  onToggleStats?: () => void
  switchValue?: boolean
  onAttackCharacter?: (id: number, name: string) => void
}

// Helper functions for status display
const getStatusColor = (current: number, max: number) => {
  const percent = (current / max) * 100
  if (percent <= 25) return 'text-[#EF4444]' // Red
  if (percent <= 50) return 'text-[#F97316]' // Orange
  if (percent <= 75) return 'text-[#EAB308]' // Yellow
  return 'text-[#22C55E]' // Green
}

const getStatusLabel = (current: number, max: number) => {
  const percent = (current / max) * 100
  if (percent === 0) return 'Inconsciente'
  if (percent <= 25) return 'Crítico'
  if (percent <= 50) return 'Ferido'
  if (percent <= 75) return 'Machucado'
  return 'Saudável'
}

export default function PlayersSidebar({ 
  characters, 
  localInitiatives = {}, 
  requestingInitiative = false,
  onRequestInitiative,
  showStats,
  onToggleStats,
  switchValue,
  onAttackCharacter
}: PlayersSidebarProps) {
  // Sort by initiative if available, otherwise keep existing order
  const sortedEntities = [...characters].sort((a, b) => {
    const aVal = localInitiatives[a.id] ?? a.initiative ?? 0
    const bVal = localInitiatives[b.id] ?? b.initiative ?? 0
    return bVal - aVal
  })

  return (
    <div className="bg-[#18181B] border-r border-[#27272A] flex flex-col h-full overflow-hidden w-64 xl:w-72 flex-shrink-0">
      <div className="p-4 border-b border-[#27272A] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Users size={18} className="text-[#7C3AED]" /> Personagens
          </h2>
          {onToggleStats && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-bold">Status</span>
              <button
                onClick={onToggleStats}
                className={`w-8 h-4 rounded-full transition-colors relative ${(switchValue ?? showStats) ? 'bg-[#7C3AED]' : 'bg-[#27272A]'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${(switchValue ?? showStats) ? 'left-[17px]' : 'left-0.5'}`} />
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#06B6D4]" />
            <h2 className="font-bold text-white text-sm">Ordem de Turno</h2>
          </div>
          {onRequestInitiative && (
            <div className="flex items-center gap-2">
              <button
                onClick={onRequestInitiative}
                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-colors ${
                  requestingInitiative
                    ? 'bg-[#F97316] text-white ring-2 ring-[#F97316]/30 animate-pulse'
                    : 'bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46] hover:text-white'
                }`}
              >
                {requestingInitiative ? 'Aguardando...' : 'Pedir Iniciativa'}
              </button>
              <button className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] px-3 py-1.5 rounded font-bold transition-colors shadow-lg shadow-[#F97316]/20">
                Próximo Turno
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {sortedEntities.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-[#52525B]">Nenhum personagem no combate.</p>
          </div>
        )}
        
        {sortedEntities.map((entity, index) => {
          const stats = entity.stats || {}
          const isTurn = index === 0 && sortedEntities.length > 0 // Placeholder logic for current turn

          return (
            <div key={entity.id} className={`bg-[#101012] border ${isTurn ? 'border-[#F97316]' : 'border-[#27272A]'} rounded-lg p-3 hover:border-[#3F3F46] transition-colors relative`}>
              
              {/* Initiative Badge */}
              <div className={`absolute top-3 right-3 text-xs font-black px-2 py-0.5 rounded ${isTurn ? 'bg-[#F97316] text-[#09090B]' : 'bg-[#27272A] text-white'}`}>
                {localInitiatives[entity.id] ?? entity.initiative ?? 0}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 pr-8">
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{entity.name}</p>
                    <p className="text-[#A1A1AA] text-[10px]">{entity.class?.name || 'Sem Classe'}</p>
                  </div>
                  {showStats && (
                    <span className={`text-[10px] font-bold uppercase ${getStatusColor(stats.currentHp, stats.maxHp)}`}>
                      {getStatusLabel(stats.currentHp, stats.maxHp)}
                    </span>
                  )}
                </div>

                {showStats ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart size={10} className="text-[#EF4444] shrink-0" />
                      <div className="flex-1 h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#EF4444]" style={{ width: `${(stats.currentHp / stats.maxHp) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-white font-medium w-8 text-right">{stats.currentHp || 0}/{stats.maxHp || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={10} className="text-[#EAB308] shrink-0" />
                      <div className="flex-1 h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#EAB308]" style={{ width: `${(stats.currentPe / stats.maxPe) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-white font-medium w-8 text-right">{stats.currentPe || 0}/{stats.maxPe || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain size={10} className="text-[#06B6D4] shrink-0" />
                      <div className="flex-1 h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#06B6D4]" style={{ width: `${(stats.currentSanity / stats.maxSanity) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-white font-medium w-8 text-right">{stats.currentSanity || 0}/{stats.maxSanity || 0}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[46px] bg-[#09090B]/50 rounded border border-dashed border-[#27272A] flex items-center justify-center">
                    <span className="text-[#3F3F46] text-[10px] font-medium italic">Status ocultado</span>
                  </div>
                )}
                
                {onAttackCharacter && !entity.isMonster && (
                  <button
                    onClick={() => onAttackCharacter(entity.id, entity.name)}
                    className="mt-3 w-full py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-bold rounded border border-[#EF4444]/20 transition-colors uppercase tracking-wider"
                  >
                    Atacar Personagem
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
