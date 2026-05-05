import React from 'react'
import BaseModal from './BaseModal'
import { User, Sword, Activity } from 'lucide-react'

interface CombatParticipant {
  id: number
  name: string
  hpCurrent: number | null
  hpMax: number
  characterId: number | null
  monsterId: number | null
}

interface DotTargetModalProps {
  open: boolean
  onClose: () => void
  participants: CombatParticipant[]
  onConfirm: (participantId: number, isPlayer: boolean) => void
}

export default function DotTargetModal({ open, onClose, participants, onConfirm }: DotTargetModalProps) {
  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      title="Escolha o Alvo"
      description="Selecione o participante que sofrerá os efeitos do ritual a cada turno seu."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {participants.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-sm">
            Nenhum participante encontrado no combate.
          </div>
        ) : (
          participants.map((p) => {
            const isPlayer = !!p.characterId
            return (
              <button
                key={p.id}
                onClick={() => onConfirm(p.id, isPlayer)}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlayer ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                    {isPlayer ? <User size={20} /> : <Sword size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-100 group-hover:text-white transition-colors">
                      {p.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-500">
                      {isPlayer ? 'Jogador' : 'Ameaça'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-300">
                      {p.hpCurrent ?? 0} / {p.hpMax}
                    </span>
                  </div>
                  <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${Math.min(100, ((p.hpCurrent ?? 0) / p.hpMax) * 100)}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </BaseModal>
  )
}
