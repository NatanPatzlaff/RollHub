import { motion, AnimatePresence } from 'framer-motion'
import {
  Card, CardBody,
  Tabs, Tab, Button, Chip,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@heroui/react'
import { ChevronDown, Plus, Edit3, Trash2, Sword, Shield, Zap, Activity, Sparkles, Dices } from 'lucide-react'

const RANK_OPTIONS = ['Recruta', 'Veterano', 'Expert']
const RANK_LIMITS: Record<string, Record<number, number>> = {
  Recruta: { 1: 2, 2: 0, 3: 0, 4: 0 },
  Veterano: { 1: 2, 2: 2, 3: 0, 4: 0 },
  Expert: { 1: 2, 2: 2, 3: 1, 4: 0 },
}
const CAT_LABELS: Record<number, string> = { 0: '0', 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

export interface CharacterTabsCardProps {
  inventory: any[]; inventoryCapacity: { used: number; limit: number; maxCapacity: number; isOverloaded: boolean }
  categoryConsumption: Record<number, number>; rank: string; isUpdatingRank: boolean
  expandedItemId: string | number | null; inventoryWeapons: any[]
  onAddItem: () => void; onRankChange: (rank: string) => void; onModifyWeapon: (item: any) => void
  onRemoveItem: (id: number) => void; onExpandItem: (id: string | number | null) => void
  characterRituals: any[]; isOcultista: boolean; onLearnRitual: () => void; onRemoveRitual: (id: number) => void
  nex: number; agility: number; presence: number; strength: number
  peritoPeSpending: Record<string, number>; maxPeritoPe: number
  onRollWeapon: (w: { name: string; range: string; damage: string }) => void
  classAbilities: any[]; paranormalPowers: any[]; currentTrailAbilities: any[]
  futureTrailAbilities: any[]; characterTrail: any; chosenClassAbilities: number; maxClassAbilities: number
  canChooseMore: boolean; availableAbilities: any[]; hasNoTrail: boolean; classTrails: any[]
  expandedSections: Record<string, boolean>; hasRitualPotente: boolean; hasCamuflarOcultismo: boolean
  hasEngenhosidade: boolean; intellect: number; peritoSkills: string[]
  peritoBonus: { dice: string; cost: number }; isTrailPowersOpen: boolean
  ritualPrediletoConfig: string | null; usarCamuflar: boolean
  calcPeAjustado: (ritual: any) => { base: number; ajustado: number; reducoes: string[] }
  onToggleSection: (key: string) => void; onTrailPowersOpenChange: (open: boolean) => void
  onOpenTrailModal: () => void; onOpenAbilitySelect: () => void; onOpenAbilityConfig: (ability: any) => void
  onRemoveAbility: (characterId: number, abilityId: number) => void
  onRemoveParanormalPower: (id: number) => void; onSetUsarCamuflar: (v: boolean) => void
  onSetPeritoPeSpending: (v: Record<string, number>) => void; characterId: number
}

export default function CharacterTabsCard({
  inventory, inventoryCapacity, categoryConsumption, rank, isUpdatingRank, expandedItemId, inventoryWeapons,
  onAddItem, onRankChange, onModifyWeapon, onRemoveItem, onExpandItem,
  characterRituals, isOcultista, onLearnRitual, onRemoveRitual,
  nex, agility, presence, strength, peritoPeSpending, maxPeritoPe, onRollWeapon,
  classAbilities, paranormalPowers, currentTrailAbilities, futureTrailAbilities, characterTrail,
  chosenClassAbilities, maxClassAbilities, canChooseMore, availableAbilities, hasNoTrail, classTrails,
  expandedSections, hasRitualPotente, hasCamuflarOcultismo, hasEngenhosidade, intellect,
  peritoSkills, peritoBonus, isTrailPowersOpen, ritualPrediletoConfig, usarCamuflar, calcPeAjustado,
  onToggleSection, onTrailPowersOpenChange, onOpenTrailModal, onOpenAbilitySelect, onOpenAbilityConfig,
  onRemoveAbility, onRemoveParanormalPower, onSetUsarCamuflar, characterId, onSetPeritoPeSpending,
}: CharacterTabsCardProps) {
  return (
    <Card className="bg-zinc-900 border border-zinc-800 shadow-none flex-1 flex flex-col">
      <Tabs
        aria-label="Inventário"
        variant="underlined"
        classNames={{
          base: 'w-full',
          tabList:
            'gap-6 w-full relative rounded-none p-0 px-6 border-b border-zinc-800 custom-scrollbar',
          cursor: 'w-full bg-orange-500',
          tab: 'max-w-fit px-0 h-14',
          tabContent: 'group-data-[selected=true]:text-orange-500 text-zinc-400 font-bold',
          panel: 'p-0',
        }}
      >
        <Tab
          key="inventory"
          title={
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Inventário</span>
            </div>
          }
        >
          <div className="p-5">
            {/* Inventory Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-orange-500/20 rounded text-orange-500">
                  <div className="w-4 h-4 border-2 border-orange-500 rounded-sm"></div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Inventário</h3>
              </div>
              <Button
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                onPress={onAddItem}
              >
                <Plus size={14} className="mr-2" /> Adicionar Item
              </Button>
            </div>

            {/* Weight Bar + Rank Selection */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">⚖️</span>
                  <span
                    className={`text-xs ${inventoryCapacity.isOverloaded ? 'font-bold text-amber-500' : 'text-zinc-400'}`}
                  >
                    {inventoryCapacity.used} / {inventoryCapacity.limit} Espaços
                  </span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${inventoryCapacity.used > inventoryCapacity.maxCapacity
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
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Patente:
                  </span>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-zinc-800 text-orange-400 font-bold border border-zinc-700 h-7 px-2"
                        isLoading={isUpdatingRank}
                      >
                        {rank} <ChevronDown size={14} className="ml-1" />
                      </Button>
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

              {/* Category Limits Display */}
              <div className="flex items-center flex-wrap gap-2">
                {[1, 2, 3, 4].map((cat) => {
                  const used = categoryConsumption[cat] || 0
                  const limit = RANK_LIMITS[rank]?.[cat] ?? 0
                  const isFull = used >= limit && limit > 0
                  const isEmpty = limit === 0

                  return (
                    <Chip
                      key={cat}
                      size="sm"
                      variant="dot"
                      color={isEmpty ? 'default' : isFull ? 'danger' : 'primary'}
                      className={`bg-zinc-800/50 border-zinc-700 ${isEmpty ? 'opacity-40' : ''}`}
                      classNames={{
                        content: 'font-bold text-[10px]',
                      }}
                    >
                      CAT {CAT_LABELS[cat]}: {used}/{limit}
                    </Chip>
                  )
                })}
              </div>

              {inventoryCapacity.isOverloaded && (
                <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-[10px] text-amber-500 border border-amber-500/20">
                  <span className="animate-pulse font-bold">⚠️ SOBRECARGA:</span>
                  <span>–5 em Defesa e Testes (Deslocamento Reduzido)</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    <option>Todos os Tipos</option>
                    <option>Arma</option>
                    <option>Armadura</option>
                    <option>Consumível</option>
                    <option>Diversos</option>
                  </select>
                  <button className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-white">
                    ↑ Nome
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto custom-scrollbar">
              {inventory.map((item) => {
                const isExpanded = expandedItemId === item.uniqueId
                const getIconForItem = () => {
                  if (item.type === 'Arma') {
                    return <Sword size={18} />
                  }
                  if (item.type === 'Armadura') {
                    return <Shield size={18} />
                  }
                  if (item.type === 'Consumível') {
                    return <Zap size={18} />
                  }
                  return <Activity size={18} />
                }
                const getIconColors = () => {
                  if (item.type === 'Arma') {
                    return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                  }
                  if (item.type === 'Armadura') {
                    return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }
                  if (item.type === 'Consumível') {
                    return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                  }
                  return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                }
                const categoryLabels: Record<number, string> = {
                  0: '0',
                  1: 'I',
                  2: 'II',
                  3: 'III',
                  4: 'IV',
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
                          <div className="font-semibold text-zinc-200 text-sm">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-zinc-500">{item.desc}</div>
                          {item.type === 'Arma' && item.calculatedCategory && item.calculatedCategory > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              <div className="px-1.5 py-0.5 rounded border bg-zinc-800/50 border-zinc-700/50 text-[9px] text-zinc-300 font-bold uppercase tracking-tight">
                                CAT {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][item.calculatedCategory - 1] || item.calculatedCategory}
                              </div>
                              {item.modifications?.map((mod: any) => {
                                const isCurse = mod.type === 'Maldição'
                                const elementColor =
                                  mod.element === 'Sangue' ? 'text-red-400' :
                                    mod.element === 'Morte' ? 'text-zinc-400' :
                                      mod.element === 'Energia' ? 'text-purple-400' :
                                        mod.element === 'Conhecimento' ? 'text-amber-400' :
                                          'text-red-400'

                                const elementBg =
                                  mod.element === 'Sangue' ? 'bg-red-500/10 border-red-500/20' :
                                    mod.element === 'Morte' ? 'bg-zinc-500/10 border-zinc-500/20' :
                                      mod.element === 'Energia' ? 'bg-purple-500/10 border-purple-500/20' :
                                        mod.element === 'Conhecimento' ? 'bg-amber-500/10 border-amber-500/20' :
                                          'bg-red-500/10 border-red-500/20'

                                return (
                                  <div
                                    key={mod.id}
                                    className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tight ${isCurse ? `${elementBg} ${elementColor}` : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
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
                          {item.type === 'Arma' && (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="text-zinc-500 hover:text-blue-400 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()

                                onModifyWeapon(item)
                              }}
                            >
                              <Edit3 size={16} />
                            </Button>
                          )}

                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-zinc-500 hover:text-red-400 h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRemoveItem(item.id)
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
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
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                            <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                              Dano
                            </p>
                            <p className="text-sm font-bold text-orange-300 mt-0.5">
                              {item.damage ?? '—'}
                              {item.damageType ? (
                                <span className="text-xs font-normal text-orange-200/90">
                                  {' '}
                                  ({item.damageType})
                                </span>
                              ) : null}
                            </p>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                            <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                              Categoria
                            </p>
                            <p className="text-sm font-bold text-orange-300 mt-0.5">
                              {(item.calculatedCategory != null && item.calculatedCategory > 0)
                                ? (['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][item.calculatedCategory - 1] || item.calculatedCategory)
                                : '0'}
                            </p>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                            <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                              Alcance
                            </p>
                            <p className="text-sm font-bold text-orange-300 mt-0.5">
                              {item.range ?? '—'}
                            </p>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                            <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                              Margem de Crítico
                            </p>
                            <p className="text-sm font-bold text-orange-300 mt-0.5">
                              {item.critical ?? '—'}
                            </p>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                            <p className="text-[9px] uppercase tracking-wider text-orange-400/90 font-bold">
                              Multiplicador
                            </p>
                            <p className="text-sm font-bold text-orange-300 mt-0.5">
                              {item.criticalMultiplier ?? '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Tab>
        <Tab
          key="rituals"
          title={
            <div className="flex items-center space-x-2">
              <span>🔥 Rituais</span>
            </div>
          }
        >
          <div className="p-6">
            {/* Rituals Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-500/20 rounded text-red-500">
                  <div className="w-4 h-4 border-2 border-red-500 rounded-sm"></div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Rituais</h3>
              </div>
              {isOcultista && (
                <Button
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                  onPress={() => onLearnRitual()}
                >
                  <Plus size={14} className="mr-2" /> Aprender Ritual
                </Button>
              )}
            </div>

            {/* Rituals List */}
            <div className="space-y-4 overflow-y-auto custom-scrollbar">
              {characterRituals && characterRituals.length > 0 ? (
                characterRituals.map((charRitual: any) => {
                  const ritual = charRitual.ritual
                  if (!ritual) return null

                  const elementColor = (({
                    CONHECIMENTO: 'text-amber-400',
                    ENERGIA: 'text-purple-400',
                    MORTE: 'text-zinc-400',
                    SANGUE: 'text-red-400',
                    MEDO: 'text-white p-0.5 bg-zinc-800 rounded border border-white/20',
                  } as Record<string, string>)[(ritual.element || '').toUpperCase()]) || 'text-zinc-400'

                  return (
                    <Card
                      key={charRitual.id}
                      className="bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <CardBody className="h-36 overflow-hidden flex flex-col gap-1 py-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-zinc-100">{ritual.name}</h3>
                              <Chip size="sm" variant="flat" className="bg-zinc-900 text-zinc-400">
                                {ritual.circle}º Círculo
                              </Chip>
                            </div>
                            <p className={`text-xs font-bold uppercase ${elementColor} mt-1`}>
                              {ritual.element}
                            </p>
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            className="opacity-50 hover:opacity-100"
                            onPress={() => onRemoveRitual(ritual.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
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
                              <span className="text-zinc-600 block">Resistência</span> {ritual.resistance}
                            </div>
                          )}
                        </div>

                        {ritual.description && (
                          <p className="text-sm text-zinc-300 italic leading-relaxed">
                            {ritual.description}
                          </p>
                        )}

                        {(ritual.discente || ritual.verdadeiro) && (
                          <div className="space-y-2 mt-2 pt-2 border-t border-zinc-800/50 text-xs text-zinc-400">
                            {ritual.discente && (
                              <div>
                                <span className="text-blue-400 font-bold uppercase mr-1">Discente:</span>
                                {ritual.discente}
                              </div>
                            )}
                            {ritual.verdadeiro && (
                              <div>
                                <span className="text-purple-400 font-bold uppercase mr-1">Verdadeiro:</span>
                                {ritual.verdadeiro}
                              </div>
                            )}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  )
                })
              ) : (
                <div className="text-zinc-500 text-center italic py-12 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-800">
                  Nenhum ritual aprendido. Use o botão acima para adicionar.
                </div>
              )}
            </div>
          </div>
        </Tab>
        <Tab
          key="combat"
          title={
            <div className="flex items-center space-x-2">
              <span>⚔️ Combate</span>
            </div>
          }
        >
          <div className="p-6">
            {/* Combat Header */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-600/20 rounded text-red-500">
                  <div className="w-4 h-4 border-2 border-red-600 rounded-sm"></div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Combate</h3>
              </div>
              {/* DT Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-[10px] uppercase tracking-wider text-red-400/70 font-bold whitespace-nowrap">DT Explosivo</span>
                  <span className="text-sm font-black text-red-300">
                    {10 + Math.floor(nex / 5) + agility}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <span className="text-[10px] uppercase tracking-wider text-violet-400/70 font-bold whitespace-nowrap">DT Ritual</span>
                  <span className="text-sm font-black text-violet-300">
                    {10 + Math.floor(nex / 5) + presence}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
              >
                <Plus size={14} className="mr-2" /> Adicionar Atalho
              </Button>
            </div>

            {/* Combat List */}
            <div className="space-y-6 overflow-y-auto custom-scrollbar">
              {/* ARMAS */}
              {inventoryWeapons.length > 0 && (
                <div>
                  <h4 className="font-bold text-orange-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sword size={14} /> Armas
                  </h4>
                  <div className="space-y-2">
                    {inventoryWeapons.map((w: any) => {
                      const isMelee = w.range === 'Corpo a corpo'
                      const skillName = isMelee ? 'Luta' : 'Pontaria'
                      return (
                        <div
                          key={w.id}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-orange-500/30 transition-all"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-zinc-200 text-sm truncate">{w.name}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5">
                              <span className="text-orange-400/80 font-bold">{w.damage}</span>
                              <span className="mx-1.5 text-zinc-700">·</span>
                              <span>{skillName}</span>
                              {!isMelee && w.range && <span className="ml-1 text-zinc-600">({w.range})</span>}
                            </div>
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            className="ml-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 shrink-0"
                            title={`Rolar ${w.name}`}
                            onClick={() => {
                              onRollWeapon({ name: w.name, range: w.range || 'Corpo a corpo', damage: w.damage || '1d6' })
                            }}
                          >
                            <Dices size={15} />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* HABILIDADES DE COMBATE DA CLASSE */}
              {classAbilities && classAbilities.length > 0 ? (
                <div>
                  <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-3">
                    Habilidades de Combate
                  </h4>
                  <div className="space-y-2">
                    {classAbilities.map((ability, idx) => (
                      <div key={idx}>
                        {/* Perito: Show configured skills for rolling */}
                        {ability.classAbility?.name === 'Perito' &&
                          ability.config?.selectedSkills ? (
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
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      className="ml-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40"
                                    >
                                      <Dices size={14} />
                                    </Button>
                                  </div>

                                  {/* PE Cost Slider - Only show if NEX > 5 and max PE > 2 */}
                                  {nex > 5 && maxPeritoPe > 2 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-400">Gastar PE:</span>
                                        <span className="text-red-400 font-bold">
                                          {currentPe} PE
                                        </span>
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
                <div className="text-zinc-500 text-center italic py-8">
                  Nenhuma habilidade de combate disponível.
                </div>
              )}
            </div>
          </div>
        </Tab>
        <Tab
          key="skills"
          title={
            <div className="flex items-center space-x-2">
              <span>⚡ Habilidades</span>
            </div>
          }
        >
          <div className="p-6">
            {/* Skills Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-500/20 rounded text-amber-500">
                  <div className="w-4 h-4 border-2 border-amber-500 rounded-sm"></div>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">Habilidades</h3>
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 text-xs font-bold">
                  {chosenClassAbilities}/{maxClassAbilities}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {characterTrail?.id && futureTrailAbilities.length > 0 && (
                  <Dropdown isOpen={isTrailPowersOpen} onOpenChange={onTrailPowersOpenChange}>
                    <DropdownTrigger>
                      <Button
                        size="sm"
                        className="bg-purple-800 hover:bg-purple-700 text-white border border-purple-700"
                      >
                        <Sparkles size={14} className="mr-2" /> Poderes de Trilha
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Trail powers"
                      className="max-h-96 overflow-y-auto"
                      classNames={{
                        base: 'bg-zinc-900 border border-zinc-800',
                        list: 'bg-zinc-900',
                      }}
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

                {/* Trail selection button for characters with no trail and eligible class trails */}
                {hasNoTrail && classTrails.length > 0 && (
                  <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800 text-white border border-purple-700"
                    onPress={onOpenTrailModal}
                  >
                    <Sparkles size={14} className="mr-2" /> Escolher Trilha
                  </Button>
                )}
                <Button
                  size="sm"
                  className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                  onPress={onOpenAbilitySelect}
                  isDisabled={!canChooseMore || availableAbilities.length === 0}
                >
                  <Plus size={14} className="mr-2" /> Adicionar Habilidade
                </Button>
              </div>
            </div>

            {/* Skills List */}
            <div className="space-y-6 overflow-y-auto custom-scrollbar">
              {/* HABILIDADES OBRIGATÓRIAS DA CLASSE */}
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
                      className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                    >
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider flex-1 text-left">
                        Obrigatórias da Classe
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedSections.classAbilities ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-amber-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSections.classAbilities && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          {mandatoryAbilities.map((ability, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-amber-500/30 hover:border-amber-500/50 transition-all"
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
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    className="ml-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40"
                                    onPress={() => onOpenAbilityConfig(ability)}
                                  >
                                    <Edit3 size={14} />
                                  </Button>
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

              {/* HABILIDADES ESCOLHIDAS */}
              {(() => {
                const chosenAbilities =
                  classAbilities?.filter((ability) => {
                    const effects =
                      typeof ability.classAbility?.effects === 'string'
                        ? JSON.parse(ability.classAbility?.effects || '{}')
                        : ability.classAbility?.effects || {}
                    return effects.mandatory !== true
                  }) || []

                return (
                  <div>
                    <button
                      onClick={() => onToggleSection('chosenAbilities')}
                      className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                    >
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider flex-1 text-left">
                        Habilidades Escolhidas
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedSections.chosenAbilities ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-blue-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSections.chosenAbilities && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          {chosenAbilities.length > 0 ? (
                            chosenAbilities.map((ability, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all"
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

                                    {/* ── Badge mecânica: Perito ── */}
                                    {ability.classAbility?.name === 'Perito' && peritoSkills.length > 0 && (
                                      <div className="mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-amber-400/60 tracking-wider">Ao usar:</span>
                                        <span className="text-[11px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-0.5">
                                          +{peritoBonus.dice} por {peritoBonus.cost} PE
                                        </span>
                                        <span className="text-[9px] text-zinc-500">nas perícias:</span>
                                        {peritoSkills.map((s, i) => (
                                          <span key={i} className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                                            {s}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* ── Badge mecânica: Eclético ── */}
                                    {ability.classAbility?.name === 'Eclético' && (
                                      <div className="mt-2 p-2 rounded bg-blue-500/5 border border-blue-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-blue-400/60 tracking-wider">Ao usar:</span>
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

                                    {/* ── Badge mecânica: Tiro Certeiro ── */}
                                    {ability.classAbility?.name === 'Tiro Certeiro' && (
                                      <div className="mt-2 p-2 rounded bg-emerald-500/5 border border-emerald-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-emerald-400/60 tracking-wider">Com armas de fogo:</span>
                                        <span className="text-[11px] font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
                                          +{agility} no dano
                                        </span>
                                        <span className="text-[10px] text-zinc-500">Ignora penalidade em combate corpo a corpo</span>
                                      </div>
                                    )}

                                    {/* ── Badge mecânica: Ritual Potente (passivo) ── */}
                                    {ability.classAbility?.name === 'Ritual Potente' && (
                                      <div className="mt-2 p-2 rounded bg-violet-500/5 border border-violet-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-violet-400/60 tracking-wider">Passivo nos rituais:</span>
                                        <span className="text-[11px] font-black text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded px-2 py-0.5">
                                          <Sparkles size={10} className="inline mr-1" />+{intellect} dano/cura
                                        </span>
                                      </div>
                                    )}

                                    {/* ── Badge mecânica: Camuflar Ocultismo ── */}
                                    {ability.classAbility?.name === 'Camuflar Ocultismo' && (
                                      <div className="mt-2 p-2 rounded bg-zinc-500/5 border border-zinc-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-zinc-400/60 tracking-wider">Opcional (por ritual):</span>
                                        <span className="text-[11px] font-black text-zinc-300 bg-zinc-500/10 border border-zinc-500/20 rounded px-2 py-0.5">
                                          +2 PE → Ritual invisível
                                        </span>
                                        <span className="text-[9px] text-zinc-500">(Ativar via checkbox em cada ritual)</span>
                                      </div>
                                    )}

                                    {/* ── Badge mecânica: Ritual Predileto ── */}
                                    {ability.classAbility?.name === 'Ritual Predileto' && (
                                      <div className="mt-2 p-2 rounded bg-blue-500/5 border border-blue-500/20 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black uppercase text-blue-400/60 tracking-wider">Passivo:</span>
                                        <span className="text-[11px] font-black text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded px-2 py-0.5">
                                          –1 PE em {ritualPrediletoConfig || 'ritual não configurado'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    {(
                                      ability.classAbility?.name === 'Perito' ||
                                      ability.classAbility?.name === 'Ritual Predileto' ||
                                      ability.classAbility?.name === 'Mestre em Elemento' ||
                                      ability.classAbility?.name === 'Especialista em Elemento'
                                    ) && (
                                        <Button
                                          isIconOnly
                                          size="sm"
                                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40"
                                          onPress={() => onOpenAbilityConfig(ability)}
                                        >
                                          <Edit3 size={14} />
                                        </Button>
                                      )}
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40"
                                      onPress={() => {
                                        if (
                                          confirm(
                                            'Tem certeza que deseja remover esta habilidade?'
                                          )
                                        ) {
                                          onRemoveAbility(characterId, ability.classAbilityId)
                                        }
                                      }}
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-700/30 text-zinc-500 text-xs italic text-center">
                              Nenhuma habilidade escolhida. Use o botão "Adicionar Habilidade"
                              acima.
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })()}

              {paranormalPowers && paranormalPowers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <button
                    onClick={() => onToggleSection('paranormalPowers')}
                    className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                    <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider flex-1 text-left">
                      Poderes Paranormais
                    </h4>
                    <motion.div
                      animate={{ rotate: expandedSections.paranormalPowers ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-purple-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedSections.paranormalPowers && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {paranormalPowers.map((power, idx) => {
                          const p = power.paranormalPower
                          const elementColor = ({
                            Conhecimento: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                            Energia: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
                            Morte: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
                            Sangue: 'bg-red-500/10 border-red-500/30 text-red-300',
                            Varia: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
                          } as Record<string, string>)[p?.element || ''] || 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300'

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
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  className="text-current opacity-40 hover:opacity-100"
                                  onPress={() => p?.id && onRemoveParanormalPower(p.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
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
                                    <p className="text-xs leading-relaxed opacity-100">
                                      {p.effects.main}
                                    </p>
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

              {characterRituals && characterRituals.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <button
                    onClick={() => onToggleSection('rituals')}
                    className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wider flex-1 text-left">
                      Rituais Aprendidos
                    </h4>
                    <motion.div
                      animate={{ rotate: expandedSections.rituals ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-blue-400" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedSections.rituals && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {characterRituals.map((characterRitual, idx) => {
                          const r = characterRitual.ritual
                          const elementColor = ({
                            Conhecimento: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                            Energia: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
                            Morte: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
                            Sangue: 'bg-red-500/10 border-red-500/30 text-red-300',
                          } as Record<string, string>)[r?.element || ''] || 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300'

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
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      className="bg-black/20 text-current border-current/20"
                                    >
                                      {r?.circle}º Círculo
                                    </Chip>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                      {r?.element}
                                    </span>

                                    {/* ── Badge: Custo em PE ── */}
                                    <div className="flex items-center gap-1">
                                      {temReducao ? (
                                        <span className="flex items-center gap-1">
                                          <span className="text-[10px] text-zinc-400 line-through">{peInfo.base} PE</span>
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

                                    {/* ── Badge: Ritual Potente ── */}
                                    {hasRitualPotente && (
                                      <span className="text-[10px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded px-1.5 py-0.5 flex items-center gap-1">
                                        <Sparkles size={10} />
                                        +{intellect} dano/cura
                                      </span>
                                    )}
                                  </div>

                                  {/* ── Tooltip das reduções ── */}
                                  {peInfo.reducoes.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {peInfo.reducoes.map((red, i) => (
                                        <span key={i} className="text-[9px] font-bold uppercase tracking-wide opacity-60 bg-current/5 border border-current/10 rounded px-1.5 py-0.5">
                                          {red}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* ── Checkbox: Camuflar Ocultismo ── */}
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
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-current opacity-40 hover:opacity-100"
                                    onPress={() => r?.id && onRemoveRitual(r.id)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
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

              {/* HABILIDADES DE TRILHA */}
              {characterTrail &&
                currentTrailAbilities &&
                currentTrailAbilities.length > 0 && (
                  <div>
                    <button
                      onClick={() => onToggleSection('trailAbilities')}
                      className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                    >
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wider flex-1 text-left">
                        Trilha: {characterTrail.name}
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedSections.trailAbilities ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-purple-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSections.trailAbilities && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2"
                        >
                          {currentTrailAbilities.map((progression, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all"
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

              {/* PODERES PARANORMAIS */}
              {(() => {
                const paranormalPowers =
                  classAbilities?.filter(
                    (ability) => ability.classAbility?.name === 'Transcender'
                  ) || []

                return (
                  <div>
                    <button
                      onClick={() => onToggleSection('acquiredAbilities')}
                      className="w-full flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity"
                    >
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider flex-1 text-left">
                        Habilidades de Transcender ({paranormalPowers.length})
                      </h4>
                      <motion.div
                        animate={{ rotate: expandedSections.acquiredAbilities ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-red-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSections.acquiredAbilities && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3"
                        >
                          {paranormalPowers.length > 0 ? (
                            paranormalPowers.map((ability, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-zinc-950/50 hover:bg-zinc-950 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-semibold text-red-300">
                                        {ability.classAbility?.name}
                                      </h5>
                                      {ability.classAbility?.effects?.nex && (
                                        <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-xs font-bold">
                                          NEX {ability.classAbility.effects.nex}
                                        </span>
                                      )}
                                      {(() => {
                                        const count = paranormalPowers.filter(
                                          (p) => p.classAbility?.name === 'Transcender'
                                        ).length
                                        return count > 1 ? (
                                          <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-xs font-bold">
                                            x{count}
                                          </span>
                                        ) : null
                                      })()}
                                    </div>
                                    <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                                      {ability.classAbility?.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 bg-zinc-950/30 rounded-lg border border-zinc-700/30 text-zinc-500 text-xs italic text-center">
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
        </Tab>
      </Tabs>
    </Card>

  )
}
