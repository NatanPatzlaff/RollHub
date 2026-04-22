import React, { useState, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, Sword, Shield, Briefcase, Eye, Crosshair, Plus, Check, Search, LucideIcon, Sparkles } from 'lucide-react'
import { Select, SelectItem } from '@heroui/react'

// ─── Interfaces de catálogo ───────────────────────────────────────────────────

export interface CatalogWeapon {
  id: number
  name: string
  category: number
  type: string
  weaponType: string | null
  damage: string
  damageType: string | null
  critical: string | null
  criticalMultiplier: string | null
  range: string | null
  ammoCapacity: number | null
  ammoType: string | null
  spaces: number
  description: string | null
  special: any
}

export interface CatalogProtection {
  id: number
  name: string
  category: number
  type: string
  defenseBonus: number
  dodgePenalty: number
  spaces: number
  description: string | null
  special: any
}

export interface CatalogGeneralItem {
  id: number
  name: string
  category: number
  type: string | null
  spaces: number
  description: string | null
  effects: any
  skillBonusIsChoosable?: boolean
  skillBonusValue?: number
}

export interface CatalogCursedItem {
  id: number
  name: string
  element: number | null
  itemType: string | null
  spaces: number
  description: string | null
  benefits: any
  curses: any
}

export interface CatalogAmmunition {
  id: number
  name: string
  category: number
  description: string | null
  spaces: number
  duration: string | null
  weaponTypeRestriction: any | null
}

export interface CatalogHomebrewItem {
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
  weight: number | null
  price: number | null
  category: number | null
  skillBonusName: string | null
  skillBonusValue: number | null
  createdByUserId: number | null
}

export type AddItemType = 'weapon' | 'protection' | 'general' | 'cursed' | 'ammunition' | 'homebrew'

export interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  catalogWeapons: CatalogWeapon[]
  catalogProtections: CatalogProtection[]
  catalogGeneralItems: CatalogGeneralItem[]
  catalogCursedItems: CatalogCursedItem[]
  catalogAmmunitions: CatalogAmmunition[]
  catalogHomebrewItems: CatalogHomebrewItem[]
  inventory: any[]
  characterHomebrewIds: number[]
  onRemoveItem: (id: number) => void
  /** DT de explosivos pré-computada: 10 + floor(nex/5) + agilidade */
  explosiveDt: number
  onAdd: (type: AddItemType, itemId: number, quantity?: number, chosenSkillBonusName?: string) => void
  onAddHomebrew: (homebrewItemId: number) => void
}

// ─── Constantes ───────────────────────────────────────────────────────────────

type TabId = 'weapons' | 'protections' | 'general' | 'cursed' | 'ammunitions' | 'homebrew'

const TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'weapons', label: 'Armas', Icon: Sword },
  { id: 'protections', label: 'Proteções', Icon: Shield },
  { id: 'general', label: 'Itens Gerais', Icon: Briefcase },
  { id: 'cursed', label: 'Itens Amaldiçoados', Icon: Eye },
  { id: 'ammunitions', label: 'Munições', Icon: Crosshair },
  { id: 'homebrew', label: 'Homebrew', Icon: Sparkles },
]

const CAT_LABELS: Record<number, string> = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

const ALL_SKILLS = [
  'Acrobacia', 'Adestramento', 'Artes', 'Atletismo', 'Atualidades', 'Ciências',
  'Crime', 'Diplomacia', 'Enganação', 'Fortitude', 'Furtividade', 'Iniciativa',
  'Intimidação', 'Intuição', 'Investigação', 'Luta', 'Medicina', 'Ocultismo',
  'Percepção', 'Pilotagem', 'Pontaria', 'Profissão', 'Reflexos', 'Religião',
  'Sobrevivência', 'Tática', 'Tecnologia', 'Vontade'
]

const STAT_CHIP =
  'bg-orange-500/15 border border-orange-500/40 rounded-lg p-3'

// ─── Botão Adicionar com feedback visual ──────────────────────────────────────

function AddItemButton({ onClick, disabled, variant = 'add' }: { onClick: () => void; disabled?: boolean; variant?: 'add' | 'delete' }) {
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    if (disabled || added) return
    onClick()
    if (variant === 'add') {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const baseStyles = 'relative overflow-hidden rounded-md px-4 py-2 text-sm font-bold transition-colors min-w-[120px] flex items-center justify-center gap-2 shadow-sm'
  
  const variantStyles = 
    disabled 
      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
      : variant === 'delete'
        ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20'
        : added
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
          : 'bg-amber-600 text-white hover:bg-amber-500'

  return (
    <m.button
      whileHover={!added && !disabled ? { scale: 1.05 } : {}}
      whileTap={!added && !disabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles}`}
    >
      <AnimatePresence mode="wait">
        {disabled ? (
          <m.span key="disabled" className="flex items-center gap-2">
            <Plus size={16} strokeWidth={3} />
            {variant === 'delete' ? 'Bloqueado' : 'Em breve'}
          </m.span>
        ) : variant === 'delete' ? (
          <m.div 
            key="delete"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <X size={16} strokeWidth={3} />
            Excluir
          </m.div>
        ) : added ? (
          <m.div
            key="added"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={16} strokeWidth={3} />
            Adicionado
          </m.div>
        ) : (
          <m.div
            key="add"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Plus size={16} strokeWidth={3} />
            Adicionar
          </m.div>
        )}
      </AnimatePresence>
    </m.button>
  )
}

// ─── Sub-componente de card de item genérico ──────────────────────────────────

function ItemCard({
  id,
  name,
  statsLine,
  description,
  expandedContent,
  expandedKey,
  onToggle,
  onAdd,
  addDisabled,
  status,
  rejectionReason,
  onDelete,
}: {
  id: string
  name: string
  statsLine: React.ReactNode
  description?: string | null
  expandedContent?: React.ReactNode
  expandedKey: string | null
  onToggle: (key: string) => void
  onAdd: () => void
  addDisabled?: boolean
  status?: 'active' | 'pending' | 'rejected'
  rejectionReason?: string
  onDelete?: () => void
}) {
  const isExpanded = expandedKey === id

  const isRejected = status === 'rejected'
  const isPending = status === 'pending'

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`flex items-start justify-between gap-4 rounded-xl border bg-[#141417] p-5 transition-colors cursor-pointer hover:border-zinc-700 hover:bg-[#18181b] ${
        isExpanded ? 'border-amber-500/40 bg-[#18181b]' : 'border-zinc-800/60'
      }`}
      onClick={() => onToggle(id)}
    >
      <div className="flex flex-col gap-1 flex-1 pr-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-base font-bold text-zinc-100">{name}</h3>
          
          {isPending && (
            <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 ring-1 ring-inset ring-amber-500/20 uppercase tracking-tight">
              Aguardando aprovação
            </span>
          )}
          
          {isRejected && (
            <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500 ring-1 ring-inset ring-red-500/20 uppercase tracking-tight">
              Rejeitado
            </span>
          )}
        </div>

        <span className="text-xs font-medium text-zinc-500">{statsLine}</span>
        
        {isRejected && rejectionReason && (
          <div className="mt-2 text-xs bg-red-500/5 border border-red-500/20 rounded p-2 text-red-400 font-medium">
            <span className="font-bold opacity-70">Motivo: </span> {rejectionReason}
          </div>
        )}

        {description && (
          <p
            className={`text-sm text-zinc-400 mt-1 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
          >
            {description}
          </p>
        )}

        {/* Detalhes expandidos */}
        <AnimatePresence>
          {isExpanded && expandedContent && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-hidden"
            >
              {expandedContent}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {isRejected ? (
          <AddItemButton onClick={onDelete || (() => {})} variant="delete" />
        ) : (
          <AddItemButton onClick={onAdd} disabled={addDisabled || isPending} />
        )}
      </div>
    </m.div>
  )
}

// ─── StatChip ─────────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={STAT_CHIP}>
      <p className="text-[10px] uppercase tracking-wider text-orange-400/90 font-bold">{label}</p>
      <p className="text-lg font-bold text-orange-300 mt-0.5">{value}</p>
    </div>
  )
}

// ─── Seção de Itens Homebrew ──────────────────────────────────────────────────

function HomebrewSection({
  items,
  expandedKey,
  onToggle,
  onRemoveItem,
}: {
  items: any[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onRemoveItem: (id: number) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="mt-8 space-y-4 border-t border-zinc-800 pt-8">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-amber-500/5 border-amber-500/20">
        <Sparkles size={14} className="text-amber-500" />
        <span className="text-xs font-black uppercase tracking-widest text-amber-500">
          Seus Itens Customizados
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const statsLine = item.type === 'Arma' 
            ? [item.weaponType, item.range, `Dano ${item.damage}`].filter(Boolean).join(' · ')
            : item.type === 'Armadura'
              ? `Def +${item.defenseBonus}`
              : `Espaços: ${item.spaces}`

          return (
            <ItemCard
              key={item.uniqueId}
              id={item.uniqueId}
              name={item.name}
              statsLine={statsLine}
              description={item.desc}
              status={item.status}
              rejectionReason={item.rejectionReason}
              onDelete={() => onRemoveItem(item.id)}
              expandedKey={expandedKey}
              onToggle={onToggle}
              onAdd={() => {}} // Não aplicável aqui
              addDisabled={true}
              expandedContent={
                <>
                  {item.damage && <StatChip label="Dano" value={item.damage} />}
                  <StatChip label="Espaços" value={item.spaces} />
                  {item.status === 'active' && (
                    <div className="col-span-2 sm:col-span-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Item Ativo</p>
                      <p className="text-xs text-emerald-200/70 mt-1">Este item já faz parte do seu inventário.</p>
                    </div>
                  )}
                </>
              }
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Conteúdo de cada aba ─────────────────────────────────────────────────────

function WeaponsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
  inventory,
  onRemoveItem,
}: {
  items: CatalogWeapon[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
  inventory: any[]
  onRemoveItem: (id: number) => void
}) {
  const homebrewItems = inventory.filter(i => i.isHomebrew && i.itemKind === 'weapon')
  
  if (items.length === 0 && homebrewItems.length === 0)
    return <EmptyState icon={Sword} message="Nenhuma arma cadastrada." />

  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const key = `weapon-${item.id}`
          const statsLine = [
            item.type,
            item.weaponType,
            item.range,
            `Dano ${item.damage}${item.damageType ? ` (${item.damageType})` : ''}`,
          ]
            .filter(Boolean)
            .join(' · ')

          return (
            <ItemCard
              key={key}
              id={key}
              name={item.name}
              statsLine={statsLine}
              description={item.description}
              expandedKey={expandedKey}
              onToggle={onToggle}
              onAdd={() => onAdd(item.id)}
              expandedContent={
                <>
                  <StatChip
                    label="Dano"
                    value={
                      <>
                        {item.damage}
                        {item.damageType && (
                          <span className="text-sm font-normal text-orange-200/80">
                            {' '}
                            ({item.damageType})
                          </span>
                        )}
                      </>
                    }
                  />
                  <StatChip label="Categoria" value={CAT_LABELS[item.category] ?? item.category} />
                  <StatChip label="Alcance" value={item.range ?? '—'} />
                  <StatChip label="Margem crítico" value={item.critical ?? '—'} />
                  <StatChip label="Mult. crítico" value={item.criticalMultiplier ?? '—'} />
                  {item.ammoType && (
                    <StatChip
                      label="Munição"
                      value={
                        <span className="text-sm">
                          {item.ammoType || '—'}
                        </span>
                      }
                    />
                  )}
                </>
              }
            />
          )
        })}
      </div>
      
      <HomebrewSection 
        items={homebrewItems} 
        expandedKey={expandedKey} 
        onToggle={onToggle} 
        onRemoveItem={onRemoveItem} 
      />
    </>
  )
}

function ProtectionsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
  inventory,
  onRemoveItem,
}: {
  items: CatalogProtection[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
  inventory: any[]
  onRemoveItem: (id: number) => void
}) {
  const homebrewItems = inventory.filter(i => i.isHomebrew && i.itemKind === 'protection')

  if (items.length === 0 && homebrewItems.length === 0)
    return <EmptyState icon={Shield} message="Nenhuma proteção cadastrada." />

  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const key = `protection-${item.id}`
          const statsLine = [
            item.type,
            `Def +${item.defenseBonus}`,
            item.dodgePenalty !== 0 ? `Esquiva ${item.dodgePenalty}` : null,
          ]
            .filter(Boolean)
            .join(' · ')

          return (
            <ItemCard
              key={key}
              id={key}
              name={item.name}
              statsLine={statsLine}
              description={item.description}
              expandedKey={expandedKey}
              onToggle={onToggle}
              onAdd={() => onAdd(item.id)}
              expandedContent={
                <>
                  <StatChip label="Bônus de defesa" value={`+${item.defenseBonus}`} />
                  <StatChip label="Penalidade esquiva" value={item.dodgePenalty} />
                  <StatChip label="Categoria" value={CAT_LABELS[item.category] ?? item.category} />
                  <StatChip label="Tipo" value={item.type} />
                  <StatChip label="Espaços" value={item.spaces} />
                </>
              }
            />
          )
        })}
      </div>

      <HomebrewSection 
        items={homebrewItems} 
        expandedKey={expandedKey} 
        onToggle={onToggle} 
        onRemoveItem={onRemoveItem} 
      />
    </>
  )
}

function GeneralItemsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
  explosiveDt,
  inventory,
  onRemoveItem,
}: {
  items: CatalogGeneralItem[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (itemId: number, quantity?: number, chosenSkillBonusName?: string) => void
  explosiveDt: number
  inventory: any[]
  onRemoveItem: (id: number) => void
}) {
  const homebrewItems = inventory.filter(i => i.isHomebrew && i.itemKind === 'general')

  if (items.length === 0 && homebrewItems.length === 0)
    return <EmptyState icon={Briefcase} message="Nenhum item geral cadastrado." />

  const SECTION_STYLES: Record<
    string,
    { emoji: string; color: string; bg: string; border: string }
  > = {
    Acessório: {
      emoji: '🔧',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    Explosivo: {
      emoji: '💥',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    Operacional: {
      emoji: '🎒',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    Paranormal: {
      emoji: '🔮',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  }

  return (
    <>
      {(['Acessório', 'Explosivo', 'Operacional', 'Paranormal'] as const).map((sectionType) => {
        const sectionItems = items.filter((i) => i.type === sectionType)
        if (sectionItems.length === 0) return null
        const s = SECTION_STYLES[sectionType]

        return (
          <div key={sectionType} className="space-y-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${s.bg} ${s.border}`}
            >
              <span>{s.emoji}</span>
              <span className={`text-xs font-black uppercase tracking-widest ${s.color}`}>
                {sectionType}s
              </span>
            </div>
            <AnimatePresence mode="popLayout">
              {sectionItems.map((item) => {
                const key = `general-${item.id}`
                const catLabel =
                  item.category === 0
                    ? '0'
                    : (CAT_LABELS[item.category] ?? String(item.category))
                const statsLine = `CAT ${catLabel} · ${item.spaces} espaço(s)`
                const desc =
                  sectionType === 'Explosivo' && item.description
                    ? item.description.replace(/DT Agi/g, `DT ${explosiveDt}`)
                    : item.description

                return (
                  <GeneralItemRow
                    key={key}
                    item={item}
                    statsLine={statsLine}
                    description={desc}
                    expandedKey={expandedKey}
                    onToggle={onToggle}
                    onAdd={(id, qty, skill) => onAdd(id, qty, skill)}
                    expandedContent={
                      <>
                        <StatChip label="Categoria" value={catLabel} />
                        <StatChip label="Espaços" value={item.spaces} />
                      </>
                    }
                  />
                )
              })}
            </AnimatePresence>
          </div>
        )
      })}
      <HomebrewSection 
        items={homebrewItems} 
        expandedKey={expandedKey} 
        onToggle={onToggle} 
        onRemoveItem={onRemoveItem} 
      />
    </>
  )
}

function CursedItemsTab({
  items,
  expandedKey,
  onToggle,
}: {
  items: CatalogCursedItem[]
  expandedKey: string | null
  onToggle: (k: string) => void
}) {
  if (items.length === 0)
    return <EmptyState icon={Eye} message="Nenhum item amaldiçoado cadastrado." />

  return (
    <AnimatePresence mode="popLayout">
      {items.map((item) => {
        const key = `cursed-${item.id}`
        const statsLine = [item.itemType ?? 'Item', `${item.spaces} espaço(s)`]
          .filter(Boolean)
          .join(' · ')

        return (
          <ItemCard
            key={key}
            id={key}
            name={item.name}
            statsLine={statsLine}
            description={item.description}
            expandedKey={expandedKey}
            onToggle={onToggle}
            onAdd={() => {}}
            addDisabled
            expandedContent={
              <>
                <StatChip label="Tipo" value={item.itemType ?? '—'} />
                <StatChip label="Espaços" value={item.spaces} />
                {item.benefits && (
                  <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-lg p-3 col-span-2 sm:col-span-3">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400/90 font-bold">
                      Benefícios
                    </p>
                    <p className="text-sm text-zinc-300 mt-0.5">
                      {typeof item.benefits === 'object'
                        ? JSON.stringify(item.benefits)
                        : String(item.benefits)}
                    </p>
                  </div>
                )}
                {item.curses && (
                  <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-3 col-span-2 sm:col-span-3">
                    <p className="text-[10px] uppercase tracking-wider text-red-400/90 font-bold">
                      Maldições
                    </p>
                    <p className="text-sm text-zinc-300 mt-0.5">
                      {typeof item.curses === 'object'
                        ? JSON.stringify(item.curses)
                        : String(item.curses)}
                    </p>
                  </div>
                )}
              </>
            }
          />
        )
      })}
    </AnimatePresence>
  )
}

function GeneralItemRow({
  item,
  statsLine,
  description,
  expandedKey,
  onToggle,
  onAdd,
}: {
  item: CatalogGeneralItem
  statsLine: string
  description: string | null
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: AddItemModalProps['onAdd']
}) {
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const key = `general-${item.id}`
  const isChoosable = item.skillBonusIsChoosable

  return (
    <div className="space-y-3">
      <ItemCard
        id={key}
        name={item.name}
        statsLine={statsLine}
        description={description}
        expandedKey={expandedKey}
        onToggle={onToggle}
        onAdd={() => onAdd('general', item.id, 1, isChoosable ? selectedSkill : undefined)}
        addDisabled={isChoosable && !selectedSkill}
        expandedContent={
          <>
            <StatChip label="Categoria" value={CAT_LABELS[item.category] ?? item.category} />
            <StatChip label="Espaços" value={item.spaces} />
            {isChoosable && (
              <div className="col-span-2 sm:col-span-3 mt-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-sm font-bold text-amber-100">Bônus Escolhível (+{item.skillBonusValue})</span>
                </div>
                <Select
                  label="Escolha a perícia para este item"
                  placeholder="Selecione uma perícia"
                  labelPlacement="outside"
                  variant="bordered"
                  selectedKeys={selectedSkill ? [selectedSkill] : []}
                  onSelectionChange={(keys) => setSelectedSkill(Array.from(keys)[0] as string)}
                  className="max-w-xs"
                  classNames={{
                    trigger: 'bg-zinc-900 border-zinc-700 hover:border-zinc-500',
                    value: 'text-zinc-100',
                    label: 'text-zinc-400 font-medium mb-2',
                  }}
                >
                  {ALL_SKILLS.map((skill) => (
                    <SelectItem key={skill} textValue={skill} className="text-zinc-200">
                      {skill}
                    </SelectItem>
                  ))}
                </Select>
                {selectedSkill && (
                  <p className="text-[10px] text-zinc-500 mt-2">
                    Este item fornecerá +{item.skillBonusValue} em {selectedSkill} enquanto estiver equipado.
                  </p>
                )}
              </div>
            )}
          </>
        }
      />
    </div>
  )
}

function AmmunitionsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
  inventory,
  onRemoveItem,
}: {
  items: CatalogAmmunition[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
  inventory: any[]
  onRemoveItem: (id: number) => void
}) {
  const homebrewItems = inventory.filter(i => i.isHomebrew && (i.itemKind === 'ammunition' || i.type === 'Munição'))

  if (items.length === 0 && homebrewItems.length === 0)
    return <EmptyState icon={Crosshair} message="Nenhuma munição cadastrada." />

  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const key = `ammunition-${item.id}`
          const statsLine = `Categoria ${item.category} · ${item.spaces} espaço(s)`

          return (
            <ItemCard
              key={key}
              id={key}
              name={item.name}
              statsLine={statsLine}
              description={item.description}
              expandedKey={expandedKey}
              onToggle={onToggle}
              onAdd={() => onAdd(item.id)}
              expandedContent={
                <>
                  <StatChip label="Categoria" value={item.category} />
                  <StatChip label="Espaços" value={item.spaces} />
                  {item.duration && (
                    <StatChip label="Duração" value={item.duration} />
                  )}
                  {item.weaponTypeRestriction && (
                    <StatChip 
                      label="Armas compatíveis" 
                      value={Array.isArray(item.weaponTypeRestriction) 
                        ? item.weaponTypeRestriction.join(', ')
                        : item.weaponTypeRestriction} 
                    />
                  )}
                </>
              }
            />
          )
        })}
      </div>

      <HomebrewSection 
        items={homebrewItems} 
        expandedKey={expandedKey} 
        onToggle={onToggle} 
        onRemoveItem={onRemoveItem} 
      />
    </>
  )
}

function HomebrewTab({
  items,
  characterHomebrewIds,
  onAddHomebrew,
  expandedKey,
  onToggle,
}: {
  items: CatalogHomebrewItem[]
  characterHomebrewIds: number[]
  onAddHomebrew: (id: number) => void
  expandedKey: string | null
  onToggle: (k: string) => void
}) {
  if (items.length === 0)
    return <EmptyState icon={Sparkles} message="Nenhum item customizado encontrado no catálogo global." />

  const types = [
    { id: 'weapon', label: 'Armas', Icon: Sword, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', emoji: '⚔️' },
    { id: 'protection', label: 'Proteções', Icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', emoji: '🛡️' },
    { id: 'ammunition', label: 'Munições', Icon: Crosshair, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', emoji: '🏹' },
    { id: 'general', label: 'Itens Gerais', Icon: Briefcase, color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', emoji: '📦' },
  ]

  return (
    <div className="space-y-6">
      {types.map((type) => {
        const sectionItems = items.filter(i => i.itemType === type.id)
        if (sectionItems.length === 0) return null

        return (
          <div key={type.id} className="space-y-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${type.bg} ${type.border}`}>
              <span>{type.emoji}</span>
              <span className={`text-xs font-black uppercase tracking-widest ${type.color}`}>{type.label}</span>
            </div>
            
            <AnimatePresence mode="popLayout">
              {sectionItems.map((item) => {
                const key = `homebrew-catalog-${item.id}`
                const alreadyHas = characterHomebrewIds.includes(item.id)
                
                let statsLine = `CAT ${CAT_LABELS[item.category ?? 0] ?? item.category} · ${item.weight ?? 0} espaço(s)`
                if (item.itemType === 'weapon') statsLine = `${item.damage || '—'} · ${statsLine}`
                if (item.itemType === 'protection') statsLine = `+${item.defenseBonus || 0} Defesa · ${statsLine}`

                return (
                  <ItemCard
                    key={key}
                    id={key}
                    name={item.name}
                    statsLine={statsLine}
                    description={item.description}
                    expandedKey={expandedKey}
                    onToggle={onToggle}
                    onAdd={() => onAddHomebrew(item.id)}
                    addDisabled={false}
                    badge={null}
                    expandedContent={
                      <>
                        <StatChip label="Categoria" value={CAT_LABELS[item.category ?? 0] ?? item.category} />
                        <StatChip label="Espaços" value={item.weight ?? 0} />
                        {item.damage && <StatChip label="Dano" value={item.damage} />}
                        {item.damageType && <StatChip label="Tipo de Dano" value={item.damageType} />}
                        {item.defenseBonus != null && <StatChip label="Bônus Defesa" value={`+${item.defenseBonus}`} />}
                        {item.penalty != null && <StatChip label="Penalidade" value={item.penalty} />}
                        {item.range && <StatChip label="Alcance" value={item.range} />}
                        {item.skillBonusName && (
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 col-span-2">
                             <p className="text-[9px] uppercase tracking-wider text-amber-400 font-bold">Bônus de Perícia</p>
                             <p className="text-xs text-amber-100 font-bold mt-0.5">+{item.skillBonusValue} em {item.skillBonusName}</p>
                          </div>
                        )}
                      </>
                    }
                  />
                )
              })}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ─── Resultados de busca global ─────────────────────────────────────────────

type SearchEntry = {
  key: string
  name: string
  statsLine: string
  description?: string | null
  categoryLabel: string
  CategoryIcon: React.ElementType
  onAdd: (() => void) | null
}

function buildSearchEntries(
  weapons: CatalogWeapon[],
  protections: CatalogProtection[],
  generalItems: CatalogGeneralItem[],
  cursedItems: CatalogCursedItem[],
  ammunitions: CatalogAmmunition[],
  homebrews: CatalogHomebrewItem[],
  characterHomebrewIds: number[],
  explosiveDt: number,
  onAdd: AddItemModalProps['onAdd'],
  onAddHomebrew: AddItemModalProps['onAddHomebrew']
): SearchEntry[] {
  const entries: SearchEntry[] = []

  weapons.forEach((item) => {
    const catLabel = CAT_LABELS[item.category] ?? String(item.category)
    entries.push({
      key: `weapon-${item.id}`,
      name: item.name,
      statsLine: `${item.damage} · CAT ${catLabel} · ${item.type}`,
      description: item.description,
      categoryLabel: 'Armas',
      CategoryIcon: Sword,
      onAdd: () => onAdd('weapon', item.id),
    })
  })

  protections.forEach((item) => {
    entries.push({
      key: `protection-${item.id}`,
      name: item.name,
      statsLine: `+${item.defenseBonus} Defesa · CAT ${CAT_LABELS[item.category] ?? item.category} · ${item.type}`,
      description: item.description,
      categoryLabel: 'Proteções',
      CategoryIcon: Shield,
      onAdd: () => onAdd('protection', item.id),
    })
  })

  generalItems.forEach((item) => {
    const catLabel = item.category === 0 ? '0' : (CAT_LABELS[item.category] ?? String(item.category))
    const desc = item.type === 'Explosivo' && item.description
      ? item.description.replace(/DT Agi/g, `DT ${explosiveDt}`)
      : item.description
    entries.push({
      key: `general-${item.id}`,
      name: item.name,
      statsLine: `${item.type ?? 'Geral'} · CAT ${catLabel} · ${item.spaces} espaço(s)`,
      description: desc,
      categoryLabel: 'Itens Gerais',
      CategoryIcon: Briefcase,
      onAdd: () => onAdd('general', item.id),
    })
  })

  cursedItems.forEach((item) => {
    entries.push({
      key: `cursed-${item.id}`,
      name: item.name,
      statsLine: `${item.itemType ?? 'Item'} · ${item.spaces} espaço(s)`,
      description: item.description,
      categoryLabel: 'Itens Amaldiçoados',
      CategoryIcon: Eye,
      onAdd: null, // em breve
    })
  })

  ammunitions.forEach((item) => {
    entries.push({
      key: `ammunition-${item.id}`,
      name: item.name,
      statsLine: `Categoria ${item.category} · ${item.spaces} espaço(s)`,
      description: item.description,
      categoryLabel: 'Munições',
      CategoryIcon: Crosshair,
      onAdd: () => onAdd('ammunition', item.id),
    })
  })

  homebrews.forEach((item) => {
    let statsLine = `CAT ${CAT_LABELS[item.category ?? 0] ?? item.category} · ${item.weight ?? 0} espaço(s)`
    if (item.itemType === 'weapon') statsLine = `${item.damage || '—'} · ${statsLine}`
    if (item.itemType === 'protection') statsLine = `+${item.defenseBonus || 0} Defesa · ${statsLine}`

    entries.push({
      key: `homebrew-catalog-${item.id}`,
      name: `${item.name} 🧪`,
      statsLine,
      description: item.description,
      categoryLabel: 'Homebrew',
      CategoryIcon: Sparkles,
      onAdd: () => onAddHomebrew(item.id),
    })
  })

  return entries
}

function SearchResults({
  query,
  entries,
  expandedKey,
  onToggle,
}: {
  query: string
  entries: SearchEntry[]
  expandedKey: string | null
  onToggle: (k: string) => void
}) {
  const q = query.toLowerCase().trim()
  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.statsLine.toLowerCase().includes(q)
  )

  if (filtered.length === 0) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-zinc-600"
      >
        <Search size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Nenhum item encontrado para &ldquo;{query}&rdquo;.</p>
      </m.div>
    )
  }

  return (
    <AnimatePresence mode="popLayout">
      {filtered.map((entry) => {
        const Icon = entry.CategoryIcon
        return (
          <ItemCard
            key={entry.key}
            id={entry.key}
            name={entry.name}
            statsLine={
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                  <Icon size={10} />
                  {entry.categoryLabel}
                </span>
                <span>{entry.statsLine}</span>
              </span>
            }
            description={entry.description}
            expandedKey={expandedKey}
            onToggle={onToggle}
            onAdd={entry.onAdd ?? (() => {})}
            addDisabled={entry.onAdd === null}
          />
        )
      })}
    </AnimatePresence>
  )
}

// ─── Estado vazio ─────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ElementType
  message: string
}) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-zinc-600"
    >
      <Icon size={48} className="mb-4 opacity-20" />
      <p className="text-sm">{message}</p>
    </m.div>
  )
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export default function AddItemModal({
  isOpen,
  onClose,
  catalogWeapons,
  catalogProtections,
  catalogGeneralItems,
  catalogCursedItems,
  catalogAmmunitions,
  catalogHomebrewItems,
  inventory,
  characterHomebrewIds,
  onRemoveItem,
  explosiveDt,
  onAdd,
  onAddHomebrew,
}: AddItemModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('weapons')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const searchEntries = useMemo(
    () =>
      buildSearchEntries(
        catalogWeapons,
        catalogProtections,
        catalogGeneralItems,
        catalogCursedItems,
        catalogAmmunitions,
        catalogHomebrewItems,
        characterHomebrewIds,
        explosiveDt,
        onAdd,
        onAddHomebrew
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogWeapons, catalogProtections, catalogGeneralItems, catalogCursedItems, catalogAmmunitions, catalogHomebrewItems, characterHomebrewIds, explosiveDt]
  )

  const isSearching = search.trim().length > 0

  const toggleExpanded = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Container do modal */}
          <m.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#141417] border border-zinc-800 shadow-2xl"
          >
            {/* Botão fechar */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Cabeçalho */}
            <div className="flex flex-col gap-3 border-b border-zinc-800 px-6 py-5 pr-12">
              <div>
                <h2 className="text-xl font-bold text-white">Adicionar Item ao Inventário</h2>
                <p className="text-sm text-zinc-400">
                  Escolha um item por tipo e adicione ao personagem
                </p>
              </div>
              {/* Barra de busca global */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setExpandedKey(null)
                  }}
                  placeholder="Buscar em todas as categorias..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setExpandedKey(null) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Abas fixas — ocultas durante busca */}
            {!isSearching && (
            <div className="sticky top-0 z-20 bg-[#141417] px-6 pt-4 border-b border-zinc-800">
              <div className="flex gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {TABS.map(({ id, label, Icon }) => {
                  const isActive = activeTab === id
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveTab(id)
                        setExpandedKey(null)
                      }}
                      className={`relative pb-4 flex items-center gap-2 text-sm font-bold transition-colors whitespace-nowrap ${
                        isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                      {isActive && (
                        <m.div
                          layoutId="addItemTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            )}

            {/* Conteúdo rolável */}
            <div className="relative flex-1 overflow-y-auto bg-[#09090b] [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-[#09090b] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#09090b]">
              <div className="flex flex-col gap-3 p-6 min-h-full">
                {isSearching ? (
                  <SearchResults
                    query={search}
                    entries={searchEntries}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                  />
                ) : (
                  <>
                 {activeTab === 'weapons' && (
                  <WeaponsTab
                    items={catalogWeapons}
                    inventory={inventory}
                    onRemoveItem={onRemoveItem}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('weapon', id)}
                  />
                )}
                {activeTab === 'protections' && (
                  <ProtectionsTab
                    items={catalogProtections}
                    inventory={inventory}
                    onRemoveItem={onRemoveItem}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('protection', id)}
                  />
                )}
                {activeTab === 'general' && (
                  <GeneralItemsTab
                    items={catalogGeneralItems}
                    inventory={inventory}
                    onRemoveItem={onRemoveItem}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id, qty, skill) => onAdd('general', id, qty, skill)}
                    explosiveDt={explosiveDt}
                  />
                )}
                {activeTab === 'cursed' && (
                  <CursedItemsTab
                    items={catalogCursedItems}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                  />
                )}
                {activeTab === 'ammunitions' && (
                  <AmmunitionsTab
                    items={catalogAmmunitions.filter((item: any) => 
                      item.type !== 'Melhoria' && item.type !== 'Maldição'
                    )}
                    inventory={inventory}
                    onRemoveItem={onRemoveItem}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('ammunition', id)}
                  />
                )}
                {activeTab === 'homebrew' && (
                  <HomebrewTab
                    items={catalogHomebrewItems}
                    characterHomebrewIds={characterHomebrewIds}
                    onAddHomebrew={onAddHomebrew}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                  />
                )}
                  </>
                )}
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  )
}
