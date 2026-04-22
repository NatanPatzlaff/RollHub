import { Users, Heart, Zap, Brain, Sparkles, Check, X, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface PlayersSidebarProps {
  characters: any[]
  localInitiatives?: Record<number, number>
  requestingInitiative?: boolean
  onRequestInitiative?: () => void
  onInitiativeChange?: (characterId: number, value: number) => void
  onNextTurn?: (characterId: number, characterName: string) => void
  showStats: boolean
  onToggleStats?: () => void
  switchValue?: boolean
  onAttackCharacter?: (id: number, name: string) => void
}

const getStatusColor = (current: number, max: number) => {
  const percent = (current / max) * 100
  if (percent <= 25) return 'text-[#EF4444]'
  if (percent <= 50) return 'text-[#F97316]'
  if (percent <= 75) return 'text-[#EAB308]'
  return 'text-[#22C55E]'
}

const getStatusLabel = (current: number, max: number) => {
  const percent = (current / max) * 100
  if (percent === 0) return 'Inconsciente'
  if (percent <= 25) return 'Crítico'
  if (percent <= 50) return 'Ferido'
  if (percent <= 75) return 'Machucado'
  return 'Saudável'
}

// Input de iniciativa com estado local de string — permite campo vazio durante edição
function InitiativeInput({
  externalValue,
  isTurn,
  onChange,
}: {
  externalValue: number
  isTurn: boolean
  onChange: (val: number) => void
}) {
  const [draft, setDraft] = useState(String(externalValue))

  // Sincroniza quando o valor externo muda (ex: polling recebeu iniciativa do jogador)
  useEffect(() => {
    setDraft(String(externalValue))
  }, [externalValue])

  return (
    <input
      type="text"
      inputMode="numeric"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const parsed = parseInt(draft, 10)
        if (!isNaN(parsed)) {
          onChange(parsed)
          setDraft(String(parsed))
        } else {
          setDraft(String(externalValue))
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
      onClick={(e) => (e.target as HTMLInputElement).select()}
      className={`text-xs font-black px-2 py-0.5 rounded w-12 text-center border-0 outline-none cursor-pointer focus:ring-1 focus:ring-[#F97316]/60 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shrink-0 ${
        isTurn
          ? 'bg-[#F97316] text-[#09090B] focus:bg-[#EA580C]'
          : 'bg-[#27272A] text-white focus:bg-[#3F3F46]'
      }`}
      title="Clique para editar a iniciativa"
    />
  )
}

export default function PlayersSidebar({
  characters,
  localInitiatives = {},
  requestingInitiative = false,
  onRequestInitiative,
  onInitiativeChange,
  onNextTurn,
  showStats,
  onToggleStats,
  switchValue,
  onAttackCharacter,
}: PlayersSidebarProps) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)

  const sortedEntities = [...characters].sort((a, b) => {
    const aVal = localInitiatives[a.id] ?? a.initiative ?? 0
    const bVal = localInitiatives[b.id] ?? b.initiative ?? 0
    return bVal - aVal
  })

  const handleNextTurn = () => {
    if (sortedEntities.length === 0) return
    const nextIndex = (currentTurnIndex + 1) % sortedEntities.length
    setCurrentTurnIndex(nextIndex)
    const nextEntity = sortedEntities[nextIndex]
    if (nextEntity) onNextTurn?.(nextEntity.id, nextEntity.name)
  }

  // Ao pedir nova rodada de iniciativa, volta para o primeiro da lista
  const handleRequestInitiativeWrapped = () => {
    setCurrentTurnIndex(0)
    onRequestInitiative?.()
  }

  // Estados de aprovação de itens
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isApproving, setIsApproving] = useState<number | null>(null)

  const handleApprove = async (itemId: number) => {
    setIsApproving(itemId)
    try {
      await axios.patch(`/homebrew-items/${itemId}/approve`)
      setExpandedItem(null)
    } catch (e) {
      console.error(e)
    }
    setIsApproving(null)
  }

  const handleReject = async (itemId: number) => {
    if (!rejectionReason.trim()) return
    setIsApproving(itemId)
    try {
      await axios.patch(`/homebrew-items/${itemId}/reject`, { rejectionReason })
      setRejectionReason('')
      setExpandedItem(null)
    } catch (e) {
      console.error(e)
    }
    setIsApproving(null)
  }

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
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${(switchValue ?? showStats) ? 'left-[17px]' : 'left-0.5'}`}
                />
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
                onClick={handleRequestInitiativeWrapped}
                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-colors ${
                  requestingInitiative
                    ? 'bg-[#F97316] text-white ring-2 ring-[#F97316]/30 animate-pulse'
                    : 'bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46] hover:text-white'
                }`}
              >
                {requestingInitiative ? 'Aguardando...' : 'Pedir Iniciativa'}
              </button>
              <button
                onClick={handleNextTurn}
                disabled={sortedEntities.length === 0}
                className="bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] px-3 py-1.5 rounded font-bold transition-colors shadow-lg shadow-[#F97316]/20"
              >
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
          const isTurn = index === currentTurnIndex && sortedEntities.length > 0

          return (
            <div
              key={entity.id}
              className={`bg-[#101012] border ${isTurn ? 'border-[#F97316]' : 'border-[#27272A]'} rounded-lg p-3 hover:border-[#3F3F46] transition-colors`}
            >
              <div className="flex-1 min-w-0">
                {/* Header: nome + coluna direita (status + badge) */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{entity.name}</p>
                    <p className="text-[#A1A1AA] text-[10px]">{entity.class?.name || 'Sem Classe'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {showStats && (
                      <span className={`text-[10px] font-bold uppercase ${getStatusColor(stats.currentHp, stats.maxHp)}`}>
                        {getStatusLabel(stats.currentHp, stats.maxHp)}
                      </span>
                    )}
                    <InitiativeInput
                      externalValue={localInitiatives[entity.id] ?? entity.initiative ?? 0}
                      isTurn={isTurn}
                      onChange={(val) => onInitiativeChange?.(entity.id, val)}
                    />
                  </div>
                </div>

                {showStats ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart size={10} className="text-[#EF4444] shrink-0" />
                      <div className="flex-1 h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#EF4444]" style={{ width: `${(stats.currentHp / stats.maxHp) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-white font-medium w-8 text-right">
                        {stats.currentHp || 0}/{stats.maxHp || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={10} className="text-[#EAB308] shrink-0" />
                      <div className="flex-1 h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#EAB308]" style={{ width: `${(stats.currentPe / stats.maxPe) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-white font-medium w-8 text-right">
                        {stats.currentPe || 0}/{stats.maxPe || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain size={10} className="text-[#06B6D4] shrink-0" />
                      <div className="flex-1 h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#06B6D4]" style={{ width: `${(stats.currentSanity / stats.maxSanity) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-white font-medium w-8 text-right">
                        {stats.currentSanity || 0}/{stats.maxSanity || 0}
                      </span>
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

                {/* Sub-menu de Aprovação de Itens Pessoais */}
                {entity.homebrewItems?.filter((i: any) => i.pivot_status === 'pending' || i.$extras?.pivot_status === 'pending').length > 0 && (
                  <div className="mt-3 bg-[#18181B] border border-amber-500/20 rounded p-2">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={12} className="text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-500 uppercase">Itens Pendentes</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {entity.homebrewItems.filter((i: any) => i.pivot_status === 'pending' || i.$extras?.pivot_status === 'pending').map((item: any) => (
                        <div key={item.id} className="bg-[#27272A] rounded p-2 border border-[#3F3F46]">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-200">{item.name}</span>
                            <div className="flex gap-1">
                              <button
                                disabled={isApproving === item.id}
                                onClick={() => handleApprove(item.id)}
                                className="p-1 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                disabled={isApproving === item.id}
                                onClick={() => {
                                  if (expandedItem === item.id) setExpandedItem(null)
                                  else {
                                    setExpandedItem(item.id)
                                    setRejectionReason('')
                                  }
                                }}
                                className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                          
                          {expandedItem === item.id && (
                            <div className="mt-2 pt-2 border-t border-[#3F3F46] flex flex-col gap-2">
                              <input
                                type="text"
                                placeholder="Motivo da rejeição..."
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="w-full bg-[#18181B] text-xs text-white p-1.5 rounded border border-[#3F3F46] focus:outline-none focus:border-red-500"
                              />
                              <button
                                onClick={() => handleReject(item.id)}
                                disabled={!rejectionReason.trim() || isApproving === item.id}
                                className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold py-1 px-2 rounded hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                              >
                                Confirmar Rejeição
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
