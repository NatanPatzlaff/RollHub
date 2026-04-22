import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, Zap, ArrowRight, Shield, UserPlus, Ghost } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Button, Progress, Input, Select, SelectItem } from '@heroui/react'

interface CombatTabProps {
  campaignId: number
  activeCombat: any
  monsters: any[]
  characters: any[]
}

export default function CombatTab({ campaignId, activeCombat, monsters, characters }: CombatTabProps) {
  const [damageValues, setDamageValues] = useState<Record<number, number>>({})
  const [damageTypes, setDamageTypes] = useState<Record<number, string>>({})
  const [isAddingParticipant, setIsAddingParticipant] = useState(false)
  const [newParticipant, setNewParticipant] = useState({
    type: 'character',
    entityId: '',
    initiative: 0,
  })

  const damageTypesList = [
    'Físico', 'Corte', 'Impacto', 'Perfuração', 'Balístico',
    'Sangue', 'Morte', 'Conhecimento', 'Energia', 'Medo',
    'Fogo', 'Frio', 'Elétrico', 'Químico', 'Psíquico'
  ]

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

  const handleApplyDamage = (participantId: number) => {
    const rawDamage = damageValues[participantId] || 0
    const damageType = damageTypes[participantId] || 'Físico'
    
    if (rawDamage === 0) return

    router.patch(`/combat-participants/${participantId}/damage`, {
      rawDamage,
      damageType
    }, {
      onSuccess: () => {
        setDamageValues(prev => ({ ...prev, [participantId]: 0 }))
      }
    })
  }

  const handleUpdateInitiative = (participantId: number, initiative: number) => {
    router.patch(`/combat-participants/${participantId}/initiative`, { initiative })
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

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {activeCombat.participants?.sort((a: any, b: any) => b.initiative - a.initiative).map((participant: any) => {
          const isTurn = activeCombat.currentParticipantId === participant.id
          const isMonster = !!participant.monsterId
          const hpPercent = (participant.hpCurrent / participant.hpMax) * 100

          return (
            <motion.div 
              key={participant.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-[#09090B] border-2 rounded-xl p-4 transition-all ${isTurn ? 'border-[#F97316] ring-1 ring-[#F97316]/30' : 'border-[#27272A]'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isMonster ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                  {isMonster ? <Ghost size={24} /> : <Shield size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-white truncate text-lg">{participant.name}</h4>
                      <p className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">
                        {isMonster ? 'Criatura' : 'Jogador'} • Iniciativa: 
                        <input 
                          type="number" 
                          value={participant.initiative}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            handleUpdateInitiative(participant.id, val)
                          }}
                          className="bg-transparent border-0 w-10 px-1 text-[#F97316] font-black focus:outline-none focus:ring-0 text-left"
                        />
                      </p>
                    </div>
                    {isTurn && (
                      <span className="bg-[#F97316]/10 text-[#F97316] text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        <Zap size={10} /> Turno Atual
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[#A1A1AA]">PONTOS DE VIDA</span>
                      <span className={hpPercent <= 25 ? 'text-red-500' : 'text-zinc-300'}>
                        {participant.hpCurrent} / {participant.hpMax}
                      </span>
                    </div>
                    <Progress 
                      value={hpPercent} 
                      color={isMonster ? "danger" : "primary"}
                      size="sm"
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 bg-[#18181B] p-3 rounded-lg border border-[#27272A]">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Dano"
                      type="number"
                      size="sm"
                      value={String(damageValues[participant.id] || '')}
                      onChange={(e) => setDamageValues(prev => ({ ...prev, [participant.id]: parseInt(e.target.value) }))}
                      className="w-20"
                      classNames={{ input: "text-center font-mono font-bold" }}
                    />
                    <Select
                      size="sm"
                      className="w-32"
                      selectedKeys={damageTypes[participant.id] ? [damageTypes[participant.id]] : ['Físico']}
                      onSelectionChange={(keys) => setDamageTypes(prev => ({ ...prev, [participant.id]: Array.from(keys)[0] as string }))}
                    >
                      {damageTypesList.map(type => (
                        <SelectItem key={type}>{type}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Button 
                    size="sm" 
                    color="danger" 
                    className="w-full font-bold"
                    onPress={() => handleApplyDamage(participant.id)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
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
