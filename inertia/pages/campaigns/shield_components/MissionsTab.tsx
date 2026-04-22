import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  ArrowLeft, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  MapPin,
  ClipboardList,
  UserPlus,
  Package,
  Play,
  FileText,
  Eye,
  EyeOff,
  Ghost
} from 'lucide-react'
import NpcNotesModal from './NpcNotesModal'
import ClueNotesModal from './ClueNotesModal'
import RoomItemModal from './RoomItemModal'
import MonsterFormModal from './MonsterFormModal'

interface Mission {
  id: number
  name: string
  description: string | null
  status: 'inactive' | 'active' | 'completed'
  rooms: Room[]
}

interface Room {
  id: number
  missionId: number
  name: string
  description: string | null
  state: 'unvisited' | 'active' | 'explored'
  roomClues: Clue[]
  roomItems: Item[]
  roomNpcs: Npc[]
  roomMonsters: any[]
}

interface Clue {
  id: number
  content: string
  revealed: boolean
}

interface Item {
  id: number
  name: string
  description: string | null
  quantity: number
  itemType?: string
  catalogItemId?: number | null
  homebrewItemId?: number | null
  collected?: boolean
  collectedByCharacterId?: number | null
}

interface Npc {
  id: number
  name: string
  notes: string | null
  quantity: number
  isMonster: boolean
}

interface MissionsTabProps {
  campaignId: number
  campaignCharacters: { id: number; name: string }[]
  onEndScene: () => void
  homebrewItems: any[]
  campaignMonsters: any[]
  setActiveTab: (tab: string) => void
}

export default function MissionsTab({ campaignId, campaignCharacters, onEndScene, homebrewItems, campaignMonsters, setActiveTab }: MissionsTabProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [localHomebrewItems, setLocalHomebrewItems] = useState<any[]>(homebrewItems || [])
  
  useEffect(() => {
    setLocalHomebrewItems(homebrewItems || [])
  }, [homebrewItems])
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Modais e inputs simples
  const [isCreatingMission, setIsCreatingMission] = useState(false)
  const [newMissionName, setNewMissionName] = useState('')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  
  // Estados para NPCs
  const [npcModalOpen, setNpcModalOpen] = useState(false)
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null)
  const [newNpcIsMonster, setNewNpcIsMonster] = useState(false)

  // Estados para Monstros e Combate
  const [isCombatModalOpen, setIsCombatModalOpen] = useState(false)
  const [selectedMonstersForCombat, setSelectedMonstersForCombat] = useState<Record<number, boolean>>({})
  const [showMonsterSelect, setShowMonsterSelect] = useState(false)

  // Estados para Pistas (Restaurados)
  const [clueModalOpen, setClueModalOpen] = useState(false)
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)

  // Estados para Itens e Catálogos
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemModalMode, setItemModalMode] = useState<'add' | 'collect'>('add')
  const [itemToCollect, setItemToCollect] = useState<Item | null>(null)
  const [catalogWeapons, setCatalogWeapons] = useState([])
  const [catalogProtections, setCatalogProtections] = useState([])
  const [catalogAmmunitions, setCatalogAmmunitions] = useState([])
  const [catalogGeneralItems, setCatalogGeneralItems] = useState([])

  // Estados para Edição de Instância de Monstro
  const [editingInstance, setEditingInstance] = useState<any>(null)
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false)

  useEffect(() => {
    fetchMissions()
    fetchCatalogs()
  }, [campaignId])

  const fetchCatalogs = async () => {
    try {
      // Carregar catálogos do novo endpoint
      const { data } = await axios.get('/api/catalogs')
      setCatalogWeapons(data.weapons || [])
      setCatalogProtections(data.protections || [])
      setCatalogAmmunitions(data.ammunitions || [])
      setCatalogGeneralItems(data.generalItems || [])
    } catch (e) {
      console.error('[CATALOGS] Erro ao carregar dados:', e)
    }
  }

  const fetchMissions = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/campaigns/${campaignId}/missions`)
      setMissions(response.data.missions || [])
      
      // Atualizar missão selecionada se ela já existir no estado
      if (selectedMission) {
        const updated = (response.data.missions || []).find((m: Mission) => m.id === selectedMission.id)
        if (updated) setSelectedMission(updated)
      }
    } catch (error) {
      console.error('[MISSIONS] Erro ao carregar missões:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMission = async () => {
    if (!newMissionName.trim()) return
    try {
      const res = await axios.post(`/api/campaigns/${campaignId}/missions`, { name: newMissionName })
      setMissions([...missions, res.data.mission])
      setNewMissionName('')
      setIsCreatingMission(false)
    } catch (e) {
      console.error('[MISSIONS] Erro ao criar missão:', e)
    }
  }

  const handleUpdateMissionStatus = async (missionId: number, status: string) => {
    try {
      await axios.put(`/api/campaigns/${campaignId}/missions/${missionId}`, { status })
      fetchMissions()
    } catch (e) {
      console.error('[MISSIONS] Erro ao atualizar status:', e)
    }
  }

  const handleCreateRoom = async (missionId: number) => {
    if (!newRoomName.trim()) return
    try {
      await axios.post(`/api/campaigns/${campaignId}/missions/${missionId}/rooms`, { name: newRoomName })
      setNewRoomName('')
      setIsCreatingRoom(false)
      fetchMissions()
    } catch (e) {
      console.error('[ROOMS] Erro ao criar sala:', e)
    }
  }

  const handleUpdateRoom = async (roomId: number, data: any) => {
    try {
      await axios.put(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${roomId}`, data)
      fetchMissions()
    } catch (e) {
      console.error('[ROOMS] Erro ao atualizar sala:', e)
    }
  }

  const handleAddClue = async (roomId: number) => {
    const content = prompt('Conteúdo da Pista:')
    if (!content) return
    try {
      await axios.post(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${roomId}/clues`, { content })
      fetchMissions()
    } catch (e) {
      console.error('[CLUES] Erro ao adicionar pista:', e)
    }
  }

  const handleDeleteClue = async (clueId: number) => {
    if (!confirm('Deletar pista?')) return
    try {
      await axios.delete(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/clues/${clueId}`)
      fetchMissions()
    } catch (e) {
      console.error('[CLUES] Erro ao deletar pista:', e)
    }
  }

  const handleSaveClue = async (clueId: number, data: { content: string; revealed: boolean }) => {
    try {
      await axios.put(
        `/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${activeRoomId}/clues/${clueId}`,
        data
      )
      // Atualiza localmente
      setSelectedMission(prev => {
        if (!prev) return prev
        return {
          ...prev,
          rooms: (prev.rooms ?? []).map(r => r.id === activeRoomId ? {
            ...r,
            roomClues: (r.roomClues ?? []).map(c => c.id === clueId ? { ...c, ...data } : c)
          } : r)
        }
      })
    } catch (e) {
      console.error('[CLUES] Erro ao salvar pista:', e)
    }
  }

  const handleAddItem = async (data: any) => {
    try {
      await axios.post(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${activeRoomId}/items`, data)
      fetchMissions()
    } catch (e) {
      console.error('[ITEMS] Erro ao adicionar item:', e)
    }
  }

  const handleCollectItem = (item: Item) => {
    setItemToCollect(item)
    setItemModalMode('collect')
    setItemModalOpen(true)
  }

  const handlePerformCollect = async (itemId: number, characterId: number) => {
    try {
      await axios.post(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${activeRoomId}/items/${itemId}/collect`, {
        characterId
      })
      
      // Atualiza localmente
      setSelectedMission(prev => {
        if (!prev) return prev
        return {
          ...prev,
          rooms: (prev.rooms ?? []).map(r => r.id === activeRoomId ? {
            ...r,
            roomItems: (r.roomItems ?? []).map(i => i.id === itemId ? {
              ...i,
              collected: true,
              collectedByCharacterId: characterId
            } : i)
          } : r)
        }
      })

      setItemToCollect(null)
      setItemModalOpen(false)
    } catch (e) {
      console.error('[ITEMS] Erro ao coletar item:', e)
      alert('Erro ao coletar item. Verifique os logs do console.')
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Deletar item?')) return
    try {
      await axios.delete(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/items/${itemId}`)
      fetchMissions()
    } catch (e) {
      console.error('[ITEMS] Erro ao deletar item:', e)
    }
  }

  const handleAddMonsterToRoom = async (monsterId: number) => {
    try {
      await router.post(`/rooms/${activeRoomId}/monsters`, { monsterId, quantity: 1 })
      fetchMissions()
      setShowMonsterSelect(false)
    } catch (e) {
      console.error('[MONSTERS] Erro ao adicionar monstro:', e)
    }
  }

  const handleUpdateMonsterQuantity = async (id: number, quantity: number) => {
    try {
      await router.patch(`/room-monsters/${id}`, { quantity })
      fetchMissions()
    } catch (e) {
      console.error('[MONSTERS] Erro ao atualizar quantidade:', e)
    }
  }

  const handleRemoveMonster = async (id: number) => {
    try {
      await router.delete(`/room-monsters/${id}`)
      fetchMissions()
    } catch (e) {
      console.error('[MONSTERS] Erro ao remover monstro:', e)
    }
  }

  const handleStartRoomCombat = async () => {
    const monstersToInclude = activeRoom?.roomMonsters
      .filter(rm => selectedMonstersForCombat[rm.id])
      .map(rm => ({ roomMonsterId: rm.id, initiative: 0 }))

    try {
      await router.post(`/campaigns/${campaignId}/combats`, {
        roomId: activeRoomId,
        monsterParticipantIds: monstersToInclude
      }, {
        onSuccess: () => {
          setIsCombatModalOpen(false)
          setActiveTab('combate')
        }
      })
    } catch (e) {
      console.error('[COMBAT] Erro ao iniciar combate:', e)
    }
  }

  const handleSaveNpcNotes = async (npcId: number, notes: string) => {
    try {
      await axios.put(
        `/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${activeRoomId}/npcs/${npcId}`,
        { notes }
      )
      // Atualiza localmente para feedback instantâneo
      setSelectedMission(prev => {
        if (!prev) return prev
        return {
          ...prev,
          rooms: (prev.rooms ?? []).map(r => r.id === activeRoomId ? {
            ...r,
            roomNpcs: (r.roomNpcs ?? []).map(n => n.id === npcId ? { ...n, notes } : n)
          } : r)
        }
      })
    } catch (e) {
      console.error('[NPCS] Erro ao salvar notas:', e)
    }
  }

  const handleDeleteNpc = async (npcId: number) => {
    if (!confirm('Deletar NPC?')) return
    try {
      await axios.delete(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/npcs/${npcId}`)
      fetchMissions()
    } catch (e) {
      console.error('[NPCS] Erro ao deletar NPC:', e)
    }
  }

  const activeRoom = selectedMission?.rooms?.find(r => r.id === activeRoomId)

  if (isLoading && missions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[#A1A1AA]">
        <div className="animate-spin mr-2"><Clock size={20} /></div>
        Carregando missões...
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedMission ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-6 overflow-y-auto"
          >
            {/* Header Lista */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Missões</h2>
              <button 
                onClick={() => setIsCreatingMission(true)}
                className="flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-900/20"
              >
                <Plus size={18} /> Nova Missão
              </button>
            </div>

            {/* Modal Simples Criação Missão */}
            {isCreatingMission && (
              <div className="bg-[#18181B] border border-[#27272A] p-4 rounded-xl mb-6 flex gap-3">
                <input 
                  autoFocus
                  className="flex-1 bg-[#09090B] border border-[#27272A] rounded-lg px-4 text-white text-sm focus:outline-none focus:border-[#F97316]"
                  placeholder="Nome da Missão..."
                  value={newMissionName}
                  onChange={e => setNewMissionName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateMission()}
                />
                <button onClick={handleCreateMission} className="bg-[#F97316] p-2 rounded-lg text-white"><CheckCircle2 /></button>
                <button onClick={() => setIsCreatingMission(false)} className="bg-[#27272A] p-2 rounded-lg text-white"><Trash2 /></button>
              </div>
            )}

            {/* Grid de Missões */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.map(mission => (
                <motion.div 
                  layoutId={`mission-${mission.id}`}
                  key={mission.id}
                  onClick={() => {
                    setSelectedMission(mission)
                    if ((mission.rooms?.length ?? 0) > 0) setActiveRoomId(mission.rooms[0].id)
                  }}
                  className="bg-[#18181B] border border-[#27272A] hover:border-[#F97316]/50 rounded-2xl p-5 cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                      mission.status === 'active' ? 'bg-[#F97316]/20 text-[#F97316]' :
                      mission.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-zinc-700/50 text-zinc-400'
                    }`}>
                      {mission.status === 'active' ? 'Ativa' : mission.status === 'completed' ? 'Concluída' : 'Inativa'}
                    </div>
                    <div className="text-[#3F3F46] group-hover:text-[#F97316] transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">{mission.name}</h3>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#27272A]">
                    <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                      <MapPin size={14} className="text-[#F97316]" />
                      <span>{(mission.rooms?.length ?? 0)} Salas</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            layoutId={`mission-${selectedMission.id}`}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Header Detalhado */}
            <div className="bg-[#18181B] border-b border-[#27272A] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedMission(null)}
                  className="p-2 hover:bg-[#27272A] rounded-lg text-[#A1A1AA] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{selectedMission.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {['inactive', 'active', 'completed'].map(s => (
                      <button 
                        key={s}
                        onClick={() => handleUpdateMissionStatus(selectedMission.id, s)}
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded transition-all ${
                          selectedMission.status === s ? 
                          (s === 'active' ? 'bg-[#F97316] text-[#09090B]' : s === 'completed' ? 'bg-emerald-500 text-[#09090B]' : 'bg-zinc-500 text-[#09090B]') : 
                          'bg-[#27272A] text-[#71717A] hover:text-white'
                        }`}
                      >
                        {s === 'active' ? 'Ativa' : s === 'completed' ? 'Concluída' : 'Inativa'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={onEndScene}
                  className="flex items-center gap-2 bg-[#27272A] hover:bg-red-900/40 text-[#A1A1AA] hover:text-red-400 px-4 py-2 rounded-lg font-bold text-xs transition-all border border-transparent hover:border-red-900/50"
                >
                  <Play size={14} /> Fim de Cena
                </button>
                <button 
                  onClick={() => setIsCreatingRoom(true)}
                  className="flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg shadow-orange-900/10"
                >
                  <Plus size={16} /> Nova Sala
                </button>
                {activeRoom && (
                  <button 
                    onClick={() => {
                      const initialSelection: Record<number, boolean> = {}
                      activeRoom.roomMonsters?.forEach(rm => initialSelection[rm.id] = true)
                      setSelectedMonstersForCombat(initialSelection)
                      setIsCombatModalOpen(true)
                    }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg shadow-red-900/20"
                  >
                    <Play size={14} /> Iniciar Combate
                  </button>
                )}
              </div>
            </div>

            {/* Barra de Salas (Tabs) */}
            <div className="bg-[#09090B] border-b border-[#27272A] flex overflow-x-auto no-scrollbar scroll-smooth">
              {(selectedMission.rooms ?? []).map(room => (
                <button 
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border-b-2 relative ${
                    activeRoomId === room.id ? 'text-[#F97316] border-[#F97316] bg-[#F97316]/5' : 'text-[#71717A] border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {room.name}
                  <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                    room.state === 'active' ? 'bg-[#F97316] pulse-orange' :
                    room.state === 'explored' ? 'bg-emerald-500' :
                    'bg-zinc-700'
                  }`} />
                </button>
              ))}
              {isCreatingRoom && (
                <div className="flex items-center px-4 gap-2 min-w-[200px]">
                  <input 
                    autoFocus
                    className="bg-transparent border-b border-[#F97316] text-white text-xs py-1 focus:outline-none w-full font-bold"
                    placeholder="Nome da sala..."
                    value={newRoomName}
                    onChange={e => setNewRoomName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateRoom(selectedMission.id)}
                  />
                  <button onClick={() => setIsCreatingRoom(false)} className="text-zinc-500"><Trash2 size={12} /></button>
                </div>
              )}
            </div>

            {/* Conteúdo da Sala */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#09090B]">
              <AnimatePresence mode="wait">
                {activeRoom ? (
                  <motion.div 
                    key={activeRoom.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-6xl mx-auto space-y-8"
                  >
                    {/* LINHA 1: Descrição e Estado */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#F97316] uppercase tracking-widest flex items-center gap-2">
                          <ClipboardList size={14} /> Descrição da Sala
                        </label>
                        <textarea 
                          className="w-full h-32 bg-[#18181B] border border-[#27272A] rounded-xl p-4 text-zinc-300 text-sm focus:outline-none focus:border-[#F97316]/50 transition-colors resize-none leading-relaxed"
                          placeholder="O que os jogadores veem e sentem ao entrar..."
                          value={activeRoom.description || ''}
                          onChange={e => handleUpdateRoom(activeRoom.id, { description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#F97316] uppercase tracking-widest flex items-center gap-2">
                          <Play size={14} /> Estado da Sala
                        </label>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: 'unvisited', label: 'Não Visitada', icon: <Clock size={14} /> },
                            { value: 'active', label: 'Ativa / Atual', icon: <Play size={14} /> },
                            { value: 'explored', label: 'Explorada', icon: <CheckCircle2 size={14} /> }
                          ].map(pill => (
                            <button 
                              key={pill.value}
                              onClick={() => handleUpdateRoom(activeRoom.id, { state: pill.value })}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                                activeRoom.state === pill.value ? 
                                'bg-[#F97316]/10 border-[#F97316] text-white' : 
                                'bg-[#18181B] border-[#27272A] text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {pill.icon}
                                {pill.label}
                              </div>
                              {activeRoom.state === pill.value && <div className="w-2 h-2 bg-[#F97316] rounded-full shadow-[0_0_8px_#F97316]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* LINHA 2: Pistas, Itens, NPCs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      
                      {/* Pistas */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#F97316]/20 pb-2">
                          <h4 className="text-[10px] font-black text-[#F97316] uppercase tracking-widest flex items-center gap-2">
                            <Search size={14} /> Pistas / Segredos
                          </h4>
                          <button onClick={() => handleAddClue(activeRoom.id)} className="p-1 hover:bg-[#18181B] rounded text-[#F97316]"><Plus size={16} /></button>
                        </div>
                        <div className="space-y-2">
                          {(activeRoom.roomClues ?? []).map(clue => (
                            <div key={clue.id} className="group bg-[#18181B] border border-[#27272A] p-3 rounded-lg flex justify-between items-center transition-all hover:border-[#F97316]/30">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                  onClick={async () => {
                                    await axios.put(
                                      `/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${activeRoom?.id}/clues/${clue.id}`,
                                      { content: clue.content, revealed: !clue.revealed }
                                    )
                                    setSelectedMission(prev => {
                                      if (!prev) return prev
                                      return {
                                        ...prev,
                                        rooms: prev.rooms.map(r => r.id === activeRoom?.id ? {
                                          ...r,
                                          roomClues: (r.roomClues ?? []).map(c => 
                                            c.id === clue.id ? { ...c, revealed: !c.revealed } : c
                                          )
                                        } : r)
                                      }
                                    })
                                  }}
                                  className="text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                                >
                                  {clue.revealed ? <Eye size={14} className="text-emerald-400" /> : <EyeOff size={14} />}
                                </button>
                                <div className="text-xs text-zinc-400 truncate pr-4 prose-compact" dangerouslySetInnerHTML={{ __html: clue.content }} />
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => { setSelectedClue(clue); setClueModalOpen(true) }}
                                  className="text-[10px] text-zinc-500 hover:text-blue-400 transition-colors"
                                >
                                  📝 Editar
                                </button>
                                <button onClick={() => handleDeleteClue(clue.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                          {(activeRoom.roomClues?.length ?? 0) === 0 && <p className="text-[10px] text-zinc-700 italic">Nenhuma pista cadastrada.</p>}
                        </div>
                      </div>

                      {/* Itens */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#F97316]/20 pb-2">
                          <h4 className="text-[10px] font-black text-[#F97316] uppercase tracking-widest flex items-center gap-2">
                            <Package size={14} /> Itens de Cena
                          </h4>
                          <button onClick={() => setItemModalOpen(true)} className="p-1 hover:bg-[#18181B] rounded text-[#F97316]"><Plus size={16} /></button>
                        </div>
                        <div className="space-y-2">
                          {(activeRoom.roomItems ?? []).map(item => (
                            <div key={item.id} className={`group bg-[#18181B] border ${item.collected ? 'border-emerald-500/30 opacity-50' : 'border-[#27272A]'} p-3 rounded-lg flex justify-between items-center transition-all`}>
                              <div className="overflow-hidden">
                                <h5 className="text-xs font-bold text-white flex items-center gap-2">
                                  {item.collected && <CheckCircle2 size={12} className="text-emerald-400" />}
                                  {item.name}
                                </h5>
                                {item.collected && (
                                  <p className="text-[9px] text-emerald-400 font-bold uppercase mt-1">
                                    Coletado por {campaignCharacters.find(c => c.id === item.collectedByCharacterId)?.name || 'Agente'}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                 {!item.collected && (
                                   <button 
                                     onClick={() => handleCollectItem(item)}
                                     className="text-[9px] font-black uppercase text-[#F97316] hover:text-white transition-colors border border-[#F97316]/30 px-2 py-0.5 rounded"
                                   >
                                     Coletar
                                   </button>
                                 )}
                                <span className="bg-[#09090B] px-2 py-0.5 rounded text-[10px] font-mono text-[#F97316]">x{item.quantity}</span>
                                <button onClick={() => handleDeleteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                          {(activeRoom.roomItems?.length ?? 0) === 0 && <p className="text-[10px] text-zinc-700 italic">Nenhum item na sala.</p>}
                        </div>
                      </div>

                      {/* Monstros (Bestiário) */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-red-500/20 pb-2">
                          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                            <Ghost size={14} /> Criaturas / Combate
                          </h4>
                          <button 
                            onClick={() => setShowMonsterSelect(!showMonsterSelect)} 
                            className="p-1 hover:bg-[#18181B] rounded text-red-500 flex items-center gap-1 text-[10px] font-bold"
                          >
                            <Plus size={14} /> Adicionar
                          </button>
                        </div>
                        
                        {showMonsterSelect && (
                          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {campaignMonsters.map(m => (
                              <button
                                key={m.id}
                                onClick={() => handleAddMonsterToRoom(m.id)}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#27272A] text-xs transition-colors flex justify-between items-center"
                              >
                                <span className="font-bold text-zinc-300">{m.name}</span>
                                <span className="text-[10px] text-zinc-500 uppercase">{m.type} (VD {m.vd})</span>
                              </button>
                            ))}
                            {campaignMonsters.length === 0 && (
                              <p className="p-3 text-center text-xs text-zinc-600">Nenhum monstro no bestiário.</p>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          {(activeRoom.roomMonsters ?? []).map(rm => (
                            <div key={rm.id} className="group bg-[#18181B] border border-[#27272A] p-3 rounded-lg flex justify-between items-center hover:border-red-500/30 transition-all">
                              <div className="flex-1">
                                <h5 className="text-xs font-bold text-white uppercase">{rm.monster?.name}</h5>
                                <p className="text-[9px] text-zinc-500 flex gap-2">
                                  <span>🛡️ {rm.monster?.defense}</span>
                                  <span>❤️ {rm.monster?.hpMax}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-[#09090B] px-2 py-0.5 rounded border border-[#27272A]">
                                  <button onClick={() => handleUpdateMonsterQuantity(rm.id, rm.quantity - 1)} className="text-zinc-500 hover:text-white transition-colors">－</button>
                                  <span className="text-[10px] font-black text-red-500 min-w-[20px] text-center">x{rm.quantity}</span>
                                  <button onClick={() => handleUpdateMonsterQuantity(rm.id, rm.quantity + 1)} className="text-zinc-500 hover:text-white transition-colors">＋</button>
                                </div>
                                <button 
                                  onClick={() => { setEditingInstance(rm); setIsInstanceModalOpen(true) }}
                                  className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors px-1"
                                >
                                  📝
                                </button>
                                <button onClick={() => handleRemoveMonster(rm.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                          {(activeRoom.roomMonsters?.length ?? 0) === 0 && <p className="text-[10px] text-zinc-700 italic">Nenhuma criatura hostil.</p>}
                        </div>
                      </div>

                      {/* NPCs (Sociais) */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-blue-500/20 pb-2">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <UserPlus size={14} /> NPCs Sociais
                          </h4>
                          <button 
                            onClick={async () => {
                              const name = prompt('Nome do NPC:')
                              if (!name) return
                              await axios.post(`/api/campaigns/${campaignId}/missions/${selectedMission?.id}/rooms/${activeRoomId}/npcs`, { name, notes: '', quantity: 1, is_monster: false })
                              fetchMissions()
                            }} 
                            className="p-1 hover:bg-[#18181B] rounded text-blue-500 flex items-center gap-1 text-[10px] font-bold"
                          >
                            <Plus size={14} /> Adicionar
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {(activeRoom.roomNpcs ?? []).filter(npc => !npc.isMonster).map(npc => (
                            <div key={npc.id} className="group bg-[#18181B] border border-[#27272A] p-3 rounded-lg flex justify-between items-center hover:border-blue-500/30 transition-all">
                              <div>
                                <h5 className="text-xs font-bold text-white uppercase">{npc.name}</h5>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => { setSelectedNpc(npc); setNpcModalOpen(true) }}
                                  className="text-[10px] text-zinc-500 hover:text-blue-400 transition-colors px-2 flex items-center gap-1"
                                >
                                  <FileText size={12} /> Notas
                                </button>
                                <button onClick={() => handleDeleteNpc(npc.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                          {(activeRoom.roomNpcs?.filter(n => !n.isMonster).length ?? 0) === 0 && <p className="text-[10px] text-zinc-700 italic">Nenhum civil por aqui.</p>}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4 pt-20">
                    <AlertCircle size={48} className="opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">Selecione ou crie uma sala para começar</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <NpcNotesModal
              isOpen={npcModalOpen}
              onClose={() => setNpcModalOpen(false)}
              npc={selectedNpc}
              onSave={handleSaveNpcNotes}
            />

            <ClueNotesModal
              isOpen={clueModalOpen}
              onClose={() => setClueModalOpen(false)}
              clue={selectedClue}
              onSave={handleSaveClue}
            />

            <RoomItemModal 
              isOpen={itemModalOpen}
              onClose={() => {
                setItemModalOpen(false)
                setItemToCollect(null)
              }}
              mode={itemModalMode}
              itemToCollect={itemToCollect}
              campaignCharacters={campaignCharacters}
              onAdd={handleAddItem}
              onCollect={handlePerformCollect}
              catalogWeapons={catalogWeapons}
              catalogProtections={catalogProtections}
              catalogAmmunitions={catalogAmmunitions}
              catalogGeneralItems={catalogGeneralItems}
              homebrewItems={localHomebrewItems}
              onHomebrewCreated={(newItem) => {
                setLocalHomebrewItems(prev => [...prev, newItem])
              }}
            />

            <MonsterFormModal
              isOpen={isInstanceModalOpen}
              onClose={() => { setIsInstanceModalOpen(false); setEditingInstance(null) }}
              monster={editingInstance}
              campaignId={campaignId}
              mode="room-instance"
            />

            {/* Modal de Iniciar Combate */}
            <AnimatePresence>
              {isCombatModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 w-full max-w-md shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                        <Ghost size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white leading-none">Iniciar Combate</h3>
                        <p className="text-xs text-zinc-500 mt-1">Selecione as criaturas da sala que entrarão no combate.</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-8 max-h-64 overflow-y-auto custom-scrollbar">
                      {activeRoom?.roomMonsters?.map(rm => (
                        <label 
                          key={rm.id} 
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedMonstersForCombat[rm.id] ? 'bg-red-500/5 border-red-500/50 text-white' : 'bg-[#09090B] border-[#27272A] text-zinc-500'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase">{rm.monster?.name}</span>
                            <span className="text-[10px] opacity-70">Quantidade: {rm.quantity}</span>
                          </div>
                          <input 
                            type="checkbox"
                            checked={!!selectedMonstersForCombat[rm.id]}
                            onChange={(e) => setSelectedMonstersForCombat(prev => ({ ...prev, [rm.id]: e.target.checked }))}
                            className="accent-red-500 h-4 w-4"
                          />
                        </label>
                      ))}
                      {activeRoom?.roomMonsters?.length === 0 && (
                        <p className="text-center py-4 text-xs text-zinc-600">Nenhum monstro cadastrado nesta sala.</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsCombatModalOpen(false)}
                        className="flex-1 px-4 py-2 rounded-lg font-bold text-xs text-zinc-400 hover:bg-[#27272A] transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleStartRoomCombat}
                        disabled={!Object.values(selectedMonstersForCombat).some(v => v)}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg shadow-red-900/20"
                      >
                        Iniciar Agora
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .pulse-orange {
          box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
      `}</style>
    </div>
  )
}
