import { Card, CardBody, CardHeader, Button } from '@heroui/react'
import { m } from 'framer-motion'
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    ResponsiveContainer
} from 'recharts'
import { Dices, Zap, Sword, Brain, Eye, Heart } from 'lucide-react'

interface AttributesPanelProps {
    strength: number
    agility: number
    intellect: number
    vigor: number
    presence: number
    setStrength: (v: number) => void
    setAgility: (v: number) => void
    setIntellect: (v: number) => void
    setVigor: (v: number) => void
    setPresence: (v: number) => void
    availablePoints: number
    usedPoints: number
    attributeBonusFromNex: number
    hasChanges: boolean
    isSaving: boolean
    saveAttributes: () => void
    isDiceTray: boolean
    setIsDiceTray: (v: boolean) => void
    rollDice: (sides: number, count?: number, label?: string, mode?: 'sum' | 'highest', bonus?: number) => void
    isRolling: boolean
    children?: React.ReactNode
}

export default function AttributesPanel({
    strength, agility, intellect, vigor, presence,
    setStrength, setAgility, setIntellect, setVigor, setPresence,
    availablePoints, usedPoints, attributeBonusFromNex,
    hasChanges, isSaving, saveAttributes,
    isDiceTray, setIsDiceTray, isRolling,
    children
}: AttributesPanelProps) {
    const attributesData = [
        { subject: 'FOR', A: strength },
        { subject: 'AGI', A: agility },
        { subject: 'INT', A: intellect },
        { subject: 'VIG', A: vigor },
        { subject: 'PRE', A: presence },
    ]

    const attributeInputs = [
        { label: 'FOR', val: strength, set: setStrength, icon: Sword, color: 'text-orange-500' },
        { label: 'AGI', val: agility, set: setAgility, icon: Zap, color: 'text-yellow-500' },
        { label: 'INT', val: intellect, set: setIntellect, icon: Brain, color: 'text-blue-500' },
        { label: 'VIG', val: vigor, set: setVigor, icon: Heart, color: 'text-red-500' },
        { label: 'PRE', val: presence, set: setPresence, icon: Eye, color: 'text-purple-500' },
    ]

    return (
        <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-zinc-200">
                            {isDiceTray ? 'Bandeja de Dados' : 'Atributos'}
                        </div>
                        {!isDiceTray && (
                            <div className={`px-2 py-0.5 rounded text-xs font-bold border ${availablePoints > 0
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : availablePoints < 0
                                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                }`}>
                                {availablePoints > 0 ? `+${availablePoints} pts` : availablePoints < 0 ? `${availablePoints} pts` : '0 pts'}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isDiceTray && hasChanges && (
                            <Button
                                size="sm"
                                color="primary"
                                isLoading={isSaving}
                                onPress={saveAttributes}
                                className="font-bold text-xs"
                            >
                                Salvar
                            </Button>
                        )}
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className={`${isDiceTray
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 border'
                                : 'bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10'
                                }`}
                            onPress={() => setIsDiceTray(!isDiceTray)}
                            title={isDiceTray ? 'Ver Atributos' : 'Bandeja de Dados'}
                        >
                            <Dices size={16} />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardBody>
                {!isDiceTray ? (
                    <>
                        <div className="text-xs text-zinc-500 mb-3 bg-zinc-950/50 p-2 rounded border border-zinc-800">
                            <span className="text-zinc-400">4 pontos base</span>
                            {attributeBonusFromNex > 0 && (
                                <span className="text-blue-400"> +{attributeBonusFromNex} (NEX)</span>
                            )}
                            {[strength, agility, intellect, vigor, presence].filter((v) => v === 0).length > 0 && (
                                <span className="text-emerald-400">
                                    {' '}+{[strength, agility, intellect, vigor, presence].filter((v) => v === 0).length} (atributos em 0)
                                </span>
                            )}
                            <span className="text-zinc-600"> | Usado: {usedPoints}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-[180px] h-[180px]">
                                <ResponsiveContainer width={180} height={180}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={attributesData}>
                                        <PolarGrid stroke="#3f3f46" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 'bold' }} />
                                        <Radar name="Atributos" dataKey="A" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3 min-w-[120px]">
                                {attributeInputs.map((attr) => (
                                    <div key={attr.label} className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded bg-zinc-950 ${attr.color}`}>
                                            <attr.icon size={12} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400 w-8 whitespace-nowrap">{attr.label}</span>
                                        <div className="flex items-center bg-zinc-950 rounded border border-zinc-800">
                                            <button
                                                onClick={() => attr.set(Math.max(0, attr.val - 1))}
                                                className="px-1.5 py-0.5 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-l transition-colors"
                                            >-</button>
                                            <span className={`text-xs w-5 text-center font-mono ${attr.val === 0 ? 'text-emerald-400' : ''}`}>
                                                {attr.val}
                                            </span>
                                            <button
                                                onClick={() => attr.set(Math.min(5, attr.val + 1))}
                                                disabled={availablePoints <= 0}
                                                className={`px-1.5 py-0.5 rounded-r transition-colors ${availablePoints <= 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-600 hover:text-white hover:bg-zinc-800'}`}
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : children ? children : (
                    <div className="text-zinc-600 text-sm italic text-center py-4">
                        {isRolling ? 'Rolando...' : 'Bandeja de dados ativa — rola uma perícia para ver o resultado aqui.'}
                    </div>
                )}
            </CardBody>
        </Card>
    )
}
