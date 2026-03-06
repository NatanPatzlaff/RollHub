import { m } from 'framer-motion'

interface DiceTrayProps {
    diceResult: { label: string; total: number; rolls: number[] } | null
    weaponRollResult: {
        weapon: string
        attack: { total: number; rolls: number[]; label: string; skill: string }
        damage: { total: number; rolls: number[]; label: string }
    } | null
    isRolling: boolean
    diceHistory: Array<{ label: string; total: number }>
    diceCanvasRef: React.RefObject<HTMLCanvasElement | null>
    setDiceHistory: (fn: (prev: Array<{ label: string; total: number }>) => Array<{ label: string; total: number }>) => void
}

export default function DiceTray({
    diceResult,
    weaponRollResult,
    isRolling,
    diceHistory,
    diceCanvasRef,
    setDiceHistory,
}: DiceTrayProps) {
    return (
        <div className="space-y-3">
            {/* Área preta — only the 3D dice animation */}
            <div className="relative rounded-xl overflow-hidden bg-black" style={{ height: '300px' }}>
                <canvas ref={diceCanvasRef} className="absolute inset-0 w-full h-full" />

            </div>

            {/* Resultado abaixo da área dos dados */}
            {(diceResult || weaponRollResult || isRolling) && (
                <div className="px-1">
                    {isRolling ? (
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                            <m.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                                style={{ display: 'inline-block' }}
                            >⟳</m.span>
                            Rolando...
                        </div>
                    ) : weaponRollResult ? (
                        /* Resultado de arma: ataque + dano lado a lado */
                        <m.div
                            key={weaponRollResult.weapon + weaponRollResult.attack.total}
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-1"
                        >
                            <div className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider truncate">{weaponRollResult.weapon}</div>
                            <div className="flex items-stretch gap-3">
                                {/* Ataque */}
                                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                                    <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">Ataque · {weaponRollResult.attack.skill}</div>
                                    <div className="text-3xl font-black text-amber-400 leading-none">{weaponRollResult.attack.total}</div>
                                    <div className="text-[10px] text-zinc-600 mt-0.5">{weaponRollResult.attack.label} → [{weaponRollResult.attack.rolls.join(', ')}]</div>
                                </div>
                                {/* Dano */}
                                <div className="flex-1 bg-zinc-950 border border-red-900/30 rounded-lg px-3 py-2">
                                    <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">Dano · {weaponRollResult.damage.label}</div>
                                    <div className="text-3xl font-black text-red-400 leading-none">{weaponRollResult.damage.total}</div>
                                    <div className="text-[10px] text-zinc-600 mt-0.5">[{weaponRollResult.damage.rolls.join(', ')}]</div>
                                </div>
                            </div>
                        </m.div>
                    ) : diceResult ? (
                        /* Resultado de perícia simples */
                        <m.div
                            key={diceResult.total + diceResult.label}
                            initial={{ y: 6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-baseline gap-3"
                        >
                            <span className="text-4xl font-black text-amber-400">{diceResult.total}</span>
                            <span className="text-xs text-zinc-500">{diceResult.label} → [{diceResult.rolls.join(', ')}]</span>
                        </m.div>
                    ) : null}
                </div>
            )}

            {/* Histórico compacto */}
            {diceHistory.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {diceHistory.map((h, i) => (
                            <span key={i} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] font-bold text-zinc-400">
                                {h.label}: <span className="text-amber-400">{h.total}</span>
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => setDiceHistory(() => [])}
                        className="text-[10px] text-zinc-700 hover:text-zinc-400 shrink-0 ml-2"
                    >
                        limpar
                    </button>
                </div>
            )}
        </div>
    )
}
