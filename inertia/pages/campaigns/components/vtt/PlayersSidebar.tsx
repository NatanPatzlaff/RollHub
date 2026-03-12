import { Users, Heart, Zap, Brain } from 'lucide-react'

interface PlayersSidebarProps {
  characters: any[]
}

export default function PlayersSidebar({ characters }: PlayersSidebarProps) {
  // Sort by initiative if available, otherwise keep existing order
  // For now, let's assume they might not have initiative set yet
  const sortedEntities = [...characters].sort((a, b) => (b.initiative || 0) - (a.initiative || 0))

  return (
    <div className="bg-[#18181B] border-r border-[#27272A] flex flex-col h-full overflow-hidden w-64 xl:w-72 flex-shrink-0">
      <div className="p-4 border-b border-[#27272A] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-[#06B6D4]" />
          <h2 className="font-bold text-white text-sm">Ordem de Turno</h2>
        </div>
        <button className="bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] px-3 py-1.5 rounded font-bold transition-colors shadow-lg shadow-[#F97316]/20">
          Próximo Turno
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {sortedEntities.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-sm text-[#52525B]">Nenhum personagem no combate.</p>
          </div>
        )}
        
        {sortedEntities.map((entity, index) => {
          const stats = entity.stats || {}
          const hpPercent = stats.maxHp > 0 ? (stats.currentHp / stats.maxHp) * 100 : 0
          const pePercent = stats.maxPe > 0 ? (stats.currentPe / stats.maxPe) * 100 : 0
          const sanPercent = stats.maxSanity > 0 ? (stats.currentSanity / stats.maxSanity) * 100 : 0
          const isTurn = index === 0 && sortedEntities.length > 0 // Placeholder logic for current turn

          return (
            <div key={entity.id} className={`bg-[#101012] border ${isTurn ? 'border-[#F97316]' : 'border-[#27272A]'} rounded-lg p-3 hover:border-[#3F3F46] transition-colors relative`}>
              
              {/* Initiative Badge */}
              <div className={`absolute top-3 right-3 text-xs font-black px-2 py-0.5 rounded ${isTurn ? 'bg-[#F97316] text-[#09090B]' : 'bg-[#27272A] text-white'}`}>
                {entity.initiative || 0}
              </div>

              <div className="flex justify-between items-start mb-2 pr-8">
                <h3 className="font-bold text-sm truncate text-white">{entity.name}</h3>
              </div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-2">
                {entity.class?.name || 'Personagem'}
              </span>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart size={10} className="text-[#EF4444] w-3" />
                  <div className="flex-1 h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444]" style={{ width: `${hpPercent}%` }} />
                  </div>
                  <span className="text-[10px] text-white font-mono w-8 text-right">{stats.currentHp || 0}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap size={10} className="text-[#EAB308] w-3" />
                  <div className="flex-1 h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EAB308]" style={{ width: `${pePercent}%` }} />
                  </div>
                  <span className="text-[10px] text-white font-mono w-8 text-right">{stats.currentPe || 0}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Brain size={10} className="text-[#06B6D4] w-3" />
                  <div className="flex-1 h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
                    <div className="h-full bg-[#06B6D4]" style={{ width: `${sanPercent}%` }} />
                  </div>
                  <span className="text-[10px] text-white font-mono w-8 text-right">{stats.currentSanity || 0}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
