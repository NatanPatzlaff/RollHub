import { useState, useEffect } from 'react'
import axios from 'axios'
import { router } from '@inertiajs/react'
import { 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  Button, Input, Textarea, Divider, Select, SelectItem
} from '@heroui/react'
import { Plus, Trash2, Ghost, Swords, Shield, Zap, UserPlus, Info, Activity, Brain, FileText, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MonsterFormModalProps {
  isOpen: boolean
  onClose: () => void
  monster?: any
  campaignId: number
  mode?: 'template' | 'room-instance'
}

const DAMAGE_TYPES = [
  'balístico', 'corte', 'eletricidade', 'fogo', 'frio', 'impacto', 'mental',
  'conhecimento', 'energia', 'medo', 'morte', 'sangue', 'perfuração', 'químico', 'dano'
]

const SIZES = ['Minúsculo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Colossal']
const RANGES = ['Corpo a corpo', 'Curto', 'Médio', 'Longo']

export default function MonsterFormModal({ isOpen, onClose, monster, campaignId, mode = 'template' }: MonsterFormModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '', type: '', size: 'Médio', element: '', secondaryElements: '', vd: 0,
    defense: 10, hpMax: 10, hpCurrent: 10, movement: 9, alternativeMovements: [],
    nexImmune: 0, immunities: '', additionalImmunities: '', vulnerabilities: '',
    agi: 0, str: 0, int: 0, pre: 0, vig: 0,
    perceptionDice: 1, perceptionBonus: 0,
    initiativeDice: 1, initiativeBonus: 0,
    fortitudeDice: 1, fortitudeBonus: 0,
    reflexDice: 1, reflexBonus: 0,
    willDice: 1, willBonus: 0,
    additionalSkills: [],
    attacks: [],
    abilities: [],
    resistances: { flatRD: 0, byType: {} },
    disturbingPresenceDt: null,
    disturbingPresenceDamage: '',
    description: '',
    fearEnigma: '',
    notes: ''
  })

  // Controle de Missões/Salas para Adição Direta
  const [missions, setMissions] = useState<any[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      const fetchMissions = async () => {
        try {
          const res = await axios.get(`/api/campaigns/${campaignId}/missions`)
          setMissions(res.data.missions || [])
        } catch (e) {
          console.error('Erro ao buscar missões:', e)
        }
      }
      fetchMissions()
    }
  }, [campaignId, isOpen])

  useEffect(() => {
    if (monster) {
      setFormData({
        ...monster,
        name: monster.name ?? '',
        type: monster.type ?? '',
        size: monster.size ?? 'Médio',
        element: monster.element ?? '',
        secondaryElements: monster.secondaryElements ?? '',
        vd: monster.vd ?? 0,
        defense: monster.defense ?? 0,
        hpMax: monster.hpMax ?? 0,
        hpCurrent: monster.hpCurrent ?? 0,
        movement: monster.movement ?? 0,
        nexImmune: monster.nexImmune ?? 0,
        agi: monster.agi ?? 0,
        str: monster.str ?? 0,
        int: monster.int ?? 0,
        pre: monster.pre ?? 0,
        vig: monster.vig ?? 0,
        perceptionDice: monster.perceptionDice ?? 1,
        perceptionBonus: monster.perceptionBonus ?? 0,
        initiativeDice: monster.initiativeDice ?? 1,
        initiativeBonus: monster.initiativeBonus ?? 0,
        fortitudeDice: monster.fortitudeDice ?? 1,
        fortitudeBonus: monster.fortitudeBonus ?? 0,
        reflexDice: monster.reflexDice ?? 1,
        reflexBonus: monster.reflexBonus ?? 0,
        willDice: monster.willDice ?? 1,
        willBonus: monster.willBonus ?? 0,
        disturbingPresenceDt: monster.disturbingPresenceDt ?? 0,
        disturbingPresenceDamage: monster.disturbingPresenceDamage ?? '',
        description: monster.description ?? '',
        fearEnigma: monster.fearEnigma ?? '',
        notes: monster.notes ?? '',
        alternativeMovements: monster.alternativeMovements ?? [],
        additionalSkills: monster.additionalSkills ?? [],
        attacks: monster.attacks ?? [],
        abilities: monster.abilities ?? [],
        resistances: monster.resistances ?? { flatRD: 0, byType: {} }
      })
    } else {
      setFormData({
        name: '', type: '', size: 'Médio', element: '', secondaryElements: '', vd: 0,
        defense: 10, hpMax: 10, hpCurrent: 10, movement: 9, alternativeMovements: [],
        nexImmune: 0, immunities: '', additionalImmunities: '', vulnerabilities: '',
        agi: 0, str: 0, int: 0, pre: 0, vig: 0,
        perceptionDice: 1, perceptionBonus: 0,
        initiativeDice: 1, initiativeBonus: 0,
        fortitudeDice: 1, fortitudeBonus: 0,
        reflexDice: 1, reflexBonus: 0,
        willDice: 1, willBonus: 0,
        additionalSkills: [],
        attacks: [],
        abilities: [],
        resistances: { flatRD: 0, byType: {} },
        disturbingPresenceDt: 0,
        disturbingPresenceDamage: '',
        description: '',
        fearEnigma: '',
        notes: ''
      })
    }
  }, [monster, isOpen])

  const handleSubmit = () => {
    if (monster?.id) {
      const url = mode === 'room-instance' 
        ? `/room-monsters/${monster.id}` 
        : `/monsters/${monster.id}`
      
      console.log('submit url:', url, 'monster id:', monster?.id)
      router.put(url, { ...formData, campaignId }, {
        preserveScroll: true,
        onSuccess: () => onClose()
      })
    } else {
      router.post('/monsters', { ...formData, campaignId }, {
        preserveScroll: true,
        onSuccess: () => onClose()
      })
    }
  }

  // Helpers de lista dinâmica
  const addItem = (field: string, defaultValue: any) => {
    setFormData((p: any) => ({ ...p, [field]: [...(p[field] || []), defaultValue] }))
  }

  const removeItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, i: number) => i !== index)
    }))
  }

  const updateItem = (field: string, index: number, data: any) => {
    const newList = [...(formData[field] || [])]
    newList[index] = { ...newList[index], ...data }
    setFormData((p: any) => ({ ...p, [field]: newList }))
  }

  const addAdditionalDamage = (attackIndex: number) => {
    const newAttacks = [...formData.attacks]
    newAttacks[attackIndex].additionalDamages = [...(newAttacks[attackIndex].additionalDamages || []), { damage: '1d6', damageType: 'Energia' }]
    setFormData((p: any) => ({ ...p, attacks: newAttacks }))
  }

  const removeAdditionalDamage = (attackIndex: number, damageIndex: number) => {
    const newAttacks = [...formData.attacks]
    newAttacks[attackIndex].additionalDamages = (newAttacks[attackIndex].additionalDamages || []).filter((_: any, i: number) => i !== damageIndex)
    setFormData((p: any) => ({ ...p, attacks: newAttacks }))
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl" scrollBehavior="inside" backdrop="blur" classNames={{ base: 'bg-zinc-950 border border-zinc-800' }}>
      <ModalContent className="max-h-[90vh]">
        <ModalHeader className="flex flex-col gap-1 border-b border-zinc-800 py-4">
          <div className="flex items-center gap-2 text-primary">
            <Ghost size={20} />
            <h3 className="text-xl font-bold">{monster ? `Editar: ${monster.name}` : 'Nova Criatura'}</h3>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Ficha de Ameaça Paranormal</p>
        </ModalHeader>

        <ModalBody className="py-6 custom-scrollbar space-y-12">
          {/* Seção 1: Identificação */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 text-primary p-2 rounded-lg"><Info size={20} /></div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Identificação</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Nome" value={formData.name} onValueChange={(v) => setFormData((p:any)=>({...p, name: v}))} />
              <Input label="Tipo / Classe" value={formData.type} onValueChange={(v) => setFormData((p:any)=>({...p, type: v}))} />
              <Select label="Tamanho" selectedKeys={[formData.size]} onSelectionChange={(keys) => setFormData((p:any)=>({...p, size: Array.from(keys)[0]}))}>
                {SIZES.map(s => <SelectItem key={s}>{s}</SelectItem>)}
              </Select>
              <Input label="Elemento Principal" value={formData.element} onValueChange={(v) => setFormData((p:any)=>({...p, element: v}))} />
              <Input label="Elementos Secundários" value={formData.secondaryElements} onValueChange={(v) => setFormData((p:any)=>({...p, secondaryElements: v}))} />
              <Input label="Valor de Desafio (VD)" type="number" value={String(formData.vd)} onValueChange={(v) => setFormData((p:any)=>({...p, vd: parseInt(v)}))} />
            </div>
          </section>

          {/* Seção 2: Combate */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-500/10 text-red-500 p-2 rounded-lg"><Activity size={20} /></div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Status de Combate</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input label="Vida Atual" type="number" value={String(formData.hpCurrent)} onValueChange={(v) => setFormData((p:any)=>({...p, hpCurrent: parseInt(v)}))} />
              <Input label="Vida Máxima" type="number" value={String(formData.hpMax)} onValueChange={(v) => setFormData((p:any)=>({...p, hpMax: parseInt(v)}))} />
              <Input label="Defesa" type="number" value={String(formData.defense)} onValueChange={(v) => setFormData((p:any)=>({...p, defense: parseInt(v)}))} />
              <Input label="Deslocamento Base" type="number" value={String(formData.movement)} onValueChange={(v) => setFormData((p:any)=>({...p, movement: parseInt(v)}))} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#18181B] p-3 rounded-lg border border-[#27272A]">
                <span className="text-xs font-bold text-zinc-400">DESLOCAMENTOS ALTERNATIVOS</span>
                <Button size="sm" variant="flat" onPress={() => addItem('alternativeMovements', { type: 'Voo', value: 9 })} startContent={<Plus size={14} />}>Adicionar</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(formData.alternativeMovements || []).map((move: any, i: number) => (
                  <div key={i} className="flex gap-2 bg-[#101012] p-2 rounded-lg border border-[#27272A]">
                    <Input size="sm" label="Tipo" value={move.type} onValueChange={(v) => updateItem('alternativeMovements', i, { type: v })} />
                    <Input size="sm" label="Valor" type="number" value={String(move.value)} onValueChange={(v) => updateItem('alternativeMovements', i, { value: parseInt(v) })} />
                    <Button isIconOnly variant="light" color="danger" onPress={() => removeItem('alternativeMovements', i)}><Trash2 size={16} /></Button>
                  </div>
                ))}
              </div>
            </div>
            <Input label="NEX Imune" type="number" value={String(formData.nexImmune)} onValueChange={(v) => setFormData((p:any)=>({...p, nexImmune: parseInt(v)}))} className="md:w-1/3" />
          </section>

          {/* Seção 3: Atributos */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/10 text-purple-500 p-2 rounded-lg"><Brain size={20} /></div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Atributos</h4>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {['AGI', 'FOR', 'INT', 'PRE', 'VIG'].map(attr => (
                <Input 
                  key={attr} label={attr} type="number" 
                  value={String(formData[attr.toLowerCase()] || 0)} 
                  onValueChange={(v) => setFormData((p:any)=>({...p, [attr.toLowerCase()]: parseInt(v)}))}
                  classNames={{ input: "text-center font-black text-lg", label: "text-center w-full" }}
                />
              ))}
            </div>
          </section>

          {/* Seção 4: Perícias */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-lg"><Zap size={20} /></div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Perícias Principais</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Percepção', field: 'perception' },
                { label: 'Iniciativa', field: 'initiative' },
                { label: 'Fortitude', field: 'fortitude' },
                { label: 'Reflexos', field: 'reflex' },
                { label: 'Vontade', field: 'will' },
              ].map(skill => (
                <div key={skill.field} className="flex gap-2 items-end bg-[#18181B] p-3 rounded-xl border border-[#27272A]">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex-1 mb-2">{skill.label}</span>
                  <Input size="sm" type="number" label="D" value={String(formData[`${skill.field}Dice`])} onValueChange={(v) => setFormData((p:any)=>({...p, [`${skill.field}Dice`]: parseInt(v)}))} className="w-14" />
                  <Input size="sm" type="number" label="+" value={String(formData[`${skill.field}Bonus`])} onValueChange={(v) => setFormData((p:any)=>({...p, [`${skill.field}Bonus`]: parseInt(v)}))} className="w-14" />
                </div>
              ))}
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center bg-[#18181B] p-3 rounded-lg border border-[#27272A]">
                <span className="text-xs font-bold text-zinc-400">PERÍCIAS ADICIONAIS</span>
                <Button size="sm" variant="flat" onPress={() => addItem('additionalSkills', { name: 'Luta', dice: 1, bonus: 0 })} startContent={<Plus size={14} />}>Adicionar</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(formData.additionalSkills || []).map((skill: any, i: number) => (
                  <div key={i} className="flex gap-2 bg-[#101012] p-2 rounded-lg border border-[#27272A]">
                    <Input size="sm" label="Perícia" value={skill.name} onValueChange={(v) => updateItem('additionalSkills', i, { name: v })} />
                    <Input size="sm" label="Dados" type="number" value={String(skill.dice)} onValueChange={(v) => updateItem('additionalSkills', i, { dice: parseInt(v) })} className="w-16" />
                    <Input size="sm" label="Dep" type="number" value={String(skill.bonus)} onValueChange={(v) => updateItem('additionalSkills', i, { bonus: parseInt(v) })} className="w-16" />
                    <Button isIconOnly variant="light" color="danger" onPress={() => removeItem('additionalSkills', i)}><Trash2 size={16} /></Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 5: Resistências */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/10 text-blue-500 p-2 rounded-lg"><Shield size={20} /></div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Defesas & Resistências</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Imunidades (Chaves)" value={formData.immunities} onValueChange={(v) => setFormData((p:any)=>({...p, immunities: v}))} />
              <Input label="Imunidades Adicionais" value={formData.additionalImmunities} onValueChange={(v) => setFormData((p:any)=>({...p, additionalImmunities: v}))} />
              <Input label="Vulnerabilidades" value={formData.vulnerabilities} onValueChange={(v) => setFormData((p:any)=>({...p, vulnerabilities: v}))} className="md:col-span-2" />
            </div>

            <div className="bg-[#18181B] p-4 rounded-2xl border border-[#27272A] mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-primary uppercase">Especializações (Resistir/Imune)</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">RD FLAT:</span>
                  <Input size="sm" type="number" value={String(formData.resistances.flatRD)} onValueChange={(v) => setFormData((p:any)=>({...p, resistances: {...p.resistances, flatRD: parseInt(v)}}))} className="w-16" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {DAMAGE_TYPES.map(type => (
                  <Input
                    key={type}
                    label={type}
                    size="sm"
                    type="number"
                    className="capitalize"
                    value={String(formData.resistances.byType[type] || 0)}
                    onValueChange={(v) => setFormData((p:any) => ({
                      ...p,
                      resistances: {
                        ...p.resistances,
                        byType: {
                          ...p.resistances.byType,
                          [type]: parseInt(v) || 0
                        }
                      }
                    }))}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Seção 6: Presença Perturbadora */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2 text-zinc-400">
              <AlertCircle size={20} />
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Presença Perturbadora</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
              <Input label="Dificuldade (DT)" type="number" value={String(formData.disturbingPresenceDt || '')} onValueChange={(v) => setFormData((p:any)=>({...p, disturbingPresenceDt: parseInt(v)}))} />
              <Input label="Dano de Sanidade" placeholder="2d6" value={formData.disturbingPresenceDamage} onValueChange={(v) => setFormData((p:any)=>({...p, disturbingPresenceDamage: v}))} />
            </div>
          </section>

          {/* Seção 7: Ataques */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-red-600/10 text-red-500 p-2 rounded-lg"><Swords size={20} /></div>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">Ações de Ataque</h4>
              </div>
              <Button size="sm" color="primary" variant="flat" onPress={() => addItem('attacks', { name: 'Novo Ataque', range: 'Corpo a corpo', attackCount: 1, dice: 2, bonus: 0, critical: 20, multiplier: 2, damage: '1d6', damageType: 'Corte', additionalDamages: [] })} startContent={<Plus size={16} />}>Novo Ataque</Button>
            </div>

            <div className="space-y-6">
              {(formData.attacks || []).map((attack: any, i: number) => (
                <div key={i} className="bg-[#18181B] p-5 rounded-2xl border border-[#27272A] relative group shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5"><Input label="Nome da Ação" value={attack.name} onValueChange={(v) => updateItem('attacks', i, { name: v })} /></div>
                    <div className="md:col-span-3">
                      <Select label="Alcance" selectedKeys={[attack.range]} onSelectionChange={(k) => updateItem('attacks', i, { range: Array.from(k)[0] })}>
                        {RANGES.map(r => <SelectItem key={r}>{r}</SelectItem>)}
                      </Select>
                    </div>
                    <div className="md:col-span-2"><Input label="Qtd" type="number" value={String(attack.attackCount)} onValueChange={(v) => updateItem('attacks', i, { attackCount: parseInt(v) })} /></div>
                    <div className="md:col-span-1"><Input label="D" type="number" value={String(attack.dice)} onValueChange={(v) => updateItem('attacks', i, { dice: parseInt(v) })} /></div>
                    <div className="md:col-span-1"><Input label="+" type="number" value={String(attack.bonus)} onValueChange={(v) => updateItem('attacks', i, { bonus: parseInt(v) })} /></div>
                    
                    <div className="md:col-span-2"><Input label="Dano" placeholder="2d6" value={attack.damage} onValueChange={(v) => updateItem('attacks', i, { damage: v })} /></div>
                    <div className="md:col-span-3">
                      <Select label="Tipo de Dano" size="sm" selectedKeys={[attack.damageType]} onSelectionChange={(k) => updateItem('attacks', i, { damageType: Array.from(k)[0] })}>
                        {DAMAGE_TYPES.map(t => <SelectItem key={t}>{t}</SelectItem>)}
                      </Select>
                    </div>
                    <div className="md:col-span-2"><Input label="Crítico (Valor)" type="number" value={String(attack.critical)} onValueChange={(v) => updateItem('attacks', i, { critical: parseInt(v) })} /></div>
                    <div className="md:col-span-2"><Input label="Mult (x)" type="number" value={String(attack.multiplier)} onValueChange={(v) => updateItem('attacks', i, { multiplier: parseInt(v) })} /></div>

                    <div className="md:col-span-12">
                      <Textarea 
                        label="Descrição da Ação" 
                        size="sm"
                        placeholder="Descreva efeitos especiais, condições ou gatilhos desta ação..." 
                        value={attack.description || ''} 
                        onValueChange={(v) => updateItem('attacks', i, { description: v })} 
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-3 -mb-1">
                    <Button 
                      size="sm" color="danger" variant="light" 
                      onPress={() => removeItem('attacks', i)}
                      startContent={<Trash2 size={16} />}
                    >
                      Remover Ataque
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Danos Adicionais</span>
                      <Button size="sm" variant="light" className="text-[10px] h-6" onPress={() => addAdditionalDamage(i)}>+ Adicionar</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(attack.additionalDamages || []).map((ad: any, adi: number) => (
                        <div key={adi} className="flex gap-2 items-center bg-[#09090B] p-1.5 rounded-lg border border-zinc-800">
                          <Input size="sm" variant="underlined" className="w-16 h-8" value={ad.damage} onValueChange={(v) => {
                            const newAds = [...attack.additionalDamages]; newAds[adi].damage = v;
                            updateItem('attacks', i, { additionalDamages: newAds })
                          }} />
                          <Select size="sm" variant="underlined" className="w-24 h-8" selectedKeys={[ad.damageType]} onSelectionChange={(k) => {
                            const newAds = [...attack.additionalDamages]; newAds[adi].damageType = Array.from(k)[0];
                            updateItem('attacks', i, { additionalDamages: newAds })
                          }}>
                            {DAMAGE_TYPES.map(t => <SelectItem key={t}>{t}</SelectItem>)}
                          </Select>
                          <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => removeAdditionalDamage(i, adi)}><Trash2 size={12} /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Seção 8: Habilidades */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg"><UserPlus size={20} /></div>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">Habilidades Especiais</h4>
              </div>
              <Button size="sm" variant="flat" onPress={() => addItem('abilities', { name: 'Nova Habilidade', description: '' })} startContent={<Plus size={16} />}>Adicionar</Button>
            </div>
            <div className="space-y-3">
              {(formData.abilities || []).map((ability: any, i: number) => (
                <div key={i} className="bg-[#18181B] p-4 rounded-xl border border-[#27272A] relative group">
                  <Button 
                    isIconOnly size="sm" color="danger" variant="light" 
                    className="absolute top-2 right-2 z-10"
                    onPress={() => removeItem('abilities', i)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Input label="Habilidade" variant="underlined" value={ability.name} onValueChange={(v) => updateItem('abilities', i, { name: v })} className="mb-2 font-bold text-primary" />
                  <Textarea label="Descrição" variant="flat" value={ability.description} onValueChange={(v) => updateItem('abilities', i, { description: v })} className="text-zinc-300" />
                </div>
              ))}
            </div>
          </section>

          {/* Seção 9: Textos Longos */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-zinc-800 text-zinc-400 p-2 rounded-lg"><FileText size={20} /></div>
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Descrição & Enigmas</h4>
            </div>
            <div className="space-y-6">
              <Textarea label="Descrição Detalhada" placeholder="História, aparência e comportamento..." value={formData.description} onValueChange={(v) => setFormData((p:any)=>({...p, description: v}))} />
              <Textarea label="Enigma do Medo" placeholder="Como derrotar permanentemente ou enfraquecer..." value={formData.fearEnigma} onValueChange={(v) => setFormData((p:any)=>({...p, fearEnigma: v}))} classNames={{ input: "border-primary/20", label: "text-primary/70" }} />
              <Divider className="bg-zinc-800" />
              <Textarea label="Notas Gerais (Mestre)" value={formData.notes} onValueChange={(v) => setFormData((p:any)=>({...p, notes: v}))} />
            </div>
          </section>
        </ModalBody>

        <ModalFooter className="border-t border-zinc-800 bg-[#09090B] py-4 gap-4 flex-wrap justify-between">
          {mode !== 'room-instance' && (
            <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 flex-1 min-w-[280px]">
              <Select 
                placeholder="Sel. Sala para adicionar" 
                size="sm"
                className="flex-1"
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
                size="sm" 
                color="success" 
                variant="flat"
                isDisabled={!selectedRoomId || !monster?.id}
                className="font-bold px-4 h-8 rounded-lg"
                onPress={() => {
                  if (!monster?.id) return
                  // Salvar template e depois adicionar à sala
                  router.put(`/monsters/${monster.id}`, { ...formData, campaignId }, {
                    preserveScroll: true,
                    onSuccess: () => {
                      router.post(`/rooms/${selectedRoomId}/monsters`, {
                        monsterId: monster.id,
                        quantity: 1
                      }, {
                        preserveScroll: true,
                        onSuccess: () => {
                          onClose()
                        }
                      })
                    }
                  })
                }}
              >
                Salvar e Add na Sala
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="light" onPress={onClose} className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Descartar</Button>
            <Button color="primary" className="font-black uppercase tracking-widest text-[10px] px-8 shadow-lg shadow-primary/20" onPress={handleSubmit}>Salvar na Campanha</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
