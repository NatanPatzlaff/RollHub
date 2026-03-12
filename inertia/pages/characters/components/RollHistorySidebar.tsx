import { m, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, AlertTriangle, XCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { Button } from '@heroui/react'

interface RollEntry {
  id: string | number
  player: string
  action: string
  roll: string
  result: number
  time: string
  isCritical?: boolean
  isFail?: boolean
  isGM?: boolean
}

interface RollHistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  rolls: RollEntry[]
  onClear: () => void
}

export default function RollHistorySidebar({ isOpen, onClose, rolls, onClear }: RollHistorySidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="h-full w-80 md:w-96 bg-[#09090B] border-l border-zinc-800 shadow-2xl flex flex-col shrink-0"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-purple-500" />
              <h2 className="font-bold text-white tracking-tight">Histórico de Rolagens</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-zinc-500 hover:text-red-400"
                onPress={onClear}
                title="Limpar Histórico"
              >
                <Trash2 size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-zinc-500 hover:text-white"
                onPress={onClose}
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-[#09090B]">
            {rolls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                <MessageSquare size={48} className="mb-2" />
                <p className="text-sm">Nenhuma rolagem ainda</p>
              </div>
            ) : (
              rolls.map((roll, idx) => {
                let borderColor = 'border-zinc-800'
                let icon = null
                let textColor = 'text-white'

                if (roll.isCritical) {
                  borderColor = 'border-amber-500/50 bg-amber-500/5'
                  icon = <AlertTriangle size={14} className="text-amber-500" />
                  textColor = 'text-amber-500 font-black'
                } else if (roll.isFail) {
                  borderColor = 'border-red-500/50 bg-red-500/5'
                  icon = <XCircle size={14} className="text-red-500" />
                  textColor = 'text-red-500 font-bold'
                } else {
                  icon = <CheckCircle2 size={14} className="text-emerald-500" />
                }

                if (roll.isGM) {
                  borderColor = 'border-purple-500/50 bg-purple-500/5'
                }

                return (
                  <m.div 
                    key={roll.id || idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-zinc-900/50 border ${borderColor} rounded-xl p-3 text-sm relative group overflow-hidden`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold text-sm tracking-wider ${roll.isGM ? 'text-purple-400' : 'text-zinc-300'}`}>
                        {roll.player}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">{roll.time}</span>
                    </div>
                    
                    <div className="text-zinc-400 mb-2 font-medium text-xs uppercase tracking-tighter">{roll.action}</div>
                    
                    <div className="flex justify-between items-center bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/50 shadow-inner">
                      <span className="text-xs text-zinc-500 font-mono tracking-tighter">{roll.roll}</span>
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className={`text-2xl tracking-tighter ${textColor}`}>{roll.result}</span>
                      </div>
                    </div>
                  </m.div>
                )
              })
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
