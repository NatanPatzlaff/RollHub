import { useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, AlertTriangle, XCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { Button } from '@heroui/react'

interface RollEntry {
  id: string | number
  player: string
  action: string
  roll: string
  result: number
  time: string
  isCritical?: boolean
  isFail?: boolean
  isGM?: boolean
  diceValues?: number[]
}

interface RollHistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  rolls: RollEntry[]
  onClear: () => void
  onDeleteRoll?: (rollId: string | number) => void
}

/**
 * Agrupa rolagens consecutivas de ataque+dano do mesmo jogador/arma
 * em um único item combinado para exibição lado a lado.
 */
function groupRolls(rolls: RollEntry[]) {
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
        atkId: atkRoll.id,
        dmgId: dmgRoll.id,
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

    grouped.push({ type: 'single', ...current })
  }

  return grouped
}

export default function RollHistorySidebar({ isOpen, onClose, rolls, onClear, onDeleteRoll }: RollHistorySidebarProps) {
  const groupedRolls = useMemo(() => groupRolls(rolls), [rolls])

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="h-full w-80 md:w-96 bg-[#09090B] border-l border-zinc-800 shadow-2xl flex flex-col shrink-0"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-purple-500" />
              <h2 className="font-bold text-white tracking-tight">Histórico de Rolagens</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-zinc-500 hover:text-red-400"
                onPress={onClear}
                title="Limpar Histórico"
              >
                <Trash2 size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-zinc-500 hover:text-white"
                onPress={onClose}
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-[#09090B]">
            {groupedRolls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                <MessageSquare size={48} className="mb-2" />
                <p className="text-sm">Nenhuma rolagem ainda</p>
              </div>
            ) : (
              groupedRolls.map((item: any, idx: number) => {
                if (item.type === 'weapon') {
                  return <WeaponRollCard key={item.id} item={item} onDeleteRoll={onDeleteRoll} />
                }
                return <SingleRollCard key={item.id || idx} roll={item} onDeleteRoll={onDeleteRoll} />
              })
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

/** Card combinado de ataque + dano (estilo DiceTray) */
function WeaponRollCard({ item, onDeleteRoll }: { item: any; onDeleteRoll?: (id: string | number) => void }) {
  const borderColor = item.isGM
    ? 'border-purple-500/50 bg-purple-500/5'
    : item.attack.isCritical
      ? 'border-amber-500/50 bg-amber-500/5'
      : 'border-zinc-800'

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-900/50 border ${borderColor} rounded-xl p-3 text-sm relative group overflow-hidden shrink-0`}
    >
      {/* Header: jogador + horário */}
      <div className="flex justify-between items-center mb-2">
        <span className={`font-bold text-sm tracking-wider ${item.isGM ? 'text-purple-400' : 'text-zinc-300'}`}>
          {item.player}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-medium">{item.time}</span>
          {onDeleteRoll && (
            <button
              onClick={() => {
                onDeleteRoll(item.atkId)
                onDeleteRoll(item.dmgId)
              }}
              className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
              title="Excluir rolagem"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
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
            : 'bg-zinc-950/80 border border-zinc-800/50'
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
            <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">
              ({item.attack.diceValues.join(', ')})
            </div>
          )}
        </div>

        {/* Dano */}
        <div className={`flex-1 rounded-lg px-2.5 py-2 ${
          item.damage.isCritical
            ? 'bg-red-950/50 border border-red-500/40'
            : 'bg-zinc-950/80 border border-red-900/30'
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
            <div className="text-[10px] text-zinc-600 mt-0.5 font-mono">
              [{item.damage.diceValues.join(', ')}]
            </div>
          )}
        </div>
      </div>
    </m.div>
  )
}

/** Card de rolagem simples (perícia, teste avulso, etc.) */
function SingleRollCard({ roll, onDeleteRoll }: { roll: any; onDeleteRoll?: (id: string | number) => void }) {
  let borderColor = 'border-zinc-800'
  let icon = null
  let textColor = 'text-white'

  if (roll.isCritical) {
    borderColor = 'border-amber-500/50 bg-amber-500/5'
    icon = <AlertTriangle size={14} className="text-amber-500" />
    textColor = 'text-amber-500 font-black'
  } else if (roll.isFail) {
    borderColor = 'border-red-500/50 bg-red-500/5'
    icon = <XCircle size={14} className="text-red-500" />
    textColor = 'text-red-500 font-bold'
  } else {
    icon = <CheckCircle2 size={14} className="text-emerald-500" />
  }

  if (roll.isGM) {
    borderColor = 'border-purple-500/50 bg-purple-500/5'
  }

  return (
    <m.div 
      key={roll.id} 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-900/50 border ${borderColor} rounded-xl p-3 text-sm relative group overflow-hidden shrink-0`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className={`font-bold text-sm tracking-wider ${roll.isGM ? 'text-purple-400' : 'text-zinc-300'}`}>
          {roll.player}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 font-medium">{roll.time}</span>
          {onDeleteRoll && (
            <button
              onClick={() => onDeleteRoll(roll.id)}
              className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
              title="Excluir rolagem"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      
      <div className="text-zinc-400 mb-2 font-medium text-xs uppercase tracking-tighter">{roll.action}</div>
      
      <div className="flex justify-between items-center bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/50 shadow-inner">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 font-mono tracking-tighter">{roll.roll}</span>
          {roll.diceValues && roll.diceValues.length > 1 && (
            <span className="text-[10px] text-zinc-600 font-mono italic">
              ({roll.diceValues.join(', ')})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-2xl tracking-tighter ${textColor}`}>{roll.result}</span>
        </div>
      </div>
    </m.div>
  )
}
