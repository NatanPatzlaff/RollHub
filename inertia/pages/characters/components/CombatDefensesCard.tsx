import { useState, useMemo } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import { Shield } from 'lucide-react'

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

export interface CombatDefensesCardProps {
  /** Valor atual do atributo Agilidade */
  agility: number
  /** Lista de perícias do personagem para calcular bônus de Reflexos automaticamente */
  characterSkills?: CharacterSkillEntry[]
  /** Proteções do inventário do personagem */
  inventoryProtections?: InventoryProtection[]
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
  // Defesa  = 10 + AGI + bônus proteções equipadas + adicional
  // Esquiva = 10 + AGI + Reflexos - penalidade proteções + adicional
  const defense = useMemo(
    () => 10 + agility + equippedDefenseBonus + defenseAdditional,
    [agility, equippedDefenseBonus, defenseAdditional]
  )

  const dodge = useMemo(
    () => 10 + agility + reflexosBonus - equippedDodgePenalty + dodgeAdditional,
    [agility, reflexosBonus, equippedDodgePenalty, dodgeAdditional]
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
      </CardBody>
    </Card>
  )
}
