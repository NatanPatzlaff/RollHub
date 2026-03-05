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
  onClearAllBuffs,
  tempHp = 0,
  onSetTempHp,
  tempPe = 0,
  onSetTempPe,
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
  // Defesa  = 10 + AGI + bônus proteções equipadas + rituais + adicional
  // Esquiva = 10 + AGI + Reflexos - penalidade proteções + rituais + adicional
  const defense = useMemo(
    () => 10 + agility + equippedDefenseBonus + ritualDefenseBonus + defenseAdditional,
    [agility, equippedDefenseBonus, ritualDefenseBonus, defenseAdditional]
  )

  const dodge = useMemo(
    () => 10 + agility + reflexosBonus - equippedDodgePenalty + ritualDodgeBonus + dodgeAdditional,
    [agility, reflexosBonus, equippedDodgePenalty, ritualDodgeBonus, dodgeAdditional]
  )

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
              {defense}
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
              {dodge}
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
              onChange={(e) => setDefenseAdditional(parseInt(e.target.value) || 0)}
              min={-20}
              max={20}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-400 min-w-fit">Esquiva +</label>
            <input
              type="number"
              value={dodgeAdditional}
              onChange={(e) => setDodgeAdditional(parseInt(e.target.value) || 0)}
              min={-20}
              max={20}
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
              {activeRitualBuffs.map((buff) => (
                <div
                  key={buff.id}
                  className="flex items-center justify-between bg-zinc-800/80 border border-zinc-700 rounded-lg px-2.5 py-1.5"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-white">{buff.label}</span>
                    <div className="flex flex-wrap gap-1">
                      {buff.defenseBonus !== 0 && (
                        <span className="text-[10px] bg-blue-900/60 text-blue-300 rounded px-1.5 py-0.5">
                          Defesa {buff.defenseBonus > 0 ? '+' : ''}
                          {buff.defenseBonus}
                        </span>
                      )}
                      {buff.dodgeBonus !== 0 && (
                        <span className="text-[10px] bg-emerald-900/60 text-emerald-300 rounded px-1.5 py-0.5">
                          Esquiva {buff.dodgeBonus > 0 ? '+' : ''}
                          {buff.dodgeBonus}
                        </span>
                      )}
                      {buff.strBonus !== 0 && (
                        <span className="text-[10px] bg-red-900/60 text-red-300 rounded px-1.5 py-0.5">
                          FOR {buff.strBonus > 0 ? '+' : ''}
                          {buff.strBonus}
                        </span>
                      )}
                      {buff.agiBonus !== 0 && (
                        <span className="text-[10px] bg-green-900/60 text-green-300 rounded px-1.5 py-0.5">
                          AGI {buff.agiBonus > 0 ? '+' : ''}
                          {buff.agiBonus}
                        </span>
                      )}
                      {buff.intBonus !== 0 && (
                        <span className="text-[10px] bg-purple-900/60 text-purple-300 rounded px-1.5 py-0.5">
                          INT {buff.intBonus > 0 ? '+' : ''}
                          {buff.intBonus}
                        </span>
                      )}
                      {buff.preBonus !== 0 && (
                        <span className="text-[10px] bg-yellow-900/60 text-yellow-300 rounded px-1.5 py-0.5">
                          PRE {buff.preBonus > 0 ? '+' : ''}
                          {buff.preBonus}
                        </span>
                      )}
                      {buff.tempHp > 0 && (
                        <span className="text-[10px] bg-cyan-900/60 text-cyan-300 rounded px-1.5 py-0.5">
                          PV Temp +{buff.tempHp}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveRitualBuff?.(buff.id)}
                    className="ml-2 p-0.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Remover buff"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
