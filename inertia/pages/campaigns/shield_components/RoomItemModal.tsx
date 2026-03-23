import { useState, useEffect } from 'react'
import { Button, Select, SelectItem, Textarea, Input, Tabs, Tab, Chip } from '@heroui/react'
import { skillDescriptions } from '../../../utils/skillDescriptions'
import BaseModal from '../../characters/components/BaseModal'
import axios from 'axios'

interface CatalogItem {
  id: number
  name: string
  category: number
  type?: string
  isHomebrew?: boolean
}

interface RoomItem {
  id: number
  name: string
  description: string | null
  quantity: number
  itemType?: string
  catalogItemId?: number | null
  collected?: boolean
  collectedByCharacterId?: number | null
}

interface RoomItemModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'collect'
  campaignCharacters: { id: number; name: string }[]
  itemToCollect?: RoomItem | null
  catalogWeapons: CatalogItem[]
  catalogProtections: CatalogItem[]
  catalogAmmunitions: CatalogItem[]
  catalogGeneralItems: CatalogItem[]
  homebrewItems: any[]
  onAdd: (item: {
    name: string
    description: string
    quantity: number
    item_type: string
    catalog_item_id: number | null
    homebrew_item_id?: number | null
  }) => void
  onCollect: (itemId: number, characterId: number) => void
  onHomebrewCreated: (item: any) => void
}

export default function RoomItemModal({
  isOpen, onClose, mode, campaignCharacters, itemToCollect,
  catalogWeapons, catalogProtections,
  catalogAmmunitions, catalogGeneralItems, homebrewItems,
  onAdd, onCollect, onHomebrewCreated
}: RoomItemModalProps) {
  const [activeTab, setActiveTab] = useState<string>('catalog')
  const [itemType, setItemType] = useState<string>('narrative')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  // Homebrew specific states
  const [hbType, setHbType] = useState<string>('weapon')
  const [hbName, setHbName] = useState('')
  const [hbDescription, setHbDescription] = useState('')
  const [hbDamage, setHbDamage] = useState('')
  const [hbDamageType, setHbDamageType] = useState('')
  const [hbRange, setHbRange] = useState('')
  const [hbWeight, setHbWeight] = useState('')
  const [hbPrice, setHbPrice] = useState('')
  const [hbDefense, setHbDefense] = useState('')
  const [hbPenalty, setHbPenalty] = useState('')
  const [hbCaliber, setHbCaliber] = useState('')
  const [hbQtyBox, setHbQtyBox] = useState('')
  const [hbCategory, setHbCategory] = useState('1')
  const [hbSkillBonusName, setHbSkillBonusName] = useState('')
  const [hbSkillBonusValue, setHbSkillBonusValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Limpar estados ao fechar ou trocar modo
  useEffect(() => {
    if (!isOpen) {
      setSelectedCharacterId(null)
      setSelectedCatalogId(null)
      setName('')
      setDescription('')
      setQuantity(1)
      setItemType('narrative')
      setActiveTab('catalog')
      resetHbForm()
    }
  }, [isOpen])

  const resetHbForm = () => {
    setHbName('')
    setHbDescription('')
    setHbDamage('')
    setHbDamageType('')
    setHbRange('')
    setHbWeight('')
    setHbPrice('')
    setHbDefense('')
    setHbPenalty('')
    setHbCaliber('')
    setHbQtyBox('')
    setHbCategory('1')
    setHbSkillBonusName('')
    setHbSkillBonusValue('')
  }

  const catalogMap: Record<string, CatalogItem[]> = {
    weapon: [...catalogWeapons, ...homebrewItems.filter(i => i.itemType === 'weapon').map(i => ({ ...i, isHomebrew: true }))],
    protection: [...catalogProtections, ...homebrewItems.filter(i => i.itemType === 'protection').map(i => ({ ...i, isHomebrew: true }))],
    ammunition: [...catalogAmmunitions, ...homebrewItems.filter(i => i.itemType === 'ammunition').map(i => ({ ...i, isHomebrew: true }))],
    general: [...catalogGeneralItems, ...homebrewItems.filter(i => i.itemType === 'general').map(i => ({ ...i, isHomebrew: true }))],
  }

  const typeLabels: Record<string, string> = {
    narrative: 'Narrativo',
    weapon: 'Arma',
    protection: 'Proteção',
    ammunition: 'Munição',
    general: 'Item Geral',
  }

  const handleAction = async () => {
    if (mode === 'add') {
      if (activeTab === 'catalog') {
        if (itemType === 'narrative' && !name.trim()) return
        if (itemType !== 'narrative' && !selectedCatalogId) return

        const selectedItem = itemType !== 'narrative' 
          ? catalogMap[itemType]?.find(i => i.id.toString() === selectedCatalogId)
          : null

        onAdd({
          name: selectedItem?.name || name,
          description,
          quantity,
          item_type: itemType,
          catalog_item_id: selectedItem?.isHomebrew ? null : (selectedCatalogId ? parseInt(selectedCatalogId) : null),
          homebrew_item_id: selectedItem?.isHomebrew ? (selectedCatalogId ? parseInt(selectedCatalogId) : null) : null,
        })
      } else {
        // Create Homebrew
        if (!hbName.trim()) return
        setIsLoading(true)
        try {
          const payload = {
            name: hbName,
            description: hbDescription,
            item_type: hbType,
            damage: hbDamage || null,
            damageType: hbDamageType || null,
            range: hbRange || null,
            defenseBonus: hbDefense ? parseInt(hbDefense) : null,
            penalty: hbPenalty ? parseInt(hbPenalty) : null,
            caliber: hbCaliber || null,
            quantityPerBox: hbQtyBox ? parseInt(hbQtyBox) : null,
            category: hbCategory ? parseInt(hbCategory) : null,
            weight: hbWeight || null,
            price: hbPrice || null,
            skillBonusName: hbSkillBonusName || null,
            skillBonusValue: hbSkillBonusValue ? parseInt(hbSkillBonusValue) : null,
          }
          const { data } = await axios.post('/api/homebrew-items', payload)
          onHomebrewCreated(data)
          
          // Add to room immediately
          onAdd({
            name: data.name,
            description: '',
            quantity: 1,
            item_type: data.itemType,
            catalog_item_id: null,
            homebrew_item_id: data.id,
          })
        } catch (e) {
          console.error('[HOMEBREW] Erro ao criar:', e)
        } finally {
          setIsLoading(false)
        }
      }
    } else {
      if (itemToCollect && selectedCharacterId) {
        onCollect(itemToCollect.id, selectedCharacterId)
      }
    }
    
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? "Adicionar Item à Sala" : `Coletar ${itemToCollect?.name}`}
      maxWidth="max-w-xl"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="flat" onPress={onClose} className="text-zinc-400">
            Cancelar
          </Button>
          <Button 
            onPress={handleAction}
            isLoading={isLoading}
            isDisabled={mode === 'collect' && !selectedCharacterId}
            className="bg-[#F97316] text-black font-bold"
          >
            {mode === 'add' ? 'Adicionar Item' : 'Confirmar Coleta'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {mode === 'add' ? (
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "w-full bg-[#F97316]",
              tab: "max-w-fit px-0 h-10",
              tabContent: "group-data-[selected=true]:text-[#F97316] font-bold uppercase text-xs tracking-widest"
            }}
          >
            <Tab key="catalog" title="Catálogo">
              <div className="flex flex-col gap-4 pt-6">
                <Select 
                  label="Tipo de Item"
                  labelPlacement="outside"
                  variant="bordered"
                  selectedKeys={[itemType]}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string
                    setItemType(key)
                    setSelectedCatalogId(null)
                  }}
                  classNames={{ trigger: "border-white/20", label: "text-zinc-400" }}
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} textValue={label} className="text-white">
                      {label}
                    </SelectItem>
                  ))}
                </Select>

                {itemType === 'narrative' ? (
                  <Input 
                    label="Nome do Item"
                    labelPlacement="outside"
                    placeholder="Ex: Diário de Bordo Antigo"
                    variant="bordered"
                    value={name}
                    onValueChange={setName}
                    classNames={{ inputWrapper: "border-white/20" }}
                  />
                ) : (
                  <Select
                    label={`Selecionar ${typeLabels[itemType]}`}
                    labelPlacement="outside"
                    placeholder={`Escolha um(a) ${typeLabels[itemType]}`}
                    variant="bordered"
                    selectedKeys={selectedCatalogId ? [selectedCatalogId] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string
                      setSelectedCatalogId(key)
                    }}
                    classNames={{ trigger: "border-white/20", label: "text-zinc-400" }}
                  >
                    {(catalogMap[itemType] || []).map((item) => (
                      <SelectItem 
                        key={item.id.toString()} 
                        textValue={item.name}
                        className="text-white"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span>{item.name} {item.category > 0 ? `(Cat ${item.category})` : ''}</span>
                          {item.isHomebrew && (
                            <Chip size="sm" color="warning" variant="flat" className="text-[9px] font-bold">Homebrew</Chip>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <div className="flex gap-4">
                  <Input 
                    type="number"
                    label="Quantidade"
                    labelPlacement="outside"
                    variant="bordered"
                    value={quantity.toString()}
                    onValueChange={(v) => setQuantity(parseInt(v) || 1)}
                    min={1}
                    className="w-1/3"
                    classNames={{ inputWrapper: "border-white/20" }}
                  />
                  <div className="flex-1">
                     <Textarea 
                      label="Descrição / Notas"
                      labelPlacement="outside"
                      placeholder="Detalhes sobre onde está o item ou sua aparência..."
                      variant="bordered"
                      value={description}
                      onValueChange={setDescription}
                      classNames={{ inputWrapper: "border-white/20" }}
                    />
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="homebrew" title="Homebrew">
              <div className="flex flex-col gap-4 pt-6">
                <Select
                  label="Tipo de Criação"
                  labelPlacement="outside"
                  variant="bordered"
                  selectedKeys={[hbType]}
                  onSelectionChange={(keys) => setHbType(Array.from(keys)[0] as string)}
                  classNames={{ trigger: "border-white/20", label: "text-zinc-400" }}
                >
                  <SelectItem key="weapon" textValue="Arma">Arma</SelectItem>
                  <SelectItem key="protection" textValue="Proteção">Proteção</SelectItem>
                  <SelectItem key="ammunition" textValue="Munição">Munição</SelectItem>
                  <SelectItem key="general" textValue="Item Geral">Item Geral</SelectItem>
                </Select>

                <Input 
                  label="Nome do Item"
                  labelPlacement="outside"
                  placeholder="Nome customizado..."
                  variant="bordered"
                  value={hbName}
                  onValueChange={setHbName}
                  classNames={{ inputWrapper: "border-white/20" }}
                />

                {hbType === 'weapon' && (
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Dano" labelPlacement="outside" variant="bordered" placeholder="2d6" value={hbDamage} onValueChange={setHbDamage} classNames={{ inputWrapper: "border-white/20" }} />
                    <Input label="Tipo Dano" labelPlacement="outside" variant="bordered" placeholder="Corte" value={hbDamageType} onValueChange={setHbDamageType} classNames={{ inputWrapper: "border-white/20" }} />
                    <Input label="Alcance" labelPlacement="outside" variant="bordered" placeholder="Curto" value={hbRange} onValueChange={setHbRange} classNames={{ inputWrapper: "border-white/20" }} />
                  </div>
                )}

                {hbType === 'protection' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" label="Bônus Defesa" labelPlacement="outside" variant="bordered" value={hbDefense} onValueChange={setHbDefense} classNames={{ inputWrapper: "border-white/20" }} />
                    <Input type="number" label="Penalidade" labelPlacement="outside" variant="bordered" value={hbPenalty} onValueChange={setHbPenalty} classNames={{ inputWrapper: "border-white/20" }} />
                  </div>
                )}

                {hbType === 'ammunition' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Calibre" labelPlacement="outside" variant="bordered" placeholder="9mm" value={hbCaliber} onValueChange={setHbCaliber} classNames={{ inputWrapper: "border-white/20" }} />
                    <Input type="number" label="Qtd/Caixa" labelPlacement="outside" variant="bordered" value={hbQtyBox} onValueChange={setHbQtyBox} classNames={{ inputWrapper: "border-white/20" }} />
                  </div>
                )}

                {hbType === 'general' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Select label="Bônus em Perícia" labelPlacement="outside" variant="bordered" placeholder="Selecione" selectedKeys={hbSkillBonusName ? [hbSkillBonusName] : []} onSelectionChange={k => setHbSkillBonusName(Array.from(k)[0] as string)} classNames={{ trigger: "border-white/20" }}>
                        {Object.keys(skillDescriptions).map(skillName => (
                          <SelectItem key={skillName} textValue={skillName} className="text-white">
                            {skillName}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input type="number" label="Valor do Bônus" labelPlacement="outside" variant="bordered" placeholder="Ex: 5 ou -2" value={hbSkillBonusValue} onValueChange={setHbSkillBonusValue} classNames={{ inputWrapper: "border-white/20" }} />
                    </div>
                    <Textarea label="Descrição" labelPlacement="outside" variant="bordered" placeholder="O que o item faz..." value={hbDescription} onValueChange={setHbDescription} classNames={{ inputWrapper: "border-white/20" }} />
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Peso (Espaços)" labelPlacement="outside" variant="bordered" placeholder="1" value={hbWeight} onValueChange={setHbWeight} classNames={{ inputWrapper: "border-white/20" }} />
                  <Select label="Categoria" labelPlacement="outside" variant="bordered" selectedKeys={[hbCategory]} onSelectionChange={k => setHbCategory(Array.from(k)[0] as string)} classNames={{ trigger: "border-white/20", label: "text-zinc-400" }}>
                    {[0, 1, 2, 3, 4].map(c => <SelectItem key={c.toString()} textValue={`Cat ${c}`} className="text-white">{`Categoria ${c}`}</SelectItem>)}
                  </Select>
                </div>
              </div>
            </Tab>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">
              Selecione o personagem que irá coletar este item e adicioná-lo ao seu inventário.
            </p>
            <Select
              label="Quem coletou?"
              placeholder="Selecione um agente"
              variant="bordered"
              selectedKeys={selectedCharacterId ? [selectedCharacterId.toString()] : []}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string
                setSelectedCharacterId(parseInt(key))
              }}
              classNames={{ trigger: "border-white/20", label: "text-zinc-400" }}
            >
              {(campaignCharacters ?? []).map((char) => (
                <SelectItem 
                  key={char.id.toString()} 
                  textValue={char.name}
                  className="text-white"
                >
                  {char.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
