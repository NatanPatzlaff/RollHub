import { Heart, Zap, Brain } from 'lucide-react'

interface GroupResourcesBarsProps {
  players: any[]
}

export default function GroupResourcesBars({ players }: GroupResourcesBarsProps) {
  const getPercent = (p: any, type: 'Hp' | 'Pe' | 'Sanity') => {
    const s = p.stats
    if (!s) return 0
    const current = type === 'Hp' ? s.currentHp : type === 'Pe' ? s.currentPe : s.currentSanity
    const max = type === 'Hp' ? s.maxHp : type === 'Pe' ? s.maxPe : s.maxSanity
    return max > 0 ? (current / max) * 100 : 0
  }

  const avgHp = players.length ? players.reduce((acc, p) => acc + getPercent(p, 'Hp'), 0) / players.length : 0
  const avgPe = players.length ? players.reduce((acc, p) => acc + getPercent(p, 'Pe'), 0) / players.length : 0
  const avgSan = players.length ? players.reduce((acc, p) => acc + getPercent(p, 'Sanity'), 0) / players.length : 0

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 md:p-6 flex flex-col gap-5">
      <h2 className="text-lg font-bold text-white mb-1">Média de Recursos do Grupo</h2>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between text-sm mb-2 font-bold">
            <span className="text-[#EF4444] flex items-center gap-1.5"><Heart size={14} /> PV (Vida)</span>
            <span className="text-white">{Math.round(avgHp)}%</span>
          </div>
          <div className="h-4 w-full bg-[#101012] border border-[#27272A] rounded-sm overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <div className="h-full bg-linear-to-r from-[#7F1D1D] to-[#EF4444] transition-all duration-500" style={{ width: `${avgHp}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2 font-bold">
            <span className="text-[#EAB308] flex items-center gap-1.5"><Zap size={14} /> PE (Esforço)</span>
            <span className="text-white">{Math.round(avgPe)}%</span>
          </div>
          <div className="h-4 w-full bg-[#101012] border border-[#27272A] rounded-sm overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <div className="h-full bg-linear-to-r from-[#713F12] to-[#EAB308] transition-all duration-500" style={{ width: `${avgPe}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2 font-bold">
            <span className="text-[#06B6D4] flex items-center gap-1.5"><Brain size={14} /> SAN (Sanidade)</span>
            <span className="text-white">{Math.round(avgSan)}%</span>
          </div>
          <div className="h-4 w-full bg-[#101012] border border-[#27272A] rounded-sm overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <div className="h-full bg-linear-to-r from-[#164E63] to-[#06B6D4] transition-all duration-500" style={{ width: `${avgSan}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
