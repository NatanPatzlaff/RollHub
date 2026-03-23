import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Tabs, 
  Tab, 
  Input, 
  Select, 
  SelectItem, 
  Textarea, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { Plus, Trash2, Package, Swords, Shield, Info } from 'lucide-react'
import axios from 'axios'
import { skillDescriptions } from '../../utils/skillDescriptions'

interface HomebrewItem {
  id: number
  name: string
  description: string | null
  itemType: 'weapon' | 'protection' | 'ammunition' | 'general'
  damage: string | null
  damageType: string | null
  range: string | null
  defenseBonus: number | null
  penalty: number | null
  caliber: string | null
  quantityPerBox: number | null
  weight: string | null
  price: string | null
  category: number | null
  skillBonusName: string | null
  skillBonusValue: number | null
}

interface Props {
  weapon: HomebrewItem[]
  protection: HomebrewItem[]
  ammunition: HomebrewItem[]
  general: HomebrewItem[]
}

export default function HomebrewIndex(props: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [activeTab, setActiveTab] = useState('weapon')
  const [isLoading, setIsLoading] = useState(false)

  // Form states
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

  const resetForm = () => {
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

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir este item homebrew permanentemente?')) return
    try {
      await axios.delete(`/api/homebrew-items/${id}`)
      router.reload()
    } catch (e) {
      console.error('Erro ao deletar:', e)
    }
  }

  const handleCreate = async () => {
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
      await axios.post('/api/homebrew-items', payload)
      resetForm()
      onClose()
      router.reload()
    } catch (e) {
      console.error('Erro ao criar:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const renderCard = (item: HomebrewItem) => {
    return (
      <Card key={item.id} className="bg-[#18181B] border border-[#27272A] hover:border-[#F97316]/50 transition-all">
        <CardHeader className="flex justify-between items-start pb-2">
          <div className="flex flex-col">
            <h3 className="text-white font-bold text-lg leading-tight">{item.name}</h3>
            <span className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-widest mt-1">
              {item.itemType} {item.category !== null ? `• CAT ${item.category}` : ''}
            </span>
          </div>
          <Button 
            isIconOnly 
            size="sm" 
            variant="light" 
            color="danger" 
            onPress={() => handleDelete(item.id)}
            className="hover:bg-danger/20"
          >
            <Trash2 size={16} />
          </Button>
        </CardHeader>
        <CardBody className="pt-0 space-y-3">
          {item.description && (
            <p className="text-zinc-400 text-xs italic">"{item.description}"</p>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {item.itemType === 'weapon' && (
              <>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <span className="text-zinc-500 block">DANO</span>
                  <span className="text-white font-mono">{item.damage} ({item.damageType})</span>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <span className="text-zinc-500 block">ALCANCE</span>
                  <span className="text-white">{item.range}</span>
                </div>
              </>
            )}
            {item.itemType === 'protection' && (
              <>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <span className="text-zinc-500 block">DEFESA</span>
                  <span className="text-white">+{item.defenseBonus}</span>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <span className="text-zinc-500 block">PENALIDADE</span>
                  <span className="text-white">{item.penalty}</span>
                </div>
              </>
            )}
            {item.itemType === 'ammunition' && (
              <>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <span className="text-zinc-500 block">CALIBRE</span>
                  <span className="text-white">{item.caliber}</span>
                </div>
                <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
                  <span className="text-zinc-500 block">QTD/CAIXA</span>
                  <span className="text-white">{item.quantityPerBox}</span>
                </div>
              </>
            )}
            {item.itemType === 'general' && item.skillBonusName && item.skillBonusValue !== null && (
              <div className="bg-[#09090B] p-2 rounded border border-[#27272A] col-span-2">
                <span className="text-zinc-500 block">BÔNUS EM PERÍCIA</span>
                <span className="text-white">{item.skillBonusValue > 0 ? `+${item.skillBonusValue}` : item.skillBonusValue} em {item.skillBonusName}</span>
              </div>
            )}
            <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
              <span className="text-zinc-500 block">PESO</span>
              <span className="text-white">{item.weight || '—'}</span>
            </div>
            <div className="bg-[#09090B] p-2 rounded border border-[#27272A]">
              <span className="text-zinc-500 block">CATEGORIA</span>
              <span className="text-white">{item.category !== null ? item.category : '—'}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-8">
      <Head title="Gerenciar Homebrews" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#F97316]">Itens Homebrew</h1>
            <p className="text-zinc-400 mt-2">Crie e gerencie itens personalizados compartilhados entre suas campanhas.</p>
          </div>
          <Button 
            onPress={() => { resetForm(); onOpen(); }}
            className="bg-[#F97316] text-black font-black uppercase tracking-widest px-8"
            startContent={<Plus size={20} />}
          >
            Criar Novo Item
          </Button>
        </header>

        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(k) => setActiveTab(k as string)}
          variant="underlined"
          classNames={{
            tabList: "gap-8 border-b border-[#27272A] w-full",
            cursor: "bg-[#F97316]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#F97316] font-black uppercase text-sm tracking-widest"
          }}
        >
          <Tab key="weapon" title={<div className="flex items-center gap-2"><Swords size={18} /> Armas</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {props.weapon?.map(renderCard)}
              {props.weapon?.length === 0 && <p className="text-zinc-600 italic lg:col-span-4">Nenhuma arma homebrew criada.</p>}
            </div>
          </Tab>
          <Tab key="protection" title={<div className="flex items-center gap-2"><Shield size={18} /> Proteções</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {props.protection?.map(renderCard)}
              {props.protection?.length === 0 && <p className="text-zinc-600 italic lg:col-span-4">Nenhuma proteção homebrew criada.</p>}
            </div>
          </Tab>
          <Tab key="ammunition" title={<div className="flex items-center gap-2"><Package size={18} /> Munições</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {props.ammunition?.map(renderCard)}
              {props.ammunition?.length === 0 && <p className="text-zinc-600 italic lg:col-span-4">Nenhuma munição homebrew criada.</p>}
            </div>
          </Tab>
          <Tab key="general" title={<div className="flex items-center gap-2"><Info size={18} /> Itens Gerais</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
              {props.general?.map(renderCard)}
              {props.general?.length === 0 && <p className="text-zinc-600 italic lg:col-span-4">Nenhum item geral homebrew criado.</p>}
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        className="bg-[#18181B] border border-[#27272A] text-white"
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 uppercase italic font-black text-[#F97316]">Novo Item Homebrew</ModalHeader>
          <ModalBody className="space-y-6 pt-4 pb-8">
            <Select
              label="Tipo de Item"
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
              placeholder="Ex: Espada de Plasma"
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
            )}

            <Textarea 
              label="Descrição / Notas"
              labelPlacement="outside"
              placeholder="..."
              variant="bordered"
              value={hbDescription}
              onValueChange={setHbDescription}
              classNames={{ inputWrapper: "border-white/20" }}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Peso (Espaços)" labelPlacement="outside" variant="bordered" placeholder="1" value={hbWeight} onValueChange={setHbWeight} classNames={{ inputWrapper: "border-white/20" }} />
              <Select label="Categoria" labelPlacement="outside" variant="bordered" selectedKeys={[hbCategory]} onSelectionChange={k => setHbCategory(Array.from(k)[0] as string)} classNames={{ trigger: "border-white/20", label: "text-zinc-400" }}>
                {[0, 1, 2, 3, 4].map(c => <SelectItem key={c.toString()} textValue={`Cat ${c}`} className="text-white">{`Categoria ${c}`}</SelectItem>)}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#27272A]">
            <Button variant="flat" onPress={onClose} className="text-zinc-400">Cancelar</Button>
            <Button 
              onPress={handleCreate} 
              isLoading={isLoading}
              className="bg-[#F97316] text-black font-black uppercase tracking-widest px-8"
            >
              Criar Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
