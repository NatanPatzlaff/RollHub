import { useState, useEffect } from 'react'
import { Button, Select, SelectItem, Textarea, Input } from '@heroui/react'
import BaseModal from '../../characters/components/BaseModal'

interface CatalogItem {
  id: number
  name: string
  category: number
  type?: string
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
  onAdd: (item: {
    name: string
    description: string
    quantity: number
    item_type: string
    catalog_item_id: number | null
  }) => void
  onCollect: (itemId: number, characterId: number) => void
}

export default function RoomItemModal({
  isOpen, onClose, mode, campaignCharacters, itemToCollect,
  catalogWeapons, catalogProtections,
  catalogAmmunitions, catalogGeneralItems, onAdd, onCollect
}: RoomItemModalProps) {
  const [itemType, setItemType] = useState<string>('narrative')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)

  // Limpar estados ao fechar ou trocar modo
  useEffect(() => {
    if (!isOpen) {
      setSelectedCharacterId(null)
      setSelectedCatalogId(null)
      setName('')
      setDescription('')
      setQuantity(1)
      setItemType('narrative')
    }
  }, [isOpen])

  const catalogMap: Record<string, CatalogItem[]> = {
    weapon: catalogWeapons,
    protection: catalogProtections,
    ammunition: catalogAmmunitions,
    general: catalogGeneralItems,
  }

  const typeLabels: Record<string, string> = {
    narrative: 'Narrativo',
    weapon: 'Arma',
    protection: 'Proteção',
    ammunition: 'Munição',
    general: 'Item Geral',
  }

  const handleAction = () => {
    if (mode === 'add') {
      if (itemType === 'narrative' && !name.trim()) return
      if (itemType !== 'narrative' && !selectedCatalogId) return

      const selectedItem = itemType !== 'narrative' 
        ? catalogMap[itemType]?.find(i => i.id === selectedCatalogId)
        : null

      onAdd({
        name: selectedItem?.name || name,
        description,
        quantity,
        item_type: itemType,
        catalog_item_id: selectedCatalogId,
      })
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
      maxWidth="max-w-lg"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="flat" onPress={onClose} className="text-zinc-400">
            Cancelar
          </Button>
          <Button 
            onPress={handleAction}
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
          <>
            <Select 
              label="Tipo de Item"
              selectedKeys={[itemType]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string
                setItemType(key)
                setSelectedCatalogId(null)
              }}
              className="max-w-full"
              classNames={{
                trigger: "bg-[#18181B] border-[#27272A]",
                label: "text-zinc-400"
              }}
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} textValue={label} value={value} className="text-white">
                  {label}
                </SelectItem>
              ))}
            </Select>

            {itemType === 'narrative' ? (
              <Input 
                label="Nome do Item"
                placeholder="Ex: Diário de Bordo Antigo"
                value={name}
                onValueChange={setName}
                className="text-white"
                classNames={{
                  inputWrapper: "bg-[#18181B] border-[#27272A]"
                }}
              />
            ) : (
              <Select
                label={`Selecionar ${typeLabels[itemType]}`}
                placeholder={`Escolha um(a) ${typeLabels[itemType]}`}
                selectedKeys={selectedCatalogId ? [selectedCatalogId.toString()] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string
                  setSelectedCatalogId(parseInt(key))
                }}
                classNames={{
                  trigger: "bg-[#18181B] border-[#27272A]",
                  label: "text-zinc-400"
                }}
              >
                {(catalogMap[itemType] || []).map((item) => (
                  <SelectItem 
                    key={item.id.toString()} 
                    textValue={item.name}
                    value={item.id.toString()} 
                    className="text-white"
                  >
                    {item.name} {item.category > 0 ? `(Cat ${item.category})` : ''}
                  </SelectItem>
                ))}
              </Select>
            )}

            <div className="flex gap-4">
              <Input 
                type="number"
                label="Quantidade"
                value={quantity.toString()}
                onValueChange={(v) => setQuantity(parseInt(v) || 1)}
                min={1}
                className="w-1/3"
                classNames={{
                  inputWrapper: "bg-[#18181B] border-[#27272A]"
                }}
              />
              <div className="flex-1">
                 <Textarea 
                  label="Descrição / Notas"
                  placeholder="Detalhes sobre onde está o item ou sua aparência..."
                  value={description}
                  onValueChange={setDescription}
                  classNames={{
                    inputWrapper: "bg-[#18181B] border-[#27272A]"
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">
              Selecione o personagem que irá coletar este item e adicioná-lo ao seu inventário.
            </p>
            <Select
              label="Quem coletou?"
              placeholder="Selecione um agente"
              selectedKeys={selectedCharacterId ? [selectedCharacterId.toString()] : []}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string
                setSelectedCharacterId(parseInt(key))
              }}
              classNames={{
                trigger: "bg-[#18181B] border-[#27272A]",
                label: "text-zinc-400"
              }}
            >
              {(campaignCharacters ?? []).map((char) => (
                <SelectItem 
                  key={char.id.toString()} 
                  textValue={char.name}
                  value={char.id.toString()}
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
