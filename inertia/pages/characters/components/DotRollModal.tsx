import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from '@heroui/react'
import { Flame, Dice6 } from 'lucide-react'

interface DotTarget {
  id: number
  name: string
  isPlayer: boolean
}

interface DotRollModalProps {
  open: boolean
  targets: DotTarget[]
  onRoll: (targetId: number, isPlayer: boolean, onSuccess: () => void) => void
  onClose: () => void
}

export default function DotRollModal({
  open,
  targets,
  onRoll,
  onClose,
}: DotRollModalProps) {
  const [rolledIds, setRolledIds] = useState<number[]>([])
  const [rollingIds, setRollingIds] = useState<number[]>([])

  // Resetar estados quando o modal abrir em um novo turno
  React.useEffect(() => {
    if (open) {
      setRolledIds([])
      setRollingIds([])
    }
  }, [open])

  const handleRoll = (id: number, isPlayer: boolean) => {
    setRollingIds((prev) => [...prev, id])
    
    onRoll(id, isPlayer, () => {
      // Este callback será chamado pelo show.tsx quando o dddice terminar
      setRollingIds((prev) => prev.filter(rid => rid !== id))
      setRolledIds((prev) => {
        const newRolledIds = [...prev, id]
        
        // Se todos foram rolados, fecha automaticamente após 1.5s
        if (targets.every(t => newRolledIds.includes(t.id))) {
          setTimeout(() => {
            onClose()
          }, 1500)
        }
        
        return newRolledIds
      })
    })
  }

  const allRolled = targets.every((t) => rolledIds.includes(t.id))

  return (
    <Modal 
      isOpen={open} 
      onClose={onClose} 
      isDismissable={false}
      hideCloseButton={true}
      className="bg-zinc-950 border border-orange-500/30 text-zinc-100"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-orange-400">
                <Flame size={20} className="animate-pulse" />
                <h3 className="text-xl font-bold uppercase tracking-wider">Ritual: Esquentar</h3>
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Role o dano por turno para cada alvo afetado.
              </p>
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="space-y-4">
                {targets.map((target) => {
                  const isRolled = rolledIds.includes(target.id)
                  return (
                    <div 
                      key={target.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isRolled 
                          ? 'bg-zinc-900/50 border-zinc-800 opacity-60' 
                          : 'bg-zinc-900 border-zinc-800 shadow-lg shadow-orange-950/5'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{target.name}</span>
                          {target.isPlayer && (
                            <Chip size="sm" variant="flat" color="primary" className="h-5 text-[10px]">JOGADOR</Chip>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Debuff Ativo</span>
                      </div>

                      <Button
                        size="sm"
                        color={isRolled ? "default" : "warning"}
                        variant={isRolled ? "flat" : "shadow"}
                        isDisabled={isRolled || rollingIds.includes(target.id)}
                        isLoading={rollingIds.includes(target.id)}
                        onPress={() => handleRoll(target.id, target.isPlayer)}
                        className="font-bold"
                        startContent={!isRolled && !rollingIds.includes(target.id) && <Dice6 size={14} />}
                      >
                        {isRolled ? 'Rolado' : rollingIds.includes(target.id) ? 'Rolando...' : 'Rolar 1d6'}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-zinc-800 justify-center">
              <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                {allRolled ? 'Finalizando...' : 'Aguardando rolagens...'}
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
