import { useState, useMemo } from 'react'
import { Card, CardHeader, CardBody } from '@heroui/react'
import { Shield } from 'lucide-react'

/** Formato mínimo de perícia necessário para calcular o bônus de Reflexos */
interface CharacterSkillEntry {
  trainingDegree: number
  skill?: { name: string }
}

export interface CombatDefensesCardProps {
  /** Valor atual do atributo Agilidade */
  agility: number
  /** Lista de perícias do personagem para calcular bônus de Reflexos automaticamente */
  characterSkills?: CharacterSkillEntry[]
}

/**
 * Card de Defesas de Combate.
 * Exibe Defesa e Esquiva calculadas dinamicamente a partir da Agilidade,
 * bônus de equipamentos e bônus de Reflexos (skill).
 * Estado de bônus de equipamento e bônus adicional é gerenciado internamente.
 */
export default function CombatDefensesCard({ agility, characterSkills }: CombatDefensesCardProps) {
  // ─── Estado interno ───────────────────────────────────────────────────────
  const [defenseEquipBonus, setDefenseEquipBonus] = useState(0)
  const [dodgeReflexBonus, setDodgeReflexBonus] = useState(0)

  // ─── Cálculo do bônus de Reflexos ─────────────────────────────────────────
  // Treinado (+5), Veterano (+10), Expert (+15)
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
  // Defesa  = 10 + AGI + Equip
  // Esquiva = 10 + Equip + AGI + Reflexos + BônusAdicional
  const { defense, dodge } = useMemo(
    () => ({
      defense: 10 + agility + defenseEquipBonus,
      dodge: 10 + defenseEquipBonus + agility + reflexosBonus + dodgeReflexBonus,
    }),
    [agility, defenseEquipBonus, reflexosBonus, dodgeReflexBonus]
  )

  return (
    <Card className="bg-zinc-900 border border-zinc-800 shadow-none rounded-xl">
      <CardHeader className="pb-2 flex justify-between items-center">
        <div className="text-sm font-bold text-zinc-200">Defesas de Combate</div>
        <div className="flex items-center gap-1 text-orange-500 text-xs font-bold uppercase tracking-wider">
          <Shield size={12} /> Armadura Leve
        </div>
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
                10 + AGI ({agility}) + Equip ({defenseEquipBonus})
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
                10 + Equip ({defenseEquipBonus}) + AGI ({agility}) + Reflexos ({reflexosBonus})
                {dodgeReflexBonus > 0 ? ` + Bônus (+${dodgeReflexBonus})` : ''}
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-500 group-hover:text-amber-400 transition-colors">
              {dodge}
            </div>
          </div>
        </div>

        {/* Controles de bônus */}
        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-400 min-w-fit">
              Bônus Equipamentos
            </label>
            <input
              type="number"
              value={defenseEquipBonus}
              onChange={(e) => setDefenseEquipBonus(parseInt(e.target.value) || 0)}
              min={-5}
              max={10}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-zinc-400 min-w-fit">Bônus Adicional</label>
            <input
              type="number"
              value={dodgeReflexBonus}
              onChange={(e) => setDodgeReflexBonus(parseInt(e.target.value) || 0)}
              min={-5}
              max={10}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
