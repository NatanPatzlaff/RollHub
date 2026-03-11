import { Heart, Zap, Brain } from 'lucide-react'

interface PlayerCardProps {
  character: any
}

export default function PlayerCard({ character }: PlayerCardProps) {
  const stats = character.stats || {
    currentHp: 0, maxHp: 1,
    currentPe: 0, maxPe: 1,
    currentSanity: 0, maxSanity: 1
  }

  const getStatusColor = (current: number, max: number) => {
    const percent = (current / max) * 100
    if (percent > 50) return 'text-[#10B981]'
    if (percent > 20) return 'text-[#F97316]'
    return 'text-[#EF4444]'
  }

  const getStatusLabel = (current: number, max: number) => {
    const percent = (current / max) * 100
    if (percent > 50) return 'Saudável'
    if (percent > 20) return 'Machucado'
    return 'Grave'
  }

  const hpPercent = (stats.currentHp / stats.maxHp) * 100
  const pePercent = (stats.currentPe / stats.maxPe) * 100
  const sanPercent = (stats.currentSanity / stats.maxSanity) * 100

  return (
    <div className="bg-[#101012] border border-[#27272A] rounded-lg p-4 hover:border-[#3F3F46] transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-white font-bold text-lg leading-tight">{character.name}</h3>
          <p className="text-[#A1A1AA] text-xs mt-0.5">
            {character.class?.name || 'Sem Classe'} • Jogador: {character.user?.fullName || character.user?.email || 'N/A'}
          </p>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider shrink-0 ${getStatusColor(stats.currentHp, stats.maxHp)}`}>
          {getStatusLabel(stats.currentHp, stats.maxHp)}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#A1A1AA] flex items-center gap-1"><Heart size={12} className="text-[#EF4444]" /> PV</span>
            <span className="font-bold text-white">{stats.currentHp} / {stats.maxHp}</span>
          </div>
          <div className="h-1.5 w-full bg-[#1C1C1E] rounded-full overflow-hidden">
            <div className="h-full bg-[#EF4444] transition-all" style={{ width: `${hpPercent}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#A1A1AA] flex items-center gap-1"><Zap size={12} className="text-[#EAB308]" /> PE</span>
            <span className="font-bold text-white">{stats.currentPe} / {stats.maxPe}</span>
          </div>
          <div className="h-1.5 w-full bg-[#1C1C1E] rounded-full overflow-hidden">
            <div className="h-full bg-[#EAB308] transition-all" style={{ width: `${pePercent}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#A1A1AA] flex items-center gap-1"><Brain size={12} className="text-[#06B6D4]" /> SAN</span>
            <span className="font-bold text-white">{stats.currentSanity} / {stats.maxSanity}</span>
          </div>
          <div className="h-1.5 w-full bg-[#1C1C1E] rounded-full overflow-hidden">
            <div className="h-full bg-[#06B6D4] transition-all" style={{ width: `${sanPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
