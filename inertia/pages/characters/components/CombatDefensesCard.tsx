import { useState, useMemo } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import { Shield, Flame, X, Trash2, Heart } from 'lucide-react'

/** Formato mínimo de perícia necessário para calcular o bônus de Reflexos */
interface CharacterSkillEntry {
  trainingDegree: number
  skill?: { name: string }
}

/** Proteção do inventário do personagem */
interface InventoryProtection {
  id: number
  name: string
  equipped: boolean
  defenseBonus: number
  dodgePenalty: number
}

/** Buff ativo de ritual */
interface ActiveRitualBuff {
  id: string
  label: string
  defenseBonus: number
  dodgeBonus: number
  tempHp: number
  strBonus: number
  agiBonus: number
  intBonus: number
  preBonus: number
  copies?: number
  remainingCopies?: number
  defensePerCopy?: number
}

/** Interface da habilidade ativa (copiada de show.tsx) */
export interface ActiveAbilityBuff {
  id: string
  abilityName: string
  source: 'trail' | 'origin' | 'class'
  effects: any
}

export interface CombatDefensesCardProps {
  /** Valor atual do atributo Agilidade (já inclui bônus de rituais) */
  agility: number
  /** Lista de perícias do personagem para calcular bônus de Reflexos automaticamente */
  characterSkills?: CharacterSkillEntry[]
  /** Proteções do inventário do personagem */
  inventoryProtections?: InventoryProtection[]
  /** Bônus de Defesa de rituais ativos */
  ritualDefenseBonus?: number
  /** Bônus de Esquiva de rituais ativos */
  ritualDodgeBonus?: number
  /** Buffs ativos de rituais para exibição */
  activeRitualBuffs?: ActiveRitualBuff[]
  /** Callback para remover um buff */
  onRemoveRitualBuff?: (buffId: string) => void
  /** Callback para atualizar um buff (ex: diminuir cópias) */
  onUpdateRitualBuff?: (buffId: string, updates: Partial<ActiveRitualBuff>) => void
  /** Callback para limpar todos os buffs (fim de cena) */
  onClearAllBuffs?: () => void
  /** PV temporários de rituais */
  tempHp?: number
  /** Callback para alterar PV temporários */
  onSetTempHp?: (v: number) => void
  /** PE temporários */
  tempPe?: number
  /** Callback para alterar PE temporários */
  onSetTempPe?: (v: number) => void
  /** Bônus de habilidades passivas */
  abilityEffects?: any
  /** Buffs ativos de habilidades */
  activeAbilityBuffs?: ActiveAbilityBuff[]
  /** Callback para remover um buff de habilidade */
  onRemoveAbilityBuff?: (buffId: string) => void
}

/**
 * Card de Defesas de Combate.
 * Exibe Defesa e Esquiva calculadas dinamicamente a partir da Agilidade,
 * bônus de proteções equipadas e bônus de Reflexos (skill).
 */
export default function CombatDefensesCard({
  agility,
  characterSkills,
  inventoryProtections = [],
  ritualDefenseBonus = 0,
  ritualDodgeBonus = 0,
  activeRitualBuffs = [],
  onRemoveRitualBuff,
  onUpdateRitualBuff,
  onClearAllBuffs,
  tempHp = 0,
  onSetTempHp,
  tempPe = 0,
  onSetTempPe,
  abilityEffects,
  activeAbilityBuffs = [],
  onRemoveAbilityBuff,
}: CombatDefensesCardProps) {
  // ─── Estado interno (bônus manuais adicionais) ────────────────────────────
  const [defenseAdditional, setDefenseAdditional] = useState(0)
  const [dodgeAdditional, setDodgeAdditional] = useState(0)

  // ─── Proteções equipadas ──────────────────────────────────────────────────
  const equippedProtections = useMemo(
    () => inventoryProtections.filter((p) => p.equipped),
    [inventoryProtections]
  )

  const equippedDefenseBonus = useMemo(
    () => equippedProtections.reduce((sum, p) => sum + (p.defenseBonus || 0), 0),
    [equippedProtections]
  )

  const equippedDodgePenalty = useMemo(
    () => equippedProtections.reduce((sum, p) => sum + (p.dodgePenalty || 0), 0),
    [equippedProtections]
  )

  // ─── Cálculo do bônus de Reflexos ─────────────────────────────────────────
  const reflexosBonus = useMemo(() => {
    const entry = characterSkills?.find((cs) => cs.skill?.name === 'Reflexos')
    if (!entry) return 0
    const degree = entry.trainingDegree || 0
    if (degree >= 15) return 15
    if (degree >= 10) return 10
    if (degree >= 5) return 5
    return 0
  }, [characterSkills])

  // ─── Defesa e Esquiva ──────────────────────────────────────────────────────
  // Defesa  = 10 + AGI + bônus proteções equipadas + rituais + habilidades + adicional
  // Esquiva = 10 + AGI + Reflexos - penalidade proteções + rituais + habilidades + adicional
  const defense = useMemo(() => {
    const passiveBonus = abilityEffects?.defenseBonus || 0
    const abilityBuffDefense = (activeAbilityBuffs || []).reduce((total, buff) => {
      const bonus = Number(buff.effects?.defense_bonus) || Number(buff.effects?.defenseBonus) || 0
      if (buff.effects?.duration === 'scene' && bonus !== 0) {
        return total + bonus
      }
      return total
    }, 0)
    const val = 10 + agility + equippedDefenseBonus + ritualDefenseBonus + passiveBonus + abilityBuffDefense + defenseAdditional
    return Math.min(9999, Math.max(-999, val))
  }, [agility, equippedDefenseBonus, ritualDefenseBonus, abilityEffects?.defenseBonus, activeAbilityBuffs, defenseAdditional])

  const dodge = useMemo(() => {
    const passiveBonus = abilityEffects?.defenseBonus || 0
    const abilityBuffDefense = (activeAbilityBuffs || []).reduce((total, buff) => {
      const bonus = Number(buff.effects?.defense_bonus) || Number(buff.effects?.defenseBonus) || 0
      if (buff.effects?.duration === 'scene' && bonus !== 0) {
        return total + bonus
      }
      return total
    }, 0)
    const val = 10 + agility + reflexosBonus - equippedDodgePenalty + ritualDodgeBonus + passiveBonus + abilityBuffDefense + dodgeAdditional
    return Math.min(9999, Math.max(-999, val))
  }, [agility, reflexosBonus, equippedDodgePenalty, ritualDodgeBonus, abilityEffects?.defenseBonus, activeAbilityBuffs, dodgeAdditional])

  // Helper para formatar display (ex: 999+)
  const formatDefenseValue = (val: number) => {
    if (val > 999) return '999+'
    if (val < -99) return '-99' // Embora o limite seja -999, o display compacto foca em 3-4 caracteres
    return val.toString()
  }

  return (
    <Card className="bg-zinc-900 border border-zinc-800 shadow-none rounded-xl">
      <CardHeader className="pb-2 flex justify-between items-center">
        <div className="text-sm font-bold text-zinc-200">Defesas de Combate</div>
        {equippedProtections.length > 0 ? (
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Shield size={12} /> {equippedProtections.map((p) => p.name).join(', ')}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-zinc-600 text-xs font-bold uppercase tracking-wider">
            <Shield size={12} /> Sem proteção
          </div>
        )}
      </CardHeader>

      <CardBody className="pt-0 pb-4 flex flex-col gap-4">
        {/* Valores de Defesa e Esquiva */}
        <div className="flex gap-4">
          {/* Defesa */}
          <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-help transition-colors hover:border-zinc-700">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                Defesa
              </div>
              <div className="text-[10px] text-zinc-600">
                10 + AGI ({agility})
                {equippedDefenseBonus !== 0 &&
                  ` + Arm. (${equippedDefenseBonus > 0 ? '+' : ''}${equippedDefenseBonus})`}
                {ritualDefenseBonus !== 0 && ` + Ritual (+${ritualDefenseBonus})`}
                {defenseAdditional !== 0 &&
                  ` + Adic. (${defenseAdditional > 0 ? '+' : ''}${defenseAdditional})`}
              </div>
            </div>
            <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {formatDefenseValue(defense)}
            </div>
          </div>

          {/* Esquiva */}
          <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-help transition-colors hover:border-zinc-700">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                Esquiva
              </div>
              <div className="text-[10px] text-zinc-600">
                10 + AGI ({agility}){reflexosBonus > 0 && ` + Ref. (+${reflexosBonus})`}
                {equippedDodgePenalty > 0 && ` − Pen. (${equippedDodgePenalty})`}
                {ritualDodgeBonus !== 0 && ` + Ritual (+${ritualDodgeBonus})`}
                {dodgeAdditional !== 0 &&
                  ` + Adic. (${dodgeAdditional > 0 ? '+' : ''}${dodgeAdditional})`}
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-500 group-hover:text-amber-400 transition-colors">
              {formatDefenseValue(dodge)}
            </div>
          </div>
        </div>

        {/* Proteções equipadas */}
        {equippedProtections.length > 0 && (
          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1.5">
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-2">
              Proteções equipadas
            </div>
            {equippedProtections.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">{p.name}</span>
                <span className="flex gap-3 text-zinc-500">
                  {p.defenseBonus !== 0 && (
                    <span className="text-blue-400">
                      DEF {p.defenseBonus > 0 ? '+' : ''}
                      {p.defenseBonus}
                    </span>
                  )}
                  {p.dodgePenalty !== 0 && (
                    <span className="text-red-400">ESQ −{p.dodgePenalty}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Bônus adicionais manuais */}
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-400 min-w-fit">Defesa +</label>
            <input
              type="number"
              value={defenseAdditional}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                setDefenseAdditional(Math.min(999, Math.max(-99, val)))
              }}
              min={-99}
              max={999}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-400 min-w-fit">Esquiva +</label>
            <input
              type="number"
              value={dodgeAdditional}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                setDodgeAdditional(Math.min(999, Math.max(-99, val)))
              }}
              min={-99}
              max={999}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
            />
          </div>
        </div>

        {/* ─── PV e PE Temporários ─────────────────────────────────────── */}
        <div className="mt-4 flex items-center gap-4">
          {/* PV Temp */}
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400">PV Temp:</span>
            <button
              onClick={() => onSetTempHp?.(Math.max(0, tempHp - 1))}
              className="w-5 h-5 flex items-center justify-center rounded bg-zinc-700 text-white text-xs hover:bg-zinc-600 disabled:opacity-30"
              disabled={tempHp === 0}
            >
              −
            </button>
            <span
              className={`text-sm font-bold min-w-[24px] text-center ${tempHp > 0 ? 'text-cyan-300' : 'text-zinc-600'}`}
            >
              {tempHp}
            </span>
            <button
              onClick={() => onSetTempHp?.(tempHp + 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-zinc-700 text-white text-xs hover:bg-zinc-600"
            >
              +
            </button>
          </div>

          <div className="w-px h-4 bg-zinc-700" />

          {/* PE Temp */}
          <div className="flex items-center gap-2">
            <span className="text-xs">⚡</span>
            <span className="text-xs font-bold text-cyan-400">PE Temp:</span>
            <button
              onClick={() => onSetTempPe?.(Math.max(0, tempPe - 1))}
              className="w-5 h-5 flex items-center justify-center rounded bg-zinc-700 text-white text-xs hover:bg-zinc-600 disabled:opacity-30"
              disabled={tempPe === 0}
            >
              −
            </button>
            <span
              className={`text-sm font-bold min-w-[24px] text-center ${tempPe > 0 ? 'text-cyan-300' : 'text-zinc-600'}`}
            >
              {tempPe}
            </span>
            <button
              onClick={() => onSetTempPe?.(tempPe + 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-zinc-700 text-white text-xs hover:bg-zinc-600"
            >
              +
            </button>
          </div>
        </div>

        {/* ─── Buffs Ativos de Rituais ────────────────────────────────── */}
        {activeRitualBuffs.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">
                  Buffs Ativos
                </span>
              </div>
              <button
                onClick={onClearAllBuffs}
                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors"
                title="Remover todos os buffs (Fim de Cena)"
              >
                <Trash2 className="w-3 h-3" />
                Fim de Cena
              </button>
            </div>

            <div className="space-y-1.5">
              {activeRitualBuffs.map((buff) => {
                const hasCopies = buff.copies !== undefined && buff.remainingCopies !== undefined

                const handleConsumeCopy = () => {
                  if (!hasCopies || buff.remainingCopies! <= 0) return
                  const nextRemaining = buff.remainingCopies! - 1
                  if (nextRemaining <= 0) {
                    onRemoveRitualBuff?.(buff.id)
                  } else {
                    onUpdateRitualBuff?.(buff.id, {
                      remainingCopies: nextRemaining,
                      defenseBonus: Math.max(0, buff.defenseBonus - (buff.defensePerCopy || 0)),
                    })
                  }
                }

                return (
                  <div
                    key={buff.id}
                    className="flex items-center justify-between bg-zinc-800/80 border border-zinc-700 rounded-lg px-2.5 py-1.5"
                  >
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {buff.label}
                        </span>
                        {hasCopies && (
                          <div className="flex gap-0.5">
                            {Array.from({ length: buff.copies! }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  i < buff.remainingCopies! ? 'bg-cyan-400' : 'bg-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {buff.defenseBonus && !isNaN(buff.defenseBonus) && buff.defenseBonus !== 0 && (
                          <span className="text-[10px] bg-blue-900/60 text-blue-300 rounded px-1.5 py-0.5">
                            Defesa {buff.defenseBonus > 0 ? '+' : ''}
                            {buff.defenseBonus}
                          </span>
                        )}
                        {buff.dodgeBonus && !isNaN(buff.dodgeBonus) && buff.dodgeBonus !== 0 && (
                          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 rounded px-1.5 py-0.5">
                            Esquiva {buff.dodgeBonus > 0 ? '+' : ''}
                            {buff.dodgeBonus}
                          </span>
                        )}
                        {buff.strBonus && !isNaN(buff.strBonus) && buff.strBonus !== 0 && (
                          <span className="text-[10px] bg-red-900/60 text-red-300 rounded px-1.5 py-0.5">
                            FOR {buff.strBonus > 0 ? '+' : ''}
                            {buff.strBonus}
                          </span>
                        )}
                        {buff.agiBonus && !isNaN(buff.agiBonus) && buff.agiBonus !== 0 && (
                          <span className="text-[10px] bg-green-900/60 text-green-300 rounded px-1.5 py-0.5">
                            AGI {buff.agiBonus > 0 ? '+' : ''}
                            {buff.agiBonus}
                          </span>
                        )}
                        {buff.intBonus && !isNaN(buff.intBonus) && buff.intBonus !== 0 && (
                          <span className="text-[10px] bg-purple-900/60 text-purple-300 rounded px-1.5 py-0.5">
                            INT {buff.intBonus > 0 ? '+' : ''}
                            {buff.intBonus}
                          </span>
                        )}
                        {buff.preBonus && !isNaN(buff.preBonus) && buff.preBonus !== 0 && (
                          <span className="text-[10px] bg-yellow-900/60 text-yellow-300 rounded px-1.5 py-0.5">
                            PRE {buff.preBonus > 0 ? '+' : ''}
                            {buff.preBonus}
                          </span>
                        )}
                        {buff.tempHp && !isNaN(buff.tempHp) && buff.tempHp > 0 && (
                          <span className="text-[10px] bg-cyan-900/60 text-cyan-300 rounded px-1.5 py-0.5">
                            PV Temp +{buff.tempHp}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {hasCopies && (
                        <button
                          onClick={handleConsumeCopy}
                          className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-bold transition-all"
                          title="Perder uma cópia"
                        >
                          −1 Cópia
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveRitualBuff?.(buff.id)}
                        className="p-0.5 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Remover buff"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── Buffs Ativos de Habilidades ────────────────────────────────── */}
        {(activeAbilityBuffs || []).filter(b => b.effects?.duration === 'scene').length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] text-[#71717A] uppercase font-bold mb-1">Habilidades Ativas</p>
            {activeAbilityBuffs!.filter(b => b.effects?.duration === 'scene').map(buff => (
              <div key={buff.id} className="flex items-center justify-between py-1 border-b border-[#27272A]">
                <div>
                  <p className="text-[11px] text-white font-medium">{buff.abilityName}</p>
                  <p className="text-[10px] text-[#A1A1AA]">{buff.effects?.effect_label || 'Buff ativo'}</p>
                </div>
                <button
                  onClick={() => onRemoveAbilityBuff?.(buff.id)}
                  className="text-[10px] text-[#71717A] hover:text-red-400 transition-colors px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
