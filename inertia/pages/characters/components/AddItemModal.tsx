import React, { useState, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, Sword, Shield, Briefcase, Eye, Crosshair, Plus, Check, Search } from 'lucide-react'

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
  type: string
  description: string | null
  damageBonus?: string | null
  spaces: number
  damageTypeOverride?: string | null
  criticalBonus?: number | null
  criticalMultiplierBonus?: string | null
  weaponTypeRestriction?: string | null
}

export type AddItemType = 'weapon' | 'protection' | 'general' | 'cursed' | 'ammunition'

export interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  catalogWeapons: CatalogWeapon[]
  catalogProtections: CatalogProtection[]
  catalogGeneralItems: CatalogGeneralItem[]
  catalogCursedItems: CatalogCursedItem[]
  catalogAmmunitions: CatalogAmmunition[]
  /** DT de explosivos pré-computada: 10 + floor(nex/5) + agilidade */
  explosiveDt: number
  onAdd: (type: AddItemType, itemId: number, quantity?: number) => void
}

// ─── Constantes ───────────────────────────────────────────────────────────────

type TabId = 'weapons' | 'protections' | 'general' | 'cursed' | 'ammunitions'

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: 'weapons', label: 'Armas', Icon: Sword },
  { id: 'protections', label: 'Proteções', Icon: Shield },
  { id: 'general', label: 'Itens Gerais', Icon: Briefcase },
  { id: 'cursed', label: 'Itens Amaldiçoados', Icon: Eye },
  { id: 'ammunitions', label: 'Munições', Icon: Crosshair },
]

const CAT_LABELS: Record<number, string> = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

const STAT_CHIP =
  'bg-orange-500/15 border border-orange-500/40 rounded-lg p-3'

// ─── Botão Adicionar com feedback visual ──────────────────────────────────────

function AddItemButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    if (disabled || added) return
    onClick()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <m.button
      whileHover={!added && !disabled ? { scale: 1.05 } : {}}
      whileTap={!added && !disabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-md px-4 py-2 text-sm font-bold transition-colors min-w-[120px] flex items-center justify-center gap-2 ${
        disabled
          ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
          : added
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
            : 'bg-amber-600 text-white hover:bg-amber-500'
      }`}
    >
      <AnimatePresence mode="wait">
        {disabled ? (
          <m.span key="disabled" className="flex items-center gap-2">
            <Plus size={16} strokeWidth={3} />
            Em breve
          </m.span>
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
}) {
  const isExpanded = expandedKey === id

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
        <h3 className="text-base font-bold text-zinc-100">{name}</h3>
        <span className="text-xs font-medium text-zinc-500">{statsLine}</span>
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
        <AddItemButton onClick={onAdd} disabled={addDisabled} />
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

// ─── Conteúdo de cada aba ─────────────────────────────────────────────────────

function WeaponsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
}: {
  items: CatalogWeapon[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
}) {
  if (items.length === 0)
    return <EmptyState icon={Sword} message="Nenhuma arma cadastrada." />

  return (
    <AnimatePresence mode="popLayout">
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
                {(item.ammoCapacity != null || item.ammoType) && (
                  <StatChip
                    label="Munição"
                    value={
                      <span className="text-sm">
                        {item.ammoCapacity != null ? `${item.ammoCapacity}` : '—'}
                        {item.ammoType ? ` · ${item.ammoType}` : ''}
                      </span>
                    }
                  />
                )}
              </>
            }
          />
        )
      })}
    </AnimatePresence>
  )
}

function ProtectionsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
}: {
  items: CatalogProtection[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
}) {
  if (items.length === 0)
    return <EmptyState icon={Shield} message="Nenhuma proteção cadastrada." />

  return (
    <AnimatePresence mode="popLayout">
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
    </AnimatePresence>
  )
}

function GeneralItemsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
  explosiveDt,
}: {
  items: CatalogGeneralItem[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
  explosiveDt: number
}) {
  if (items.length === 0)
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
                  <ItemCard
                    key={key}
                    id={key}
                    name={item.name}
                    statsLine={statsLine}
                    description={desc}
                    expandedKey={expandedKey}
                    onToggle={onToggle}
                    onAdd={() => onAdd(item.id)}
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

function AmmunitionsTab({
  items,
  expandedKey,
  onToggle,
  onAdd,
}: {
  items: CatalogAmmunition[]
  expandedKey: string | null
  onToggle: (k: string) => void
  onAdd: (id: number) => void
}) {
  if (items.length === 0)
    return <EmptyState icon={Crosshair} message="Nenhuma munição cadastrada." />

  return (
    <AnimatePresence mode="popLayout">
      {items.map((item) => {
        const key = `ammunition-${item.id}`
        const statsLine = `${item.type} · Categoria ${item.category} · ${item.spaces} espaço(s)`

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
                <StatChip label="Tipo" value={item.type} />
                {item.damageBonus && (
                  <StatChip label="Bônus de dano" value={item.damageBonus} />
                )}
                {item.damageTypeOverride && (
                  <StatChip label="Tipo de dano" value={item.damageTypeOverride} />
                )}
                {item.criticalBonus && (
                  <StatChip label="Bônus crítico" value={item.criticalBonus} />
                )}
                {item.criticalMultiplierBonus && (
                  <StatChip label="Mult. crítico" value={item.criticalMultiplierBonus} />
                )}
              </>
            }
          />
        )
      })}
    </AnimatePresence>
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
  explosiveDt: number,
  onAdd: AddItemModalProps['onAdd']
): SearchEntry[] {
  const entries: SearchEntry[] = []

  weapons.forEach((item) => {
    entries.push({
      key: `weapon-${item.id}`,
      name: item.name,
      statsLine: [item.type, item.weaponType, item.range, `Dano ${item.damage}${item.damageType ? ` (${item.damageType})` : ''}`]
        .filter(Boolean)
        .join(' · '),
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
      statsLine: [item.type, `Def +${item.defenseBonus}`, item.dodgePenalty !== 0 ? `Esquiva ${item.dodgePenalty}` : null]
        .filter(Boolean)
        .join(' · '),
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
      statsLine: `${item.type} · Categoria ${item.category} · ${item.spaces} espaço(s)`,
      description: item.description,
      categoryLabel: 'Munições',
      CategoryIcon: Crosshair,
      onAdd: () => onAdd('ammunition', item.id),
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
  explosiveDt,
  onAdd,
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
        explosiveDt,
        onAdd
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogWeapons, catalogProtections, catalogGeneralItems, catalogCursedItems, catalogAmmunitions, explosiveDt]
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
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('weapon', id)}
                  />
                )}
                {activeTab === 'protections' && (
                  <ProtectionsTab
                    items={catalogProtections}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('protection', id)}
                  />
                )}
                {activeTab === 'general' && (
                  <GeneralItemsTab
                    items={catalogGeneralItems}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('general', id)}
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
                    items={catalogAmmunitions}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    onAdd={(id) => onAdd('ammunition', id)}
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
