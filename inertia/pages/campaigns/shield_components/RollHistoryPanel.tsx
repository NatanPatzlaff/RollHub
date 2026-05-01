import { useMemo } from 'react'
import { MessageSquare, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'

interface RollHistoryPanelProps {
  rolls: any[]
  onClear: () => void
  onClearAll: () => void
}

/**
 * Agrupa rolagens consecutivas de ataque+dano do mesmo jogador/arma
 * em um único item combinado para exibição lado a lado.
 */
function groupRolls(rolls: any[]) {
  const grouped: any[] = []
  const used = new Set<number>()

  for (let i = 0; i < rolls.length; i++) {
    if (used.has(i)) continue
    const current = rolls[i]
    const next = i + 1 < rolls.length && !used.has(i + 1) ? rolls[i + 1] : null

    // Normalizar campos (DB retorna snake_case, local usa camelCase)
    const cAction = current.action || ''
    const cPlayer = current.player || current.player_name || ''
    const nAction = next?.action || ''
    const nPlayer = next?.player || next?.player_name || ''

    // Detectar par ataque+dano (em qualquer ordem)
    const atkPatternC = cAction.match(/^(.+?)\s*\((Ataque(?:\s+Extra)?|Teste)\)$/i)
    const dmgPatternC = cAction.match(/^(.+?)\s*\(Dano\)$/i)

    let atkRoll: any = null
    let dmgRoll: any = null
    let weaponName = ''

    if (atkPatternC && next) {
      // Caso 1: current = Ataque, next = Dano
      weaponName = atkPatternC[1].trim()
      const dmgPatternN = nAction.match(/^(.+?)\s*\(Dano\)$/i)
      if (dmgPatternN && dmgPatternN[1].trim() === weaponName && nPlayer === cPlayer) {
        atkRoll = current
        dmgRoll = next
      }
    }

    if (!atkRoll && dmgPatternC && next) {
      // Caso 2: current = Dano, next = Ataque (ordem DESC do banco)
      weaponName = dmgPatternC[1].trim()
      const atkPatternN = nAction.match(/^(.+?)\s*\((Ataque(?:\s+Extra)?|Teste)\)$/i)
      if (atkPatternN && atkPatternN[1].trim() === weaponName && nPlayer === cPlayer) {
        atkRoll = next
        dmgRoll = current
      }
    }

    if (atkRoll && dmgRoll) {
      const atkDice = (() => { try { return typeof atkRoll.diceValues === 'string' ? JSON.parse(atkRoll.diceValues) : atkRoll.diceValues } catch { return null } })()
      const dmgDice = (() => { try { return typeof dmgRoll.diceValues === 'string' ? JSON.parse(dmgRoll.diceValues) : dmgRoll.diceValues } catch { return null } })()

      grouped.push({
        type: 'weapon',
        id: atkRoll.id + '-' + dmgRoll.id,
        player: cPlayer,
        weaponName,
        time: current.time || current.rolled_at,
        isGM: current.isGM ?? current.is_gm,
        attack: {
          result: atkRoll.result,
          roll: atkRoll.roll || atkRoll.roll_expression,
          diceValues: atkDice,
          isCritical: atkRoll.isCritical ?? atkRoll.is_critical,
          isFail: atkRoll.isFail ?? atkRoll.is_fail,
        },
        damage: {
          result: dmgRoll.result,
          roll: dmgRoll.roll || dmgRoll.roll_expression,
          diceValues: dmgDice,
          isCritical: dmgRoll.isCritical ?? dmgRoll.is_critical,
        },
      })
      used.add(i)
      used.add(i + 1)
      continue
    }

    // Rolagem simples (não agrupada)
    grouped.push({ type: 'single', ...current })
  }

  return grouped
}

export default function RollHistoryPanel({ rolls, onClear, onClearAll }: RollHistoryPanelProps) {
  const groupedRolls = useMemo(() => groupRolls(rolls), [rolls])

  return (
    <div className="bg-[#18181B] border-l border-[#27272A] flex flex-col h-full w-72 xl:w-80 flex-shrink-0">
      <div className="p-4 border-b border-[#27272A] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7C3AED]" />
          <h2 className="font-bold text-white">Registo do Sistema</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClear}
            className="text-[#A1A1AA] hover:text-white text-xs font-semibold"
            title="Ocultar rolagens antigas (apenas para você)"
          >
            Limpar
          </button>
          <button 
            onClick={onClearAll}
            className="text-[#A1A1AA] hover:text-red-400 text-xs font-semibold"
            title="Deletar todas as rolagens da campanha permanentemente"
          >
            Limpar Tudo
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {groupedRolls.length === 0 && (
          <div className="text-center py-20 px-6 opacity-20">
            <MessageSquare size={48} className="mx-auto mb-4" />
            <p className="text-sm text-white">Nenhuma rolagem recente.</p>
          </div>
        )}

        {groupedRolls.map((item) => {
          if (item.type === 'weapon') {
            return <WeaponRollCard key={item.id} item={item} />
          }
          return <SingleRollCard key={item.id} roll={item} />
        })}
      </div>
    </div>
  )
}

/** Card combinado de ataque + dano (estilo DiceTray) */
function WeaponRollCard({ item }: { item: any }) {
  const borderColor = item.isGM
    ? 'border-[#7C3AED] bg-[#7C3AED]/5'
    : item.attack.isCritical
      ? 'border-[#F97316] bg-[#F97316]/5'
      : 'border-[#27272A]'

  return (
    <div className={`bg-[#101012] border ${borderColor} rounded-lg p-3 text-sm relative shrink-0`}>
      {/* Header: jogador + horário */}
      <div className="flex justify-between items-center mb-2">
        <span className={`font-bold ${item.isGM ? 'text-[#7C3AED]' : 'text-[#A1A1AA]'}`}>
          {item.player}
        </span>
        <span className="text-[10px] text-[#52525B]">{item.time}</span>
      </div>

      {/* Nome da arma + badge de crítico */}
      <div className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider truncate mb-2">
        {item.weaponName}
        {item.attack.isCritical && (
          <span className="ml-2 text-yellow-400 animate-pulse">💥 CRÍTICO!</span>
        )}
      </div>

      {/* Ataque + Dano lado a lado */}
      <div className="flex items-stretch gap-2">
        {/* Ataque */}
        <div className={`flex-1 rounded-lg px-2.5 py-2 ${
          item.attack.isCritical
            ? 'bg-yellow-950/40 border border-yellow-500/40'
            : 'bg-[#09090B] border border-[#27272A]'
        }`}>
          <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
            Ataque · {item.attack.roll}
          </div>
          <div className={`text-2xl font-black leading-none ${
            item.attack.isCritical ? 'text-yellow-400' : 'text-amber-400'
          }`}>
            {item.attack.result}
          </div>
          {item.attack.diceValues && item.attack.diceValues.length > 0 && (
            <div className="text-[10px] text-zinc-600 mt-0.5">
              ({item.attack.diceValues.join(', ')})
            </div>
          )}
        </div>

        {/* Dano */}
        <div className={`flex-1 rounded-lg px-2.5 py-2 ${
          item.damage.isCritical
            ? 'bg-red-950/50 border border-red-500/40'
            : 'bg-[#09090B] border border-red-900/30'
        }`}>
          <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">
            Dano · {item.damage.roll}
          </div>
          <div className={`text-2xl font-black leading-none ${
            item.damage.isCritical ? 'text-red-300' : 'text-red-400'
          }`}>
            {item.damage.result}
          </div>
          {item.damage.diceValues && item.damage.diceValues.length > 0 && (
            <div className="text-[10px] text-zinc-600 mt-0.5">
              [{item.damage.diceValues.join(', ')}]
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Card de rolagem simples (perícia, teste avulso, etc.) */
function SingleRollCard({ roll }: { roll: any }) {
  let borderColor = 'border-[#27272A]'
  let icon = null
  let textColor = 'text-white'

  if (roll.isCritical) {
    borderColor = 'border-[#F97316] bg-[#F97316]/5'
    icon = <AlertTriangle size={14} className="text-[#F97316]" />
    textColor = 'text-[#F97316] font-black'
  } else if (roll.isFail) {
    borderColor = 'border-[#EF4444] bg-[#EF4444]/5'
    icon = <XCircle size={14} className="text-[#EF4444]" />
    textColor = 'text-[#EF4444] font-bold'
  } else {
    icon = <CheckCircle2 size={14} className="text-[#10B981]" />
  }

  if (roll.isGM) {
    borderColor = 'border-[#7C3AED] bg-[#7C3AED]/5'
  }

  return (
    <div className={`bg-[#101012] border ${borderColor} rounded-lg p-3 text-sm relative shrink-0`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`font-bold ${roll.isGM ? 'text-[#7C3AED]' : 'text-[#A1A1AA]'}`}>
          {roll.player}
        </span>
        <span className="text-[10px] text-[#52525B]">{roll.time}</span>
      </div>
      <div className="text-[#D4D4D8] mb-2">{roll.action}</div>
      
      <div className="flex justify-between items-center bg-[#09090B] p-2 rounded border border-[#27272A]">
        <div className="flex flex-col">
          <span className="text-xs text-[#8B8B94] font-mono">{roll.roll}</span>
          {roll.diceValues && roll.diceValues.length > 0 && (
            <span className="text-[10px] text-[#52525B] font-mono mt-0.5">
              ({roll.diceValues.join(', ')})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          {icon}
          <span className={`text-xl ${textColor}`}>{roll.result}</span>
        </div>
      </div>
    </div>
  )
}
