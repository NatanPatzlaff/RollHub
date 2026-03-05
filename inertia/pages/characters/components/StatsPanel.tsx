import { Button, Card, CardBody, CardHeader, Progress, Chip, Divider } from '@heroui/react'
import { Heart, Zap, Brain, Shield, RotateCcw } from 'lucide-react'

interface StatsPanelProps {
    hp: number
    pe: number
    san: number
    maxHp: number
    maxPe: number
    maxSan: number
    characterNex: number
    damageToHp: string
    damageToPe: string
    damageToSan: string
    setHp: (v: number | ((prev: number) => number)) => void
    setPe: (v: number | ((prev: number) => number)) => void
    setSan: (v: number | ((prev: number) => number)) => void
    setDamageToHp: (v: string) => void
    setDamageToPe: (v: string) => void
    setDamageToSan: (v: string) => void
    applyDamageHp: () => void
    applyDamagePe: () => void
    applyDamageSan: () => void
    agility: number
    defenseEquipBonus: number
    dodgeReflexBonus: number
    defense: number
    dodge: number
    reflexosBonus: number
    setDefenseEquipBonus: (v: number) => void
    setDodgeReflexBonus: (v: number) => void
}

export default function StatsPanel({
    hp, pe, san, maxHp, maxPe, maxSan, characterNex,
    damageToHp, damageToPe, damageToSan,
    setHp, setPe, setSan,
    setDamageToHp, setDamageToPe, setDamageToSan,
    applyDamageHp, applyDamagePe, applyDamageSan,
    agility, defenseEquipBonus, dodgeReflexBonus,
    defense, dodge, reflexosBonus,
    setDefenseEquipBonus, setDodgeReflexBonus,
}: StatsPanelProps) {
    const hpStatus = hp === 0 ? 'Morto' : hp === maxHp ? 'Saudável' : hp <= maxHp * 0.5 ? 'Machucado' : 'Ferido'
    const hpStatusColor =
        hp === 0
            ? 'bg-slate-800/10 text-slate-400 border-slate-700/30'
            : hp === maxHp
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : hp <= maxHp * 0.5
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/30'

    return (
        <>
            {/* COMBAT DEFENSES */}
            <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
                <CardHeader className="pb-2 flex justify-between items-center">
                    <div className="text-sm font-bold text-zinc-200">Defesas de Combate</div>
                    <div className="flex items-center gap-1 text-orange-500 text-xs font-bold uppercase tracking-wider">
                        <Shield size={12} /> Armadura Leve
                    </div>
                </CardHeader>
                <CardBody className="pt-0 pb-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-help transition-colors hover:border-zinc-700">
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Defesa</div>
                                <div className="text-[10px] text-zinc-600">10 + AGI ({agility}) + Equip ({defenseEquipBonus})</div>
                            </div>
                            <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{defense}</div>
                        </div>
                        <div className="flex-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-help transition-colors hover:border-zinc-700">
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Esquiva</div>
                                <div className="text-[10px] text-zinc-600">
                                    10 + Equip ({defenseEquipBonus}) + AGI ({agility}) + Reflexos ({reflexosBonus}){dodgeReflexBonus > 0 ? ` + Bônus (+${dodgeReflexBonus})` : ''}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-orange-500 group-hover:text-amber-400 transition-colors">{dodge}</div>
                        </div>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-3">
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-zinc-400 min-w-fit">Bônus Equipamentos</label>
                            <input
                                type="number"
                                value={defenseEquipBonus}
                                onChange={(e) => setDefenseEquipBonus(parseInt(e.target.value) || 0)}
                                min={-5} max={10}
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-zinc-400 min-w-fit">Bônus Adicional</label>
                            <input
                                type="number"
                                value={dodgeReflexBonus}
                                onChange={(e) => setDodgeReflexBonus(parseInt(e.target.value) || 0)}
                                min={-5} max={10}
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold text-center"
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* VITALS STACK */}
            <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
                <CardBody className="p-5 space-y-6">
                    {/* HP */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-red-500 uppercase text-xs font-bold tracking-widest">
                            <div className="flex items-center gap-2"><Heart size={14} /> PV</div>
                            <Chip size="sm" variant="flat" className={`${hpStatusColor} h-6`}>{hpStatus}</Chip>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <label className="font-semibold">Dano Recebido:</label>
                            <input
                                type="number"
                                value={damageToHp}
                                onChange={(e) => setDamageToHp(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyDamageHp()}
                                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-bold text-white w-20"
                                min="0"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-white">{hp}</span>
                            <div className="flex-1">
                                <Progress aria-label="PV" value={(hp / maxHp) * 100} className="h-3"
                                    classNames={{ indicator: 'bg-gradient-to-r from-red-500 to-rose-500', track: 'bg-zinc-950 border border-zinc-800' }} />
                            </div>
                            <span className="text-sm text-zinc-500 font-bold">{maxHp}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-400">
                            {[-1, -5, 1, 5].map((v) => (
                                <Button key={v} size="sm" variant="flat"
                                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                                    onPress={() => setHp((prev: number) => Math.min(maxHp, Math.max(0, prev + v)))}
                                >{v > 0 ? `+${v}` : v}</Button>
                            ))}
                        </div>
                    </div>

                    <Divider className="bg-zinc-800" />

                    {/* PE */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-amber-400 uppercase text-xs font-bold tracking-widest">
                            <div className="flex items-center gap-2"><Zap size={14} /> PE</div>
                            <button onClick={() => setPe(maxPe)}
                                className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 uppercase font-bold tracking-wider transition-colors">
                                <RotateCcw size={12} /> Resetar
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <label className="font-semibold">PE Gasto:</label>
                            <input
                                type="number"
                                value={damageToPe}
                                onChange={(e) => setDamageToPe(String(Math.max(0, Number(e.target.value))))}
                                onKeyDown={(e) => e.key === 'Enter' && applyDamagePe()}
                                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-bold text-white w-20"
                                min="0"
                            />
                            <span className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[11px]">
                                ⚡ {Math.floor(characterNex / 5)} PE/turno
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-white">{pe}</span>
                            <div className="flex-1">
                                <Progress aria-label="PE" value={(pe / maxPe) * 100} className="h-3"
                                    classNames={{ indicator: 'bg-gradient-to-r from-amber-400 to-yellow-400', track: 'bg-zinc-950 border border-zinc-800' }} />
                            </div>
                            <span className="text-sm text-zinc-500 font-bold">{maxPe}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 pt-1">
                            {[-1, -5, 1, 5].map((v) => (
                                <Button key={v} size="sm" variant="flat"
                                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                                    onPress={() => setPe((prev: number) => Math.min(maxPe, Math.max(0, prev + v)))}
                                >{v > 0 ? `+${v}` : v}</Button>
                            ))}
                        </div>
                    </div>

                    <Divider className="bg-zinc-800" />

                    {/* SANITY */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-purple-400 uppercase text-xs font-bold tracking-widest">
                            <div className="flex items-center gap-2"><Brain size={14} /> Sanidade</div>
                            <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                                <input type="checkbox" className="h-2.5 w-2.5 rounded accent-purple-500" />
                                <span className="uppercase font-bold">Insano</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <label className="font-semibold">Dano Mental Recebido:</label>
                            <input
                                type="number"
                                value={damageToSan}
                                onChange={(e) => setDamageToSan(String(Math.max(0, Number(e.target.value))))}
                                onKeyDown={(e) => e.key === 'Enter' && applyDamageSan()}
                                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 font-bold text-white w-20"
                                min="0"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-white">{san}</span>
                            <div className="flex-1">
                                <Progress aria-label="Sanidade" value={(san / maxSan) * 100} className="h-3"
                                    classNames={{ indicator: 'bg-gradient-to-r from-purple-400 to-fuchsia-400', track: 'bg-zinc-950 border border-zinc-800' }} />
                            </div>
                            <span className="text-sm text-zinc-500 font-bold">{maxSan}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs text-zinc-400">
                            {[-1, -5, 1, 5].map((v) => (
                                <Button key={v} size="sm" variant="flat"
                                    className="bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 h-9 font-bold"
                                    onPress={() => setSan((prev: number) => Math.min(maxSan, Math.max(0, prev + v)))}
                                >{v > 0 ? `+${v}` : v}</Button>
                            ))}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}
