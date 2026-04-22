import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, Sword, Shield, Briefcase, Crosshair, Sparkles, ArrowLeft } from 'lucide-react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from '@heroui/react'
import { router } from '@inertiajs/react'

export type HomebrewItemType = 'weapon' | 'protection' | 'general' | 'ammunition'

interface CreateHomebrewItemModalProps {
  isOpen: boolean
  onClose: () => void
  characterId: number
}

const ALL_SKILLS = [
  'Acrobacia', 'Adestramento', 'Artes', 'Atletismo', 'Atualidades', 'Ciências',
  'Crime', 'Diplomacia', 'Enganação', 'Fortitude', 'Furtividade', 'Iniciativa',
  'Intimidação', 'Intuição', 'Investigação', 'Luta', 'Medicina', 'Ocultismo',
  'Percepção', 'Pilotagem', 'Pontaria', 'Profissão', 'Reflexos', 'Religião',
  'Sobrevivência', 'Tática', 'Tecnologia', 'Vontade'
]

const CAT_OPTIONS = [
  { label: 'Categoria 0', value: 0 },
  { label: 'Categoria I', value: 1 },
  { label: 'Categoria II', value: 2 },
  { label: 'Categoria III', value: 3 },
  { label: 'Categoria IV', value: 4 },
]

const DAMAGE_TYPES = [
  'Corte', 'Impacto', 'Perfuração', 'Balístico', 
  'Sangue', 'Morte', 'Energia', 'Conhecimento', 'Mental'
]

const RANGE_OPTIONS = [
  '—', 'Curto', 'Médio', 'Longo', 'Extremo'
]

export default function CreateHomebrewItemModal({ isOpen, onClose, characterId }: CreateHomebrewItemModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedType, setSelectedType] = useState<HomebrewItemType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    description: '',
    damage: '',
    damageType: '',
    range: '',
    defenseBonus: 0,
    penalty: 0,
    caliber: '',
    quantityPerBox: 1,
    weight: '1',
    price: '',
    category: 0,
    skillBonusName: '',
    skillBonusValue: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleClose = () => {
    setStep(1)
    setSelectedType(null)
    setFormData({
      name: '', description: '', damage: '', damageType: '', range: '',
      defenseBonus: 0, penalty: 0, caliber: '', quantityPerBox: 1,
      weight: '1', price: '', category: 0, skillBonusName: '', skillBonusValue: 0
    })
    setErrors({})
    onClose()
  }

  const handleTypeSelect = (type: HomebrewItemType) => {
    setSelectedType(type)
    setStep(2)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined } as any))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = 'Nome é obrigatório'

    if (selectedType === 'weapon') {
      if (!formData.damage?.trim()) newErrors.damage = 'Dano é obrigatório'
      if (!formData.damageType?.trim()) newErrors.damageType = 'Tipo de dano é obrigatório'
      if (!formData.range?.trim()) newErrors.range = 'Alcance é obrigatório'
    } else if (selectedType === 'protection') {
      if (formData.defenseBonus === undefined || formData.defenseBonus === null || formData.defenseBonus === '') newErrors.defenseBonus = 'Bônus é obrigatório'
    } else if (selectedType === 'ammunition') {
      if (!formData.caliber?.trim()) newErrors.caliber = 'Calibre é obrigatório'
      if (formData.quantityPerBox === undefined || formData.quantityPerBox <= 0) newErrors.quantityPerBox = 'Quantidade é obrigatória'
    } else if (selectedType === 'general') {
      if (formData.category === undefined) newErrors.category = 'Categoria é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    setIsSubmitting(true)

    // Build payload parsing numbers
    const payload = {
      name: formData.name,
      description: formData.description,
      item_type: selectedType,
      damage: formData.damage,
      damageType: formData.damageType,
      range: formData.range,
      defenseBonus: Number(formData.defenseBonus) || 0,
      penalty: Number(formData.penalty) || 0,
      caliber: formData.caliber,
      quantityPerBox: Number(formData.quantityPerBox) || 1,
      weight: String(formData.weight),
      price: formData.price,
      category: Number(formData.category) || 0,
      skillBonusName: formData.skillBonusName || null,
      skillBonusValue: Number(formData.skillBonusValue) || 0,
    }

    router.post(`/characters/${characterId}/homebrew-items`, payload, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false)
        handleClose()
      },
      onError: (errs) => {
        setIsSubmitting(false)
        setErrors(errs as any)
      }
    })
  }

  const TYPES = [
    { id: 'weapon' as HomebrewItemType, label: 'Arma Customizada', desc: 'Crie uma arma corpo a corpo ou arma de fogo', icon: Sword, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { id: 'protection' as HomebrewItemType, label: 'Proteção Customizada', desc: 'Armaduras e escudos únicos', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'general' as HomebrewItemType, label: 'Item Geral', desc: 'Acessórios, utilitários, paranormais...', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'ammunition' as HomebrewItemType, label: 'Munição', desc: 'Balas, flechas, etc.', icon: Crosshair, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  const inputClasses = {
    inputWrapper: 'bg-zinc-900 border-zinc-700 data-[hover=true]:bg-zinc-800 data-[focus=true]:border-orange-500 transition-colors',
    innerWrapper: 'text-zinc-200',
    label: 'text-zinc-400 font-medium',
    helperWrapper: 'text-red-400'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      classNames={{
        base: 'bg-[#18181b] border border-zinc-800 text-white',
        header: 'border-b border-zinc-800',
        footer: 'border-t border-zinc-800',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-3">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </button>
              )}
              <Sparkles className="text-orange-500" size={24} />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Criar Item Customizado</span>
                <span className="text-xs text-zinc-500 font-normal">Crie um item único e adicione-o à sua ficha</span>
              </div>
            </ModalHeader>

            <ModalBody className="py-6 overflow-hidden relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <m.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {TYPES.map(t => {
                      const Icon = t.icon
                      return (
                        <button
                          key={t.id}
                          onClick={() => handleTypeSelect(t.id)}
                          className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors text-center group"
                        >
                          <div className={`p-4 rounded-full ${t.bg} ${t.color} mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon size={32} />
                          </div>
                          <span className="font-bold text-zinc-200 mb-1">{t.label}</span>
                          <span className="text-xs text-zinc-500">{t.desc}</span>
                        </button>
                      )
                    })}
                  </m.div>
                )}

                {step === 2 && (
                  <m.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2"
                  >
                    <div className="grid border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl gap-4">
                      <Input
                        label="Nome do Item *"
                        placeholder="Ex: Espada Vorpal"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        errorMessage={errors.name}
                        isInvalid={!!errors.name}
                        classNames={inputClasses}
                        variant="bordered"
                      />
                      
                      <Textarea
                        label="Descrição"
                        placeholder="Descreva o feitiço, visual, ou efeito..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        classNames={inputClasses}
                        variant="bordered"
                        minRows={3}
                      />
                    </div>

                    {selectedType === 'weapon' && (
                      <div className="grid grid-cols-2 gap-4 border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                        <Input
                          label="Dano *"
                          placeholder="Ex: 1d8, 2d6"
                          value={formData.damage}
                          onChange={(e) => handleChange('damage', e.target.value)}
                          errorMessage={errors.damage}
                          isInvalid={!!errors.damage}
                          classNames={inputClasses}
                          variant="bordered"
                        />
                        <Select
                          label="Tipo de Dano *"
                          placeholder="Selecione o tipo"
                          selectedKeys={formData.damageType ? [formData.damageType] : []}
                          onSelectionChange={(keys) => handleChange('damageType', Array.from(keys)[0])}
                          errorMessage={errors.damageType}
                          isInvalid={!!errors.damageType}
                          classNames={inputClasses}
                          variant="bordered"
                        >
                          {DAMAGE_TYPES.map(type => (
                            <SelectItem key={type} textValue={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="Alcance *"
                          placeholder="Selecione o alcance"
                          selectedKeys={formData.range ? [formData.range] : []}
                          onSelectionChange={(keys) => handleChange('range', Array.from(keys)[0])}
                          errorMessage={errors.range}
                          isInvalid={!!errors.range}
                          classNames={inputClasses}
                          variant="bordered"
                        >
                          {RANGE_OPTIONS.map(range => (
                            <SelectItem key={range} textValue={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}

                    {selectedType === 'protection' && (
                      <div className="grid grid-cols-2 gap-4 border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                        <Input
                          type="number"
                          label="Bônus de Defesa *"
                          placeholder="Ex: 5"
                          value={String(formData.defenseBonus)}
                          onChange={(e) => handleChange('defenseBonus', e.target.value)}
                          errorMessage={errors.defenseBonus}
                          isInvalid={!!errors.defenseBonus}
                          classNames={inputClasses}
                          variant="bordered"
                        />
                        <Input
                          type="number"
                          label="Penalidade (se houver)"
                          placeholder="Ex: 2"
                          value={String(formData.penalty)}
                          onChange={(e) => handleChange('penalty', e.target.value)}
                          classNames={inputClasses}
                          variant="bordered"
                        />
                      </div>
                    )}

                    {selectedType === 'ammunition' && (
                      <div className="grid grid-cols-2 gap-4 border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                        <Input
                          label="Calibre / Arma aplicável *"
                          placeholder="Ex: Balas curtas, Flechas"
                          value={formData.caliber}
                          onChange={(e) => handleChange('caliber', e.target.value)}
                          errorMessage={errors.caliber}
                          isInvalid={!!errors.caliber}
                          classNames={inputClasses}
                          variant="bordered"
                        />
                        <Input
                          type="number"
                          label="Qtde. Doses *"
                          placeholder="Ex: 20"
                          value={String(formData.quantityPerBox)}
                          onChange={(e) => handleChange('quantityPerBox', e.target.value)}
                          errorMessage={errors.quantityPerBox}
                          isInvalid={!!errors.quantityPerBox}
                          classNames={inputClasses}
                          variant="bordered"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                      <Select
                        label="Categoria"
                        variant="bordered"
                        selectedKeys={formData.category !== undefined ? [String(formData.category)] : []}
                        onSelectionChange={(keys) => handleChange('category', Array.from(keys)[0])}
                        classNames={inputClasses}
                        errorMessage={errors.category}
                        isInvalid={!!errors.category}
                      >
                        {CAT_OPTIONS.map(o => (
                          <SelectItem key={o.value} textValue={o.label} className="text-zinc-200">
                            {o.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        type="number"
                        label="Espaços / Peso"
                        placeholder="Ex: 1"
                        value={String(formData.weight)}
                        onChange={(e) => handleChange('weight', e.target.value)}
                        classNames={inputClasses}
                        variant="bordered"
                      />
                    </div>

                    {(selectedType === 'weapon' || selectedType === 'protection') && (
                      <div className="grid grid-cols-2 gap-4 border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                        <Select
                          label="Perícia Bonificada"
                          placeholder="Nenhuma"
                          variant="bordered"
                          selectedKeys={formData.skillBonusName ? [formData.skillBonusName] : []}
                          onSelectionChange={(keys) => handleChange('skillBonusName', Array.from(keys)[0])}
                          classNames={inputClasses}
                        >
                          <SelectItem key="" className="text-zinc-500">Nenhuma</SelectItem>
                          {ALL_SKILLS.map(s => (
                            <SelectItem key={s} textValue={s} className="text-zinc-200">{s}</SelectItem>
                          ))}
                        </Select>

                        <Input
                          type="number"
                          label="Valor do Bônus"
                          placeholder="Ex: 2"
                          value={String(formData.skillBonusValue)}
                          onChange={(e) => handleChange('skillBonusValue', e.target.value)}
                          classNames={inputClasses}
                          variant="bordered"
                          isDisabled={!formData.skillBonusName}
                        />
                      </div>
                    )}

                  </m.div>
                )}
              </AnimatePresence>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={handleClose} className="text-zinc-400">
                Cancelar
              </Button>
              {step === 2 && (
                <Button 
                  color="warning" 
                  onPress={handleSubmit} 
                  isLoading={isSubmitting}
                  className="font-bold text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  Criar e Requisitar Aprovação
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
