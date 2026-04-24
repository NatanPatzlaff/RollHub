import { useState } from 'react'
import { Swords, ArrowRight, UserPlus, Ghost } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Button, Input, Select, SelectItem } from '@heroui/react'
import MonsterCombatSheet from './MonsterCombatSheet'

interface CombatTabProps {
  campaignId: number
  activeCombat: any
  monsters: any[]
  characters: any[]
  selectedParticipantId: number | null
  dddiceRef?: any
  campaign?: any
}

export default function CombatTab({
  campaignId,
  activeCombat,
  monsters,
  characters,
  selectedParticipantId,
  dddiceRef,
  campaign,
}: CombatTabProps) {
  const [isAddingParticipant, setIsAddingParticipant] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    type: 'character',
    entityId: '',
    initiative: 0,
  })

  // Encontra o participante selecionado nos dados do combate
  const selectedParticipant = activeCombat?.participants?.find((p: any) => p.id === selectedParticipantId)

  const handleStartCombat = () => {
    router.post(`/campaigns/${campaignId}/combats`, {})
  }

  const handleEndCombat = () => {
    if (confirm('Deseja realmente encerrar este combate?')) {
      router.patch(`/combats/${activeCombat.id}/end`, {})
    }
  }

  const handleNextTurn = () => {
    router.patch(`/combats/${activeCombat.id}/next-turn`, {})
  }

  const handleAddParticipant = () => {
    if (!newParticipant.entityId) return

    const entity = newParticipant.type === 'character' 
      ? characters.find(c => c.id === Number(newParticipant.entityId))
      : monsters.find(m => m.id === Number(newParticipant.entityId))

    router.post(`/combats/${activeCombat.id}/participants`, {
      type: newParticipant.type,
      entityId: newParticipant.entityId,
      name: entity?.name || 'Desconhecido',
      initiative: newParticipant.initiative,
      hpMax: entity?.hpMax || entity?.stats?.maxHp || 0,
      hpCurrent: entity?.hpCurrent || entity?.stats?.currentHp || 0,
    }, {
      onSuccess: () => setIsAddingParticipant(false)
    })
  }

  if (!activeCombat) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 bg-[#18181B] border border-[#27272A] rounded-full flex items-center justify-center mb-6 text-[#A1A1AA]">
          <Swords size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sem Combates Ativos</h2>
        <p className="text-[#A1A1AA] max-w-sm mb-8">Role a iniciativa e prepare seus jogadores. Inicie um novo combate para rastrear turnos, dano e ordem de iniciativa.</p>
        <Button 
          color="primary" 
          size="lg" 
          className="font-bold"
          onPress={handleStartCombat}
        >
          Iniciar Novo Combate
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center bg-[#18181B] p-4 rounded-xl border border-[#27272A]">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-[#A1A1AA] font-bold block uppercase tracking-wider">Rodada</span>
            <span className="text-2xl font-black text-white">{activeCombat.round}</span>
          </div>
          <div className="h-10 w-px bg-[#27272A]" />
          <div>
            <span className="text-[10px] text-[#A1A1AA] font-bold block uppercase tracking-wider">Participantes</span>
            <span className="text-2xl font-black text-white">{activeCombat.participants?.length || 0}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="light" 
            onPress={() => setIsAddingParticipant(true)}
            className="text-zinc-400 font-bold"
            startContent={<UserPlus size={18} />}
          >
            Adicionar
          </Button>
          <Button 
            color="primary" 
            className="font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            onPress={handleNextTurn}
            endContent={<ArrowRight size={18} />}
          >
            Próximo Turno
          </Button>
          <Button 
            color="danger" 
            variant="flat"
            className="font-bold"
            onPress={handleEndCombat}
          >
            Encerrar
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedParticipant ? (
          <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <MonsterCombatSheet 
              participant={selectedParticipant} 
              dddiceRef={dddiceRef}
              campaign={campaign}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <div className="w-20 h-20 bg-[#18181B] border border-[#27272A] rounded-2xl flex items-center justify-center mb-4">
              <Ghost size={40} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-wider text-sm">Selecione um monstro para ver sua ficha</p>
          </div>
        )}
      </div>

      {/* Modal fake de adicionar participante no topo */}

      {isAddingParticipant && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Adicionar Participante</h3>
            <div className="space-y-4">
              <Select 
                label="Tipo"
                selectedKeys={[newParticipant.type]}
                onSelectionChange={(keys) => setNewParticipant(prev => ({ ...prev, type: Array.from(keys)[0] as string, entityId: '' }))}
              >
                <SelectItem key="character">Jogador</SelectItem>
                <SelectItem key="monster">Monstro</SelectItem>
              </Select>

              <Select 
                label={newParticipant.type === 'character' ? "Personagem" : "Monstro"}
                selectedKeys={newParticipant.entityId ? [newParticipant.entityId] : []}
                onSelectionChange={(keys) => setNewParticipant(prev => ({ ...prev, entityId: Array.from(keys)[0] as string }))}
              >
                {newParticipant.type === 'character' 
                  ? characters.map(c => <SelectItem key={c.id}>{c.name}</SelectItem>)
                  : monsters.map(m => <SelectItem key={m.id}>{m.name}</SelectItem>)
                }
              </Select>

              <Input 
                label="Iniciativa"
                type="number"
                value={String(newParticipant.initiative)}
                onChange={(e) => setNewParticipant(prev => ({ ...prev, initiative: parseInt(e.target.value) }))}
              />

              <div className="flex gap-2 pt-2">
                <Button fullWidth variant="flat" onPress={() => setIsAddingParticipant(false)}>Cancelar</Button>
                <Button fullWidth color="primary" className="font-bold" onPress={handleAddParticipant}>Adicionar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

