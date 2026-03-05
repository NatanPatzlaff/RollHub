import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import {
  Backpack,
  Flame,
  Sword,
  Zap,
  ChevronDown,
  Sparkles,
  Plus,
  Square,
  Scale,
  ArrowUp,
  Circle,
  Edit3,
  Trash2,
  Shield,
  Activity,
  Dices,
} from 'lucide-react'

const RANK_OPTIONS = ['Recruta', 'Veterano', 'Expert']
const RANK_LIMITS: Record<string, Record<number, number>> = {
  Recruta: { 1: 2, 2: 0, 3: 0, 4: 0 },
  Veterano: { 1: 2, 2: 2, 3: 0, 4: 0 },
  Expert: { 1: 2, 2: 2, 3: 1, 4: 0 },
}
const CAT_LABELS: Record<number, string> = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

/** Definição das tabs com ícone Lucide */
const TABS = [
  { id: 'inventario', label: 'Inventário', icon: Backpack },
  { id: 'rituais', label: 'Rituais', icon: Flame },
  { id: 'combate', label: 'Combate', icon: Sword },
  { id: 'habilidades', label: 'Habilidades', icon: Zap },
] as const

export interface CharacterTabsCardProps {
  inventory: any[]
  inventoryCapacity: { used: number; limit: number; maxCapacity: number; isOverloaded: boolean }
  categoryConsumption: Record<number, number>
  rank: string
  isUpdatingRank: boolean
  expandedItemId: string | number | null
  inventoryWeapons: any[]
  onAddItem: () => void
  onRankChange: (rank: string) => void
  onModifyWeapon: (item: any) => void
  onRemoveItem: (id: number) => void
  onExpandItem: (id: string | number | null) => void
  onEquipItem: (id: number, currentEquipped: boolean) => void
  characterRituals: any[]
  isOcultista: boolean
  onLearnRitual: () => void
  onRemoveRitual: (id: number, characterClassAbilityId?: number | null) => void
  nex: number
  agility: number
  presence: number
  strength: number
  peritoPeSpending: Record<string, number>
  maxPeritoPe: number
  onRollWeapon: (w: { name: string; range: string; damage: string }) => void
  classAbilities: any[]
  paranormalPowers: any[]
  currentTrailAbilities: any[]
  futureTrailAbilities: any[]
  characterTrail: any
  chosenClassAbilities: number
  maxClassAbilities: number
  canChooseMore: boolean
  availableAbilities: any[]
  hasNoTrail: boolean
  classTrails: any[]
  expandedSections: Record<string, boolean>
  hasRitualPotente: boolean
  hasCamuflarOcultismo: boolean
  hasEngenhosidade: boolean
  intellect: number
  peritoSkills: string[]
  peritoBonus: { dice: string; cost: number }
  isTrailPowersOpen: boolean
  ritualPrediletoConfig: string | null
  usarCamuflar: boolean
  calcPeAjustado: (ritual: any) => { base: number; ajustado: number; reducoes: string[] }
  onToggleSection: (key: string) => void
  onTrailPowersOpenChange: (open: boolean) => void
  onOpenTrailModal: () => void
  onOpenAbilitySelect: () => void
  onOpenAbilityConfig: (ability: any) => void
  onRemoveAbility: (characterId: number, abilityId: number) => void
  onRemoveParanormalPower: (id: number, characterClassAbilityId?: number | null) => void
  onSetUsarCamuflar: (v: boolean) => void
  onSetPeritoPeSpending: (v: Record<string, number>) => void
  characterId: number
  originAbilityName?: string | null
  originAbilityDescription?: string | null
  originAbilities?: Array<{
    id: number
    originId: number
    name: string
    description: string | null
    type: string | null
    peCost: string | null
    range: string | null
    castTime: string | null
    duration: string | null
    target: string | null
    effects: any | null
  }>
  characterAffinity?: string | null
  pe: number
  ocultismoDegree: number
  onDeductPe: (amount: number) => void
  onDeductSan: (amount: number) => void
  onDeductPermSan: (amount: number) => void
  onRollRitual: (params: {
    name: string
    version: 'base' | 'discente' | 'verdadeiro'
    diceCount: number
    trainingBonus: number
    dt: number
    totalPe: number
    damageDice: string | undefined
    onResult: (r: {
      rolls: number[]
      best: number
      total: number
      damageResult: number | undefined
      damageRolls: number[] | undefined
    }) => void
  }) => void
}

import { canUseRitualUpgrade, circuloMaximoFromNex } from '../../../utils/ritualReqs'

export default function CharacterTabsCard({
  inventory,
  inventoryCapacity,
  categoryConsumption,
  rank,
  isUpdatingRank,
  expandedItemId,
  inventoryWeapons,
  onAddItem,
  onRankChange,
  onModifyWeapon,
  onRemoveItem,
  onExpandItem,
  onEquipItem,
  characterRituals,
  isOcultista,
  onLearnRitual,
  onRemoveRitual,
  nex,
  agility,
  presence,
  strength: _strength,
  peritoPeSpending,
  maxPeritoPe,
  onRollWeapon,
  classAbilities,
  paranormalPowers,
  currentTrailAbilities,
  futureTrailAbilities,
  characterTrail,
  chosenClassAbilities,
  maxClassAbilities,
  canChooseMore,
  availableAbilities,
  hasNoTrail,
  classTrails,
  expandedSections,
  hasRitualPotente,
  hasCamuflarOcultismo,
  hasEngenhosidade,
  intellect,
  peritoSkills,
  peritoBonus,
  isTrailPowersOpen,
  ritualPrediletoConfig,
  usarCamuflar,
  calcPeAjustado,
  onToggleSection,
  onTrailPowersOpenChange,
  onOpenTrailModal,
  onOpenAbilitySelect,
  onOpenAbilityConfig,
  onRemoveAbility,
  onRemoveParanormalPower,
  onSetUsarCamuflar,
  characterId,
  onSetPeritoPeSpending,
  originAbilityName,
  originAbilityDescription,
  characterAffinity,
  originAbilities = [],
  pe,
  ocultismoDegree,
  onDeductPe,
  onDeductSan,
  onDeductPermSan,
  onRollRitual,
}: CharacterTabsCardProps) {
  const [activeTab, setActiveTab] = useState<string>('inventario')

  // Habilidades de origem ativas/reação para exibir no combate
  const activeOriginAbilities = originAbilities.filter(
    (a) => a.type === 'ativa' || a.type === 'reação'
  )

  const circuloMaximo = circuloMaximoFromNex(nex, isOcultista)

  // ── Ritual roll state & helpers ────────────────────────────────────────────
  type RitualRollResult = {
    charRitualId: number
    version: 'base' | 'discente' | 'verdadeiro'
    rolls: number[]
    best: number
    bonus: number
    total: number
    dt: number
    peCost: number
    success: boolean
    failMargin: number
    sanLoss: number
    permSanLoss: number
    damageDice?: string
    damageResult?: number
  }

  const [ritualRollResults, setRitualRollResults] = useState<Record<number, RitualRollResult>>({})

  function parseExtraPe(text: string): number {
    const m = text.match(/\(\+(\d+)\s*PE\)/i)
    return m ? parseInt(m[1]) : 0
  }

  function parseDamageDice(text: string): string | null {
    const m = text.match(/\b(\d+d\d+(?:[+-]\d+)?)\b/i)
    return m ? m[1] : null
  }

  function rollDiceExpr(expr: string): number {
    const m = expr.match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/)
    if (!m) return 0
    const count = parseInt(m[1])
    const sides = parseInt(m[2])
    const mod = m[3] ? (m[3] === '+' ? parseInt(m[4]) : -parseInt(m[4])) : 0
    let result = 0
    for (let i = 0; i < count; i++) result += Math.floor(Math.random() * sides) + 1
    return result + mod
  }

  function handleRollRitual(charRitual: any, version: 'base' | 'discente' | 'verdadeiro') {
    const ritual = charRitual.ritual
    const peInfo = calcPeAjustado(ritual)
    const versionText =
      version === 'discente'
        ? ritual.discente || ''
        : version === 'verdadeiro'
          ? ritual.verdadeiro || ''
          : ''
    const extraPe = parseExtraPe(versionText)
    const totalPe = peInfo.ajustado + extraPe
    const dt = 20 + totalPe

    const trainingBonus =
      ocultismoDegree >= 15 ? 15 : ocultismoDegree >= 10 ? 10 : ocultismoDegree >= 5 ? 5 : 0
    const diceCount = Math.max(1, intellect)
    const damageDice: string | undefined =
      version === 'discente'
        ? ritual.discenteDamage ||
          parseDamageDice(versionText) ||
          parseDamageDice(ritual.description || '') ||
          undefined
        : version === 'verdadeiro'
          ? ritual.verdadeiroDamage ||
            parseDamageDice(versionText) ||
            parseDamageDice(ritual.description || '') ||
            undefined
          : ritual.normalDamage || parseDamageDice(ritual.description || '') || undefined

    // Delegate rolling + 3D animation to the dice bandeja; apply game effects in the callback
    onRollRitual({
      name: ritual.name,
      version,
      diceCount,
      trainingBonus,
      dt,
      totalPe,
      damageDice,
      onResult: ({ rolls, best, total, damageResult }) => {
        const success = total >= dt
        const failMargin = success ? 0 : dt - total
        const sanLoss = success ? 0 : totalPe
        const failPermanent = !success && failMargin >= 5 ? 1 : 0

        // Always deduct PE
        onDeductPe(totalPe)
        if (!success) {
          onDeductSan(sanLoss)
          if (failPermanent > 0) onDeductPermSan(failPermanent)
        }

        setRitualRollResults((prev) => ({
          ...prev,
          [charRitual.id]: {
            charRitualId: charRitual.id,
            version,
            rolls,
            best,
            bonus: trainingBonus,
            total,
            dt,
            peCost: totalPe,
            success,
            failMargin,
            sanLoss,
            permSanLoss: failPermanent,
            damageDice,
            damageResult: success ? damageResult : undefined,
          },
        }))
      },
    })
  }

  return (
    <section className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 shadow-xl flex-1 h-full">
      {/* ═══════ TABS CUSTOMIZADOS ═══════ */}
      <div className="flex overflow-x-auto border-b border-zinc-800 mb-6 pb-[1px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 whitespace-nowrap transition-all duration-200 font-medium ${
                isActive
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Circle
                className={`w-2 h-2 fill-current ${isActive ? 'text-orange-500' : 'text-zinc-600'}`}
              />
              <Icon className="w-4 h-4" />
              <span className="text-base">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════
          TAB: INVENTÁRIO
         ═══════════════════════════════════════════ */}
      {activeTab === 'inventario' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-orange-600" />
              <h3 className="text-xl font-bold text-white font-serif tracking-wide">Inventário</h3>
            </div>
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </button>
          </div>

          {/* Peso + Patente */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <Scale className="w-4 h-4 text-orange-500" />
              <span
                className={`whitespace-nowrap ${inventoryCapacity.isOverloaded ? 'font-bold text-amber-500' : 'text-zinc-400'}`}
              >
                {inventoryCapacity.used} / {inventoryCapacity.limit} Espaços
              </span>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    inventoryCapacity.used > inventoryCapacity.maxCapacity
                      ? 'bg-red-500'
                      : inventoryCapacity.isOverloaded
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min((inventoryCapacity.used / inventoryCapacity.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Patente:
              </span>
              <Dropdown>
                <DropdownTrigger>
                  <button className="flex items-center gap-1 text-orange-500 font-bold hover:text-orange-400 transition-colors">
                    {isUpdatingRank ? '...' : rank} <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Selecionar Patente"
                  onAction={(key) => onRankChange(key as string)}
                  selectedKeys={[rank]}
                  selectionMode="single"
                  className="bg-zinc-900 border border-zinc-800"
                >
                  {RANK_OPTIONS.map((opt) => (
                    <DropdownItem
                      key={opt}
                      className={rank === opt ? 'text-white font-bold bg-zinc-800' : 'text-white'}
                    >
                      {opt}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-3 text-xs font-bold">
            {[1, 2, 3, 4].map((cat) => {
              const used = categoryConsumption[cat] || 0
              const limit = RANK_LIMITS[rank]?.[cat] ?? 0
              const isFull = used >= limit && limit > 0
              const isEmpty = limit === 0
              return (
                <div
                  key={cat}
                  className={`flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full ${
                    isEmpty ? 'text-zinc-500' : isFull ? 'text-red-400' : 'text-zinc-400'
                  }`}
                >
                  {!isEmpty && (
                    <div
                      className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-purple-500'}`}
                    />
                  )}
                  CAT {CAT_LABELS[cat]}: {used}/{limit}
                </div>
              )
            })}
          </div>

          {/* Alerta de sobrecarga */}
          {inventoryCapacity.isOverloaded && (
            <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-[10px] text-amber-500 border border-amber-500/20">
              <span className="animate-pulse font-bold">⚠️ SOBRECARGA:</span>
              <span>–5 em Defesa e Testes (Deslocamento Reduzido)</span>
            </div>
          )}

          {/* Filtros */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#141417] hover:bg-zinc-800 border border-zinc-800 rounded-md text-sm text-zinc-300 transition-colors">
              Todos os Tipos <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#141417] hover:bg-zinc-800 border border-zinc-800 rounded-md text-sm text-zinc-300 transition-colors">
              <ArrowUp className="w-4 h-4" /> Nome
            </button>
          </div>

          {/* Lista de itens */}
          <div className="space-y-2 overflow-y-auto custom-scrollbar">
            {inventory.length === 0 && (
              <div className="mt-8 flex items-center justify-center text-zinc-500 text-sm italic">
                Inventário vazio. Adicione itens acima.
              </div>
            )}
            {inventory.map((item) => {
              const isExpanded = expandedItemId === item.uniqueId
              const getIconForItem = () => {
                if (item.type === 'Arma') return <Sword size={18} />
                if (item.type === 'Armadura') return <Shield size={18} />
                if (item.type === 'Consumível') return <Zap size={18} />
                return <Activity size={18} />
              }
              const getIconColors = () => {
                if (item.type === 'Arma')
                  return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                if (item.type === 'Armadura')
                  return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                if (item.type === 'Consumível')
                  return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
              }
              return (
                <div
                  key={item.uniqueId}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-950 transition-all overflow-hidden"
                >
                  <div
                    onClick={() => onExpandItem(isExpanded ? null : item.uniqueId)}
                    className="flex items-center justify-between p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${getIconColors()}`}>
                        {getIconForItem()}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-200 text-sm">{item.name}</div>
                        <div className="text-[11px] text-zinc-500">{item.desc}</div>
                        {item.type === 'Arma' &&
                          item.calculatedCategory &&
                          item.calculatedCategory > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              <div className="px-1.5 py-0.5 rounded border bg-zinc-800/50 border-zinc-700/50 text-[9px] text-zinc-300 font-bold uppercase tracking-tight">
                                CAT{' '}
                                {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][
                                  item.calculatedCategory - 1
                                ] || item.calculatedCategory}
                              </div>
                              {item.modifications?.map((mod: any) => {
                                const isCurse = mod.type === 'Maldição'
                                const elementColor =
                                  mod.element === 'Sangue'
                                    ? 'text-red-400'
                                    : mod.element === 'Morte'
                                      ? 'text-zinc-400'
                                      : mod.element === 'Energia'
                                        ? 'text-purple-400'
                                        : mod.element === 'Conhecimento'
                                          ? 'text-amber-400'
                                          : 'text-red-400'
                                const elementBg =
                                  mod.element === 'Sangue'
                                    ? 'bg-red-500/10 border-red-500/20'
                                    : mod.element === 'Morte'
                                      ? 'bg-zinc-500/10 border-zinc-500/20'
                                      : mod.element === 'Energia'
                                        ? 'bg-purple-500/10 border-purple-500/20'
                                        : mod.element === 'Conhecimento'
                                          ? 'bg-amber-500/10 border-amber-500/20'
                                          : 'bg-red-500/10 border-red-500/20'
                                return (
                                  <div
                                    key={mod.id}
                                    className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tight ${
                                      isCurse
                                        ? `${elementBg} ${elementColor}`
                                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}
                                  >
                                    {mod.name}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">x{item.qty}</span>
                      <span className="px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-400 text-xs">
                        {item.type === 'Equipamento' ? 'Equip' : item.type}
                      </span>
                      <div className="flex items-center gap-1 border-l border-zinc-800 pl-3 ml-1">
                        {(item.itemKind === 'weapon' || item.itemKind === 'protection') && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEquipItem(item.id, item.equipped)
                            }}
                            className={`relative px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-300 border focus:outline-none min-w-[90px] ${
                              item.equipped
                                ? 'bg-amber-500 border-amber-500 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60'
                            }`}
                          >
                            {item.equipped ? 'EQUIPADO' : 'EQUIPAR'}
                          </motion.button>
                        )}
                        {item.type === 'Arma' && (
                          <button
                            className="p-1 rounded text-zinc-500 hover:text-blue-400 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              onModifyWeapon(item)
                            }}
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                        <button
                          className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveItem(item.id)
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <ChevronDown
                          size={16}
                          className={`text-zinc-600 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                  {isExpanded && item.type === 'Arma' && (
                    <div className="px-3 pb-3 pt-0 border-t border-zinc-800/50 mt-1">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                        {[
                          {
                            label: 'Dano',
                            value: item.damage,
                            extra: item.damageType ? ` (${item.damageType})` : '',
                          },
                          {
                            label: 'Categoria',
                            value:
                              item.calculatedCategory != null && item.calculatedCategory > 0
                                ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][
                                    item.calculatedCategory - 1
                                  ] || item.calculatedCategory
                                : '0',
                          },
                          { label: 'Alcance', value: item.range ?? '—' },
                          { label: 'Margem de Crítico', value: item.critical ?? '—' },
                          { label: 'Multiplicador', value: item.criticalMultiplier ?? '—' },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2"
                          >
                            <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                              {stat.label}
                            </p>
                            <p className="text-sm font-bold text-orange-300 mt-0.5">
                              {stat.value ?? '—'}
                              {stat.extra && (
                                <span className="text-xs font-normal text-orange-200/90">
                                  {stat.extra}
                                </span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB: RITUAIS
         ═══════════════════════════════════════════ */}
      {activeTab === 'rituais' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-white font-serif tracking-wide">Rituais</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                DT RITUAL {10 + Math.floor(nex / 5) + presence}
              </span>
              {isOcultista && (
                <button
                  onClick={onLearnRitual}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-md text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Aprender Ritual
                </button>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#141417] hover:bg-zinc-800 border border-zinc-800 rounded-md text-sm text-zinc-300 transition-colors">
              Todos os Elementos <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#141417] hover:bg-zinc-800 border border-zinc-800 rounded-md text-sm text-zinc-300 transition-colors">
              Todos os Círculos <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de Rituais */}
          <div className="space-y-4 overflow-y-auto custom-scrollbar">
            {characterRituals && characterRituals.length > 0 ? (
              characterRituals.map((charRitual: any) => {
                const ritual = charRitual.ritual
                if (!ritual) return null
                const elementColorMap: Record<string, string> = {
                  CONHECIMENTO: 'text-amber-400',
                  ENERGIA: 'text-purple-400',
                  MORTE: 'text-zinc-400',
                  SANGUE: 'text-red-400',
                  MEDO: 'text-white p-0.5 bg-zinc-800 rounded border border-white/20',
                }
                const elementColor =
                  elementColorMap[(ritual.element || '').toUpperCase()] || 'text-zinc-400'
                const peInfo = calcPeAjustado(ritual)
                const temReducao = peInfo.ajustado < peInfo.base
                const temAcrescimo = peInfo.ajustado > peInfo.base

                return (
                  <div
                    key={charRitual.id}
                    className="bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-bold text-zinc-100">{ritual.name}</h4>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 text-xs font-bold border border-zinc-800">
                            {ritual.circle}º Círculo
                          </span>
                          <span className={`text-xs font-bold uppercase ${elementColor}`}>
                            {ritual.element}
                          </span>
                          {/* Custo em PE */}
                          <div className="flex items-center gap-1">
                            {temReducao ? (
                              <span className="flex items-center gap-1">
                                <span className="text-[10px] text-zinc-400 line-through">
                                  {peInfo.base} PE
                                </span>
                                <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-1.5 py-0.5">
                                  {peInfo.ajustado} PE
                                </span>
                              </span>
                            ) : temAcrescimo ? (
                              <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5">
                                {peInfo.ajustado} PE
                              </span>
                            ) : (
                              <span className="text-[11px] font-black text-zinc-400 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5">
                                {peInfo.base} PE
                              </span>
                            )}
                          </div>
                          {hasRitualPotente && (
                            <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded px-1.5 py-0.5 flex items-center gap-1">
                              <Sparkles size={10} />+{intellect} dano/cura
                            </span>
                          )}
                        </div>
                        {peInfo.reducoes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {peInfo.reducoes.map((red, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-bold uppercase tracking-wide text-zinc-500 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5"
                              >
                                {red}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {hasCamuflarOcultismo && (
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wide text-zinc-500 hover:text-zinc-300 transition-colors select-none">
                            <input
                              type="checkbox"
                              checked={usarCamuflar}
                              onChange={(e) => onSetUsarCamuflar(e.target.checked)}
                              className="h-3 w-3 accent-purple-500 rounded"
                            />
                            Camuflar
                          </label>
                        )}
                        <button
                          className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                          onClick={() =>
                            onRemoveRitual(ritual.id, charRitual.characterClassAbilityId)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Botões de rolagem de ritual */}
                    <div className="flex flex-wrap gap-1.5">
                      {pe >= calcPeAjustado(ritual).ajustado &&
                        calcPeAjustado(ritual).ajustado <= Math.floor(nex / 5) && (
                          <button
                            onClick={() => handleRollRitual(charRitual, 'base')}
                            className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-wide transition-colors"
                            title={`Rolar ${ritual.name} — base`}
                          >
                            <Dices size={11} />
                            Base · {calcPeAjustado(ritual).ajustado} PE · DT{' '}
                            {20 + calcPeAjustado(ritual).ajustado}
                          </button>
                        )}
                      {ritual.discente &&
                        canUseRitualUpgrade(
                          ritual.discente,
                          ritual.element ?? '',
                          circuloMaximo,
                          characterAffinity
                        ) &&
                        pe >= calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.discente) &&
                        calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.discente) <=
                          Math.floor(nex / 5) && (
                          <button
                            onClick={() => handleRollRitual(charRitual, 'discente')}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wide transition-colors"
                            title={`Rolar ${ritual.name} — discente`}
                          >
                            <Dices size={11} />
                            Discente{' '}
                            {calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.discente)} PE ·
                            DT{' '}
                            {20 + calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.discente)}
                          </button>
                        )}
                      {ritual.verdadeiro &&
                        canUseRitualUpgrade(
                          ritual.verdadeiro,
                          ritual.element ?? '',
                          circuloMaximo,
                          characterAffinity
                        ) &&
                        pe >= calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.verdadeiro) &&
                        calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.verdadeiro) <=
                          Math.floor(nex / 5) && (
                          <button
                            onClick={() => handleRollRitual(charRitual, 'verdadeiro')}
                            className="flex items-center gap-1 px-2 py-1 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 rounded text-[10px] font-bold uppercase tracking-wide transition-colors"
                            title={`Rolar ${ritual.name} — verdadeiro`}
                          >
                            <Dices size={11} />
                            Verdadeiro{' '}
                            {calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.verdadeiro)} PE ·
                            DT{' '}
                            {20 + calcPeAjustado(ritual).ajustado + parseExtraPe(ritual.verdadeiro)}
                          </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-zinc-500 uppercase font-bold bg-zinc-900/50 p-2 rounded">
                      <div>
                        <span className="text-zinc-600 block">Execução</span> {ritual.execution}
                      </div>
                      <div>
                        <span className="text-zinc-600 block">Alcance</span> {ritual.range}
                      </div>
                      <div>
                        <span className="text-zinc-600 block">Duração</span> {ritual.duration}
                      </div>
                      {ritual.resistance && (
                        <div>
                          <span className="text-zinc-600 block">Resistência</span>{' '}
                          {ritual.resistance}
                        </div>
                      )}
                    </div>

                    {ritual.description && (
                      <p className="text-sm text-zinc-300 italic leading-relaxed">
                        {ritual.description}
                      </p>
                    )}

                    {(ritual.discente || ritual.verdadeiro) && (
                      <div className="space-y-2 pt-2 border-t border-zinc-800/50 text-xs text-zinc-400">
                        {ritual.discente &&
                          canUseRitualUpgrade(
                            ritual.discente,
                            ritual.element ?? '',
                            circuloMaximo,
                            characterAffinity
                          ) && (
                            <div>
                              <span className="text-blue-400 font-bold uppercase mr-1">
                                Discente:
                              </span>
                              {ritual.discente}
                            </div>
                          )}
                        {ritual.verdadeiro &&
                          canUseRitualUpgrade(
                            ritual.verdadeiro,
                            ritual.element ?? '',
                            circuloMaximo,
                            characterAffinity
                          ) && (
                            <div>
                              <span className="text-purple-400 font-bold uppercase mr-1">
                                Verdadeiro:
                              </span>
                              {ritual.verdadeiro}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="mt-8 flex items-center justify-center text-zinc-500 text-sm italic">
                Nenhum ritual aprendido.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB: COMBATE
         ═══════════════════════════════════════════ */}
      {activeTab === 'combate' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-bold text-white font-serif tracking-wide">Combate</h3>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                  DT Explosivo{' '}
                  <span className="text-white ml-1 text-sm">
                    {10 + Math.floor(nex / 5) + agility}
                  </span>
                </span>
                <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                  DT Ritual{' '}
                  <span className="text-white ml-1 text-sm">
                    {10 + Math.floor(nex / 5) + presence}
                  </span>
                </span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-md text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Adicionar Atalho
              </button>
            </div>
          </div>

          {/* Lista de Combate */}
          <div className="space-y-6 overflow-y-auto custom-scrollbar">
            {/* Armas */}
            {inventoryWeapons.filter((w: any) => w.equipped).length > 0 && (
              <div>
                <h4 className="font-bold text-orange-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sword size={14} /> Armas
                </h4>
                <div className="space-y-2">
                  {inventoryWeapons
                    .filter((w: any) => w.equipped)
                    .map((w: any) => {
                      const isMelee = w.range === 'Corpo a corpo'
                      const skillName = isMelee ? 'Luta' : 'Pontaria'
                      return (
                        <div
                          key={w.id}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-orange-500/30 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-zinc-200 text-sm truncate">
                              {w.name}
                            </div>
                            <div className="text-[11px] text-zinc-500 mt-0.5">
                              <span className="text-orange-400/80 font-bold">{w.damage}</span>
                              <span className="mx-1.5 text-zinc-700">·</span>
                              <span>{skillName}</span>
                              {!isMelee && w.range && (
                                <span className="ml-1 text-zinc-600">({w.range})</span>
                              )}
                            </div>
                          </div>
                          <button
                            className="ml-3 p-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg shrink-0 transition-colors"
                            title={`Rolar ${w.name}`}
                            onClick={() =>
                              onRollWeapon({
                                name: w.name,
                                range: w.range || 'Corpo a corpo',
                                damage: w.damage || '1d6',
                              })
                            }
                          >
                            <Dices size={15} />
                          </button>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Habilidades de Combate */}
            {classAbilities && classAbilities.length > 0 ? (
              <div>
                <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-3">
                  Habilidades de Combate
                </h4>
                <div className="space-y-2">
                  {classAbilities.map((ability, idx) => (
                    <div key={idx}>
                      {ability.classAbility?.name === 'Perito' && ability.config?.selectedSkills ? (
                        <div className="space-y-3">
                          {ability.config.selectedSkills.map((skillName: string) => {
                            const currentPe = peritoPeSpending[skillName] || 2
                            const diceBonus =
                              currentPe === 2
                                ? '1d6'
                                : currentPe === 3
                                  ? '1d8'
                                  : currentPe === 4
                                    ? '1d10'
                                    : '1d12'
                            return (
                              <div
                                key={skillName}
                                className="p-4 bg-zinc-950/50 rounded-lg border border-red-500/30 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-semibold text-red-300">
                                        {ability.classAbility?.name} - {skillName}
                                      </h5>
                                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                        {currentPe} PE = +{diceBonus}
                                      </span>
                                    </div>
                                  </div>
                                  <button className="ml-2 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg transition-colors">
                                    <Dices size={14} />
                                  </button>
                                </div>
                                {nex > 5 && maxPeritoPe > 2 && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-zinc-400">Gastar PE:</span>
                                      <span className="text-red-400 font-bold">{currentPe} PE</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={2}
                                      max={maxPeritoPe}
                                      step={1}
                                      value={currentPe}
                                      onChange={(e) => {
                                        onSetPeritoPeSpending({
                                          ...peritoPeSpending,
                                          [skillName]: parseInt(e.target.value),
                                        })
                                      }}
                                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                    <div className="flex justify-between text-xs text-zinc-500 px-1">
                                      <span>2</span>
                                      <span>{maxPeritoPe}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              inventoryWeapons.filter((w: any) => w.equipped).length === 0 &&
              activeOriginAbilities.length === 0 && (
                <div className="mt-16 flex items-center justify-center text-zinc-500 text-sm italic">
                  Nenhuma habilidade de combate disponível.
                </div>
              )
            )}

            {/* Habilidades Ativas da Origem */}
            {activeOriginAbilities.length > 0 && (
              <div>
                <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity size={14} /> Habilidades da Origem
                </h4>
                <div className="space-y-2">
                  {activeOriginAbilities.map((ability) => {
                    const isReaction = ability.type === 'reação'
                    const borderColor = isReaction
                      ? 'border-amber-500/30 hover:border-amber-500/50'
                      : 'border-emerald-500/30 hover:border-emerald-500/50'
                    const accentColor = isReaction ? 'text-amber-400' : 'text-emerald-400'
                    const bgAccent = isReaction
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'

                    return (
                      <div
                        key={ability.id}
                        className={`px-4 py-3 rounded-lg bg-zinc-950/60 border ${borderColor} transition-all`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`font-semibold text-sm ${accentColor}`}>
                                {ability.name}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${bgAccent}`}
                              >
                                {isReaction ? 'Reação' : 'Ativa'}
                              </span>
                            </div>

                            {/* Tags de mecânica */}
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {ability.peCost && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                  {ability.peCost}
                                </span>
                              )}
                              {ability.castTime && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                  {ability.castTime}
                                </span>
                              )}
                              {ability.range && ability.range !== 'Pessoal' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                  Alcance: {ability.range}
                                </span>
                              )}
                              {ability.duration && ability.duration !== 'Instantâneo' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
                                  {ability.duration}
                                </span>
                              )}
                              {ability.target && ability.target !== 'Você' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                                  {ability.target}
                                </span>
                              )}
                            </div>

                            {/* Descrição compacta */}
                            {ability.description && (
                              <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                                {ability.description}
                              </p>
                            )}
                          </div>

                          {/* Botão de rolagem (se tiver custo de PE, implica uso ativo) */}
                          {ability.peCost && (
                            <button
                              className={`ml-2 p-2 ${isReaction ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'} border rounded-lg shrink-0 transition-colors`}
                              title={`Usar ${ability.name}`}
                            >
                              <Dices size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          TAB: HABILIDADES
         ═══════════════════════════════════════════ */}
      {activeTab === 'habilidades' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Square className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-bold text-white font-serif tracking-wide">Habilidades</h3>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                {chosenClassAbilities}/{maxClassAbilities}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Poderes de Trilha (dropdown) */}
              {characterTrail?.id && futureTrailAbilities.length > 0 && (
                <Dropdown isOpen={isTrailPowersOpen} onOpenChange={onTrailPowersOpenChange}>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/50 rounded-md text-sm font-medium transition-colors">
                      <Sparkles className="w-4 h-4" />
                      Poderes de Trilha
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Trail powers"
                    className="max-h-96 overflow-y-auto"
                    classNames={{ base: 'bg-zinc-900 border border-zinc-800', list: 'bg-zinc-900' }}
                  >
                    {futureTrailAbilities.map((prog) => (
                      <DropdownItem
                        key={prog.id}
                        textValue={prog.title}
                        className="px-3 py-2 data-[hover=true]:bg-zinc-800"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-purple-300">{prog.title}</h5>
                            <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300 text-xs font-bold">
                              NEX {prog.nex}%
                            </span>
                          </div>
                          {prog.description && (
                            <p className="text-zinc-400 text-xs leading-relaxed">
                              {prog.description}
                            </p>
                          )}
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}
              {/* Escolher Trilha */}
              {hasNoTrail && classTrails.length > 0 && (
                <button
                  onClick={onOpenTrailModal}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/50 rounded-md text-sm font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Escolher Trilha
                </button>
              )}
              {/* Adicionar Habilidade */}
              <button
                onClick={onOpenAbilitySelect}
                disabled={!canChooseMore || availableAbilities.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Adicionar Habilidade
              </button>
            </div>
          </div>

          {/* Lista de Habilidades */}
          <div className="space-y-4">
            {/* ── HABILIDADE DA ORIGEM ── */}
            {originAbilityName && (
              <div>
                <button
                  onClick={() => onToggleSection('originAbility')}
                  className="w-full flex items-center justify-between py-2 text-emerald-400 hover:text-emerald-300 font-bold uppercase text-sm tracking-wider transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    HABILIDADE DA ORIGEM
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedSections.originAbility ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.originAbility && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2"
                    >
                      <div className="p-3 bg-[#141417] rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
                        <h5 className="font-semibold text-emerald-300 mb-1">{originAbilityName}</h5>
                        {originAbilityDescription && (
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            {originAbilityDescription}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── OBRIGATÓRIAS DA CLASSE ── */}
            {(() => {
              const mandatoryAbilities =
                classAbilities?.filter((ability) => {
                  const effects =
                    typeof ability.classAbility?.effects === 'string'
                      ? JSON.parse(ability.classAbility?.effects || '{}')
                      : ability.classAbility?.effects || {}
                  return effects.mandatory === true
                }) || []

              return mandatoryAbilities.length > 0 ? (
                <div>
                  <button
                    onClick={() => onToggleSection('classAbilities')}
                    className="w-full flex items-center justify-between py-2 text-amber-500 hover:text-amber-400 font-bold uppercase text-sm tracking-wider transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      OBRIGATÓRIAS DA CLASSE
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedSections.classAbilities ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSections.classAbilities && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 mt-2"
                      >
                        {mandatoryAbilities.map((ability, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#141417] rounded-lg border border-zinc-800/50 hover:border-amber-500/30 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-semibold text-amber-300">
                                    {ability.classAbility?.name}
                                  </h5>
                                  {ability.classAbility?.name === 'Perito' &&
                                    ability.config?.selectedSkills && (
                                      <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 text-xs font-bold">
                                        ✓ Configurada
                                      </span>
                                    )}
                                </div>
                                <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                  {ability.classAbility?.description}
                                </p>
                                {ability.classAbility?.name === 'Perito' &&
                                  ability.config?.selectedSkills && (
                                    <p className="text-zinc-500 text-xs mt-2">
                                      <span className="text-amber-400">Perícias:</span>{' '}
                                      {ability.config.selectedSkills.join(', ')}
                                    </p>
                                  )}
                              </div>
                              {ability.classAbility?.name === 'Perito' && (
                                <button
                                  className="ml-2 p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-lg transition-colors"
                                  onClick={() => onOpenAbilityConfig(ability)}
                                >
                                  <Edit3 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null
            })()}

            {/* ── HABILIDADES ESCOLHIDAS ── */}
            {(() => {
              const chosenAbilities =
                classAbilities?.filter((ability) => {
                  const effects =
                    typeof ability.classAbility?.effects === 'string'
                      ? JSON.parse(ability.classAbility?.effects || '{}')
                      : ability.classAbility?.effects || {}
                  // Excluir obrigatórias e Transcender (que tem seção própria)
                  if (effects.mandatory === true) return false
                  if (ability.classAbility?.name === 'Transcender') return false
                  return true
                }) || []

              return (
                <div>
                  <button
                    onClick={() => onToggleSection('chosenAbilities')}
                    className="w-full flex items-center justify-between py-2 text-blue-500 hover:text-blue-400 font-bold uppercase text-sm tracking-wider transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      HABILIDADES ESCOLHIDAS
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedSections.chosenAbilities ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSections.chosenAbilities && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 mt-2"
                      >
                        {chosenAbilities.length > 0 ? (
                          chosenAbilities.map((ability, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-[#141417] rounded-lg border border-zinc-800/50 hover:border-blue-500/30 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-semibold text-blue-300">
                                      {ability.classAbility?.name}
                                    </h5>
                                    {ability.classAbility?.effects?.nex && (
                                      <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300 text-xs font-bold">
                                        NEX {ability.classAbility.effects.nex}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                    {ability.classAbility?.description}
                                  </p>

                                  {/* Badges mecânicas */}
                                  {ability.classAbility?.name === 'Perito' &&
                                    peritoSkills.length > 0 && (
                                      <div className="mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-amber-400/60 tracking-wider">
                                          Ao usar:
                                        </span>
                                        <span className="text-[11px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5">
                                          +{peritoBonus.dice} por {peritoBonus.cost} PE
                                        </span>
                                        <span className="text-[9px] text-zinc-500">
                                          nas perícias:
                                        </span>
                                        {peritoSkills.map((s, i) => (
                                          <span
                                            key={i}
                                            className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5"
                                          >
                                            {s}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  {ability.classAbility?.name === 'Eclético' && (
                                    <div className="mt-2 p-2 rounded bg-blue-500/5 border border-blue-500/20 flex flex-wrap items-center gap-2">
                                      <span className="text-[9px] font-black uppercase text-blue-400/60 tracking-wider">
                                        Ao usar:
                                      </span>
                                      <span className="text-[11px] font-black text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5">
                                        2 PE → Treinado
                                      </span>
                                      {hasEngenhosidade && nex >= 40 && (
                                        <>
                                          <span className="text-[11px] font-black text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5">
                                            4 PE → Veterano
                                          </span>
                                          {nex >= 75 && (
                                            <span className="text-[11px] font-black text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5">
                                              8 PE → Expert
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                  {ability.classAbility?.name === 'Tiro Certeiro' && (
                                    <div className="mt-2 p-2 rounded bg-emerald-500/5 border border-emerald-500/20 flex flex-wrap items-center gap-2">
                                      <span className="text-[9px] font-black uppercase text-emerald-400/60 tracking-wider">
                                        Com armas de fogo:
                                      </span>
                                      <span className="text-[11px] font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
                                        +{agility} no dano
                                      </span>
                                      <span className="text-[10px] text-zinc-500">
                                        Ignora penalidade em combate corpo a corpo
                                      </span>
                                    </div>
                                  )}
                                  {ability.classAbility?.name === 'Ritual Potente' && (
                                    <div className="mt-2 p-2 rounded bg-violet-500/5 border border-violet-500/20 flex flex-wrap items-center gap-2">
                                      <span className="text-[9px] font-black uppercase text-violet-400/60 tracking-wider">
                                        Passivo nos rituais:
                                      </span>
                                      <span className="text-[11px] font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded px-2 py-0.5">
                                        <Sparkles size={10} className="inline mr-1" />+{intellect}{' '}
                                        dano/cura
                                      </span>
                                    </div>
                                  )}
                                  {ability.classAbility?.name === 'Camuflar Ocultismo' && (
                                    <div className="mt-2 p-2 rounded bg-zinc-500/5 border border-zinc-500/20 flex flex-wrap items-center gap-2">
                                      <span className="text-[9px] font-black uppercase text-zinc-400/60 tracking-wider">
                                        Opcional (por ritual):
                                      </span>
                                      <span className="text-[11px] font-black text-zinc-300 bg-zinc-500/10 border border-zinc-500/20 rounded px-2 py-0.5">
                                        +2 PE → Ritual invisível
                                      </span>
                                      <span className="text-[9px] text-zinc-500">
                                        (Ativar via checkbox em cada ritual)
                                      </span>
                                    </div>
                                  )}
                                  {ability.classAbility?.name === 'Ritual Predileto' && (
                                    <div className="mt-2 p-2 rounded bg-blue-500/5 border border-blue-500/20 flex flex-wrap items-center gap-2">
                                      <span className="text-[9px] font-black uppercase text-blue-400/60 tracking-wider">
                                        Passivo:
                                      </span>
                                      <span className="text-[11px] font-black text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5">
                                        –1 PE em {ritualPrediletoConfig || 'ritual não configurado'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                  {(ability.classAbility?.name === 'Perito' ||
                                    ability.classAbility?.name === 'Ritual Predileto' ||
                                    ability.classAbility?.name === 'Mestre em Elemento' ||
                                    ability.classAbility?.name === 'Especialista em Elemento') && (
                                    <button
                                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 rounded-lg transition-colors"
                                      onClick={() => onOpenAbilityConfig(ability)}
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                  )}
                                  <button
                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg transition-colors"
                                    onClick={() => {
                                      if (
                                        confirm('Tem certeza que deseja remover esta habilidade?')
                                      )
                                        onRemoveAbility(characterId, ability.id)
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-[#141417] border border-zinc-800/50 rounded-lg p-6 flex items-center justify-center text-zinc-500 text-sm italic">
                            Nenhuma habilidade escolhida. Use o botão "Adicionar Habilidade" acima.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })()}

            {/* ── PODERES PARANORMAIS ── */}
            {paranormalPowers && paranormalPowers.length > 0 && (
              <div>
                <button
                  onClick={() => onToggleSection('paranormalPowers')}
                  className="w-full flex items-center justify-between py-2 text-purple-500 hover:text-purple-400 font-bold uppercase text-sm tracking-wider transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    PODERES PARANORMAIS
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedSections.paranormalPowers ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.paranormalPowers && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 mt-2"
                    >
                      {paranormalPowers.map((power, idx) => {
                        const p = power.paranormalPower
                        const elementColor =
                          (
                            {
                              Conhecimento: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                              Energia: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
                              Morte: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
                              Sangue: 'bg-red-500/10 border-red-500/30 text-red-300',
                              Varia: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
                            } as Record<string, string>
                          )[p?.element || ''] || 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300'

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border flex flex-col gap-3 transition-all hover:bg-zinc-950/80 ${elementColor}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-base">{p?.name}</h5>
                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                    {p?.element}
                                  </span>
                                </div>
                                {p?.requirements && (
                                  <p className="text-[10px] opacity-60 uppercase mt-0.5">
                                    Requisito: {p.requirements}
                                  </p>
                                )}
                              </div>
                              <button
                                className="p-1 rounded text-current opacity-40 hover:opacity-100 transition-opacity"
                                onClick={() =>
                                  p?.id &&
                                  onRemoveParanormalPower(p.id, power.characterClassAbilityId)
                                }
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            {p?.description && (
                              <p className="text-xs leading-relaxed opacity-90 italic">
                                {p.description}
                              </p>
                            )}
                            <div className="flex flex-col gap-2 pt-2 border-t border-current/20">
                              {p?.effects?.main && (
                                <div>
                                  <p className="text-[9px] font-black uppercase opacity-60 mb-1">
                                    Efeito
                                  </p>
                                  <p className="text-xs leading-relaxed">{p.effects.main}</p>
                                </div>
                              )}
                              {p?.effects?.affinity && (
                                <div className="bg-white/5 p-2 rounded border border-white/10 mt-1">
                                  <p className="text-[9px] font-black uppercase text-white/50 mb-1">
                                    Afinidade
                                  </p>
                                  <p className="text-xs leading-relaxed text-white/80">
                                    {p.effects.affinity}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── RITUAIS APRENDIDOS (na aba habilidades) ── */}
            {characterRituals && characterRituals.length > 0 && (
              <div>
                <button
                  onClick={() => onToggleSection('rituals')}
                  className="w-full flex items-center justify-between py-2 text-blue-500 hover:text-blue-400 font-bold uppercase text-sm tracking-wider transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    RITUAIS APRENDIDOS
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedSections.rituals ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.rituals && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 mt-2"
                    >
                      {characterRituals.map((characterRitual, idx) => {
                        const r = characterRitual.ritual
                        const elementColor =
                          (
                            {
                              Conhecimento: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                              Energia: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
                              Morte: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
                              Sangue: 'bg-red-500/10 border-red-500/30 text-red-300',
                            } as Record<string, string>
                          )[r?.element || ''] || 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300'
                        const peInfo = calcPeAjustado(r)
                        const temReducao = peInfo.ajustado < peInfo.base
                        const temAcrescimo = peInfo.ajustado > peInfo.base

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border flex flex-col gap-3 transition-all hover:bg-zinc-950/80 ${elementColor}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-bold text-base">{r?.name}</h5>
                                  <span className="px-1.5 py-0.5 rounded bg-black/20 text-current border border-current/20 text-xs font-bold">
                                    {r?.circle}º Círculo
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                    {r?.element}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {temReducao ? (
                                      <span className="flex items-center gap-1">
                                        <span className="text-[10px] text-zinc-400 line-through">
                                          {peInfo.base} PE
                                        </span>
                                        <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-1.5 py-0.5">
                                          {peInfo.ajustado} PE
                                        </span>
                                      </span>
                                    ) : temAcrescimo ? (
                                      <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5">
                                        {peInfo.ajustado} PE
                                      </span>
                                    ) : (
                                      <span className="text-[11px] font-black opacity-60 bg-black/20 border border-current/20 rounded px-1.5 py-0.5">
                                        {peInfo.base} PE
                                      </span>
                                    )}
                                  </div>
                                  {hasRitualPotente && (
                                    <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded px-1.5 py-0.5 flex items-center gap-1">
                                      <Sparkles size={10} />+{intellect} dano/cura
                                    </span>
                                  )}
                                </div>
                                {peInfo.reducoes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {peInfo.reducoes.map((red, i) => (
                                      <span
                                        key={i}
                                        className="text-[9px] font-bold uppercase tracking-wide opacity-60 bg-current/5 border border-current/10 rounded px-1.5 py-0.5"
                                      >
                                        {red}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {hasCamuflarOcultismo && (
                                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wide opacity-70 hover:opacity-100 transition-opacity select-none">
                                    <input
                                      type="checkbox"
                                      checked={usarCamuflar}
                                      onChange={(e) => onSetUsarCamuflar(e.target.checked)}
                                      className="h-3 w-3 accent-current rounded"
                                    />
                                    Camuflar
                                  </label>
                                )}
                                <button
                                  className="p-1 rounded text-current opacity-40 hover:opacity-100 transition-opacity"
                                  onClick={() =>
                                    r?.id &&
                                    onRemoveRitual(r.id, characterRitual.characterClassAbilityId)
                                  }
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] uppercase font-bold opacity-70">
                              <div>
                                <span className="opacity-50">Execução:</span> {r?.execution}
                              </div>
                              <div>
                                <span className="opacity-50">Alcance:</span> {r?.range}
                              </div>
                              <div>
                                <span className="opacity-50">Alvo:</span> {r?.target}
                              </div>
                              <div>
                                <span className="opacity-50">Duração:</span> {r?.duration}
                              </div>
                            </div>
                            {r?.description && (
                              <p className="text-xs leading-relaxed opacity-90 italic border-t border-current/10 pt-2">
                                {r.description}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── TRILHA ── */}
            {characterTrail && currentTrailAbilities && currentTrailAbilities.length > 0 && (
              <div>
                <button
                  onClick={() => onToggleSection('trailAbilities')}
                  className="w-full flex items-center justify-between py-2 text-purple-500 hover:text-purple-400 font-bold uppercase text-sm tracking-wider transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    TRILHA: {characterTrail.name}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${expandedSections.trailAbilities ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSections.trailAbilities && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 mt-2"
                    >
                      {currentTrailAbilities.map((progression, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#141417] rounded-lg border border-zinc-800/50 hover:border-purple-500/30 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-purple-300">
                                  {progression.title}
                                </h5>
                                <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300 text-xs font-bold">
                                  NEX {progression.nex}%
                                </span>
                              </div>
                              {progression.description && (
                                <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                  {progression.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── HABILIDADES DE TRANSCENDER ── */}
            {(() => {
              const transcendPowers =
                classAbilities?.filter((ability) => ability.classAbility?.name === 'Transcender') ||
                []

              return (
                <div>
                  <button
                    onClick={() => onToggleSection('acquiredAbilities')}
                    className="w-full flex items-center justify-between py-2 text-red-500 hover:text-red-400 font-bold uppercase text-sm tracking-wider transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      HABILIDADES DE TRANSCENDER ({transcendPowers.length})
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedSections.acquiredAbilities ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSections.acquiredAbilities && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 mt-2"
                      >
                        {transcendPowers.length > 0 ? (
                          transcendPowers.map((ability, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-[#141417] rounded-lg border border-zinc-800/50 hover:border-red-500/30 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-semibold text-red-300">
                                      {ability.classAbility?.name}
                                    </h5>
                                    <span className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-400 text-xs font-bold">
                                      #{idx + 1}
                                    </span>
                                  </div>
                                  <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                    {ability.classAbility?.description}
                                  </p>
                                </div>
                                <button
                                  className="ml-3 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg transition-colors shrink-0"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        'Remover este Transcender irá também remover o poder/ritual vinculado e restaurar a sanidade máxima. Confirmar?'
                                      )
                                    )
                                      onRemoveAbility(characterId, ability.id)
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-[#141417] border border-zinc-800/50 rounded-lg p-6 flex items-center justify-center text-zinc-500 text-sm italic">
                            Nenhum poder paranormal adquirido ainda
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </section>
  )
}
