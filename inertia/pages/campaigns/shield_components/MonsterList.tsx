import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { Plus, Ghost, Edit3, Trash2, Shield, Heart, Search, ArrowDownAZ, Zap, Flame, Book, Droplet, Layers, FileQuestion, ChevronDown, ChevronUp, Swords, Globe } from 'lucide-react'
import { Button, Input, Select, SelectItem } from '@heroui/react'
import MonsterFormModal from './MonsterFormModal'
import { router, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'

interface MonsterListProps {
  monsters: any[]
  campaignId: number
}

const ELEMENTS = [
  { id: 'Todos', label: 'Todos', icon: Layers, color: 'text-zinc-400' },
  { id: 'Sangue', label: 'Sangue', icon: Droplet, color: 'text-red-500' },
  { id: 'Morte', label: 'Morte', icon: Ghost, color: 'text-zinc-300' },
  { id: 'Conhecimento', label: 'Conhecimento', icon: Book, color: 'text-yellow-500' },
  { id: 'Energia', label: 'Energia', icon: Zap, color: 'text-purple-500' },
  { id: 'Medo', label: 'Medo', icon: Flame, color: 'text-white' },
  { id: 'Realidade', label: 'Realidade', icon: Globe, color: 'text-blue-400' },
  { id: 'Homebrew', label: 'Homebrew', icon: FileQuestion, color: 'text-emerald-500' },
]

export default function MonsterList({ monsters, campaignId }: MonsterListProps) {
  const { activeCombat } = usePage().props as any

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMonster, setEditingMonster] = useState<any>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Controle de Missões/Salas para Adição
  const [missions, setMissions] = useState<any[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')

  // Filtros e ordenação
  const [selectedElement, setSelectedElement] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('vd-asc')

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await axios.get(`/api/campaigns/${campaignId}/missions`)
        setMissions(res.data.missions || [])
      } catch (e) {
        console.error('Erro ao buscar missões:', e)
      }
    }
    fetchMissions()
  }, [campaignId])

  const handleOpenCreate = () => {
    setEditingMonster(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (monster: any) => {
    setEditingMonster(monster)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Deletar esta criatura permanentemente?')) {
      router.delete(`/monsters/${id}`)
    }
  }

  const handleAddToCombat = (monster: any) => {
    if (!activeCombat) return alert('Nenhum combate ativo! Inicie um combate primeiro.')
    
    router.post(`/combats/${activeCombat.id}/participants`, {
      type: 'monster',
      entityId: String(monster.id),
      name: monster.name,
      initiative: 0,
      hpMax: monster.hpMax,
      hpCurrent: monster.hpCurrent,
    }, { preserveScroll: true })
  }

  const handleAddToRoom = (monsterId: number) => {
    if (!selectedRoomId) return alert('Selecione uma sala primeiro!')
    
    router.post(`/rooms/${selectedRoomId}/monsters`, {
      monsterId,
      quantity: 1
    }, {
      preserveScroll: true,
      onSuccess: () => alert('Monstro adicionado à sala com sucesso!')
    })
  }

  // Lógica de Filtro e Ordenação
  const processedMonsters = useMemo(() => {
    let result = [...monsters]

    // 1. Filtro por Elemento
    if (selectedElement !== 'Todos') {
      if (selectedElement === 'Homebrew') {
        result = result.filter(m => !m.element || m.element.trim() === '')
      } else {
        result = result.filter(m => m.element?.toLowerCase() === selectedElement.toLowerCase())
      }
    }

    // 2. Filtro por Busca
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(m => m.name.toLowerCase().includes(lowerQuery))
    }

    // 3. Ordenação
    result.sort((a, b) => {
      if (sortOption === 'vd-asc') return (a.vd || 0) - (b.vd || 0)
      if (sortOption === 'vd-desc') return (b.vd || 0) - (a.vd || 0)
      if (sortOption === 'alpha') return a.name.localeCompare(b.name)
      if (sortOption === 'element') {
        const elA = a.element || 'z'
        const elB = b.element || 'z'
        return elA.localeCompare(elB)
      }
      return 0
    })

    return result
  }, [monsters, selectedElement, searchQuery, sortOption])

  return (
    <div className="h-full flex gap-6">
      
      {/* Coluna Esquerda: Sidebar Elementos */}
      <div className="w-[200px] shrink-0 flex flex-col gap-2">
        <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest pl-2 mb-2">Elementos</h3>
        <div className="flex flex-col gap-1">
          {ELEMENTS.map(el => {
            const Icon = el.icon
            const isActive = selectedElement === el.id
            return (
              <button
                key={el.id}
                onClick={() => setSelectedElement(el.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-[#18181B] text-white border border-[#27272A] shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181B]/50 border border-transparent'
                }`}
              >
                <Icon size={16} className={isActive ? el.color : 'text-zinc-500'} />
                {el.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Coluna Direita: Toolbar + Lista */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B] border border-[#27272A] rounded-xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[#27272A] bg-[#101012] flex gap-4 items-center">
          <div className="flex-1">
            <Input 
              placeholder="Buscar criatura..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Search size={16} className="text-zinc-500" />}
              size="sm"
            />
          </div>
          <div className="w-48">
            <Select 
              size="sm"
              selectedKeys={[sortOption]}
              onSelectionChange={(keys) => setSortOption(Array.from(keys)[0] as string)}
              startContent={<ArrowDownAZ size={16} className="text-zinc-500" />}
              aria-label="Ordenar por"
            >
              <SelectItem key="vd-asc">VD: Menor p/ Maior</SelectItem>
              <SelectItem key="vd-desc">VD: Maior p/ Menor</SelectItem>
              <SelectItem key="element">Por Elemento</SelectItem>
              <SelectItem key="alpha">Ordem Alfabética</SelectItem>
            </Select>
          </div>
          <Button 
            color="primary" 
            startContent={<Plus size={16} />}
            className="font-bold"
            onPress={handleOpenCreate}
            size="sm"
          >
            Criar Criatura
          </Button>
        </div>

        {/* Lista de Criaturas */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {processedMonsters.length === 0 ? (
            <div className="py-16 text-center">
              <Ghost size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-medium">Nenhuma criatura encontrada para este filtro.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {processedMonsters.map(monster => {
                  const isExpanded = expandedId === monster.id
                  
                  return (
                    <motion.div 
                      key={monster.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`bg-[#18181B] border transition-colors rounded-xl overflow-hidden ${
                        isExpanded ? 'border-primary shadow-lg shadow-primary/10' : 'border-[#27272A] hover:border-zinc-700'
                      }`}
                    >
                      {/* Header Compacto (Sempre visível) */}
                      <button 
                        className="w-full text-left p-4 flex items-center justify-between focus:outline-none"
                        onClick={() => setExpandedId(isExpanded ? null : monster.id)}
                      >
                        <div>
                          <h3 className="text-lg font-bold text-white">{monster.name}</h3>
                          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
                            {monster.element || 'Homebrew'} {monster.type ? `• ${monster.type}` : ''} • VD {monster.vd || 0}
                          </p>
                        </div>
                        <div className="text-zinc-500">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </button>

                      {/* Corpo Expandido */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#101012] border-t border-[#27272A]"
                          >
                            <div className="p-4 space-y-4">
                              
                              {/* Status Base */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#09090B] p-2.5 rounded-lg border border-[#27272A] flex items-center gap-3">
                                  <div className="bg-red-500/10 p-2 rounded-md"><Heart size={16} className="text-red-500" /></div>
                                  <div>
                                    <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase tracking-widest">PV MÁX</span>
                                    <span className="text-lg font-black text-white">{monster.hpMax || 0}</span>
                                  </div>
                                </div>
                                <div className="bg-[#09090B] p-2.5 rounded-lg border border-[#27272A] flex items-center gap-3">
                                  <div className="bg-blue-500/10 p-2 rounded-md"><Shield size={16} className="text-blue-400" /></div>
                                  <div>
                                    <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase tracking-widest">DEFESA</span>
                                    <span className="text-lg font-black text-white">{monster.defense || 0}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Atributos */}
                              <div className="flex gap-2">
                                {['agi', 'str', 'int', 'pre', 'vig'].map(attr => (
                                  <div key={attr} className="flex-1 bg-[#18181B] py-1.5 rounded-lg text-center border border-[#27272A]">
                                    <span className="text-[9px] text-[#A1A1AA] font-bold block uppercase">{attr}</span>
                                    <span className="text-sm font-black text-white">{monster[attr] || 0}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Ataques Recentes */}
                              {monster.attacks && monster.attacks.length > 0 && (
                                <div className="bg-[#09090B] rounded-lg border border-[#27272A] overflow-hidden">
                                  <div className="bg-[#18181B] px-3 py-1.5 border-b border-[#27272A]">
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Ações e Ataques Interativos</span>
                                  </div>
                                  <div className="p-2 space-y-2">
                                    {monster.attacks.map((a: any, i: number) => (
                                      <div key={i} className="flex flex-col gap-1 p-2 hover:bg-white/5 rounded transition-colors group">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-bold text-white uppercase">{a.name}</span>
                                          <div className="flex gap-2 font-mono text-[10px] text-amber-500">
                                            {a.dice && a.dice > 0 && <span>{a.dice}d20+{a.bonus}</span>}
                                            {a.damage && a.damage !== '0' && (
                                              <>
                                                <span>|</span>
                                                <span>{a.damage} {a.damageType}</span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        {a.description && (
                                          <p className="text-[10px] text-zinc-500 italic leading-relaxed">
                                            {a.description}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Habilidades Especiais */}
                              {monster.abilities && monster.abilities.length > 0 && (
                                <div className="space-y-3">
                                  <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Habilidades Especiais</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {monster.abilities.map((ability: any, i: number) => (
                                      <div key={i} className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                                        <h5 className="text-xs font-bold text-primary mb-1">{ability.name}</h5>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed">{ability.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Bar */}
                              <div className="flex gap-3 pt-4 mt-2 border-t border-white/5 items-center">
                                
                                {/* Adicionar ao Combate */}
                                <Button 
                                  variant="flat" 
                                  color="primary" 
                                  startContent={<Swords size={16} />}
                                  className="flex-1 font-bold h-10"
                                  onPress={() => handleAddToCombat(monster)}
                                >
                                  Add ao Combate
                                </Button>
                                
                                {/* Selecionar Sala + Adicionar */}
                                <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 flex-1">
                                  <Select 
                                    placeholder="Sel. Sala" 
                                    size="sm"
                                    className="flex-1 min-w-[120px]"
                                    selectedKeys={selectedRoomId ? [selectedRoomId] : []}
                                    onSelectionChange={(keys) => setSelectedRoomId(Array.from(keys)[0] as string)}
                                    variant="flat"
                                    aria-label="Selecionar sala"
                                    classNames={{
                                      trigger: "bg-transparent hover:bg-white/5 border-none shadow-none h-8",
                                    }}
                                  >
                                    {missions.flatMap(m => m.rooms).map(r => (
                                      <SelectItem key={String(r.id)} textValue={r.name}>
                                        {r.name}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                  <Button 
                                    isIconOnly
                                    color="success" 
                                    size="sm"
                                    onPress={() => handleAddToRoom(monster.id)}
                                    className="font-bold w-10 min-w-unit-10 h-8 rounded-lg"
                                    title="Adicionar à Sala"
                                  >
                                    <Plus size={18} />
                                  </Button>
                                </div>

                                {/* Editar */}
                                <Button 
                                  isIconOnly
                                  variant="flat" 
                                  className="text-zinc-400 bg-zinc-900 hover:bg-zinc-800 h-10 w-10 border border-zinc-800"
                                  onPress={() => handleOpenEdit(monster)}
                                  title="Editar Criatura Base"
                                >
                                  <Edit3 size={18} />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <MonsterFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        monster={editingMonster} 
        campaignId={campaignId}
      />
    </div>
  )
}
