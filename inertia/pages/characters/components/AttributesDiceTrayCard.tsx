import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardBody, Chip, Button } from '@heroui/react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import {
  Dices,
  Save,
  Dumbbell,
  Wind,
  Brain,
  Heart,
  Ghost,
} from 'lucide-react'

// ─── Tipos públicos ────────────────────────────────────────────────────────────

/** Atributos do personagem */
export interface AttributeValues {
  strength: number
  agility: number
  intellect: number
  vigor: number
  presence: number
}

/** Props do AttributesDiceTrayCard */
export interface AttributesDiceTrayCardProps {
  // Valores atuais (estado externo)
  strength: number
  agility: number
  intellect: number
  vigor: number
  presence: number

  // Setters dos atributos
  onStrengthChange: (v: number) => void
  onAgilityChange: (v: number) => void
  onIntellectChange: (v: number) => void
  onVigorChange: (v: number) => void
  onPresenceChange: (v: number) => void

  // Pontuação e limites
  isMundano: boolean
  baseAttrPoints: number
  maxAttrValue: number
  attributeBonusFromNex: number

  /** Valores originais do banco (para detectar unsaved changes) */
  initialAttrs: AttributeValues

  /** Salvar atributos no backend */
  onSaveAttributes: (attrs: AttributeValues) => void
  isSaving: boolean

  // dddice (opcionais — se ausentes, apenas rolagem local)
  dddiceApiKey?: string
  dddiceRoomSlug?: string
}

/** Métodos expostos ao componente pai via ref */
export interface AttributesDiceTrayCardHandle {
  /** Rola N dados de `sides` faces e exibe o resultado na bandeja */
  rollDice: (
    sides: number,
    count?: number,
    label?: string,
    mode?: 'sum' | 'highest',
    bonus?: number
  ) => void
  /** Rola ataque + dano de uma arma e exibe na bandeja */
  rollWeapon: (
    weapon: { name: string; range: string; damage: string },
    str: number,
    agi: number,
    characterSkills?: any[]
  ) => void
  /** Abre o modo bandeja de dados */
  openDiceTray: () => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

const AttributesDiceTrayCard = forwardRef<
  AttributesDiceTrayCardHandle,
  AttributesDiceTrayCardProps
>(function AttributesDiceTrayCard(
  {
    strength,
    agility,
    intellect,
    vigor,
    presence,
    onStrengthChange,
    onAgilityChange,
    onIntellectChange,
    onVigorChange,
    onPresenceChange,
    isMundano,
    baseAttrPoints,
    maxAttrValue,
    attributeBonusFromNex,
    initialAttrs,
    onSaveAttributes,
    isSaving,
    dddiceApiKey,
    dddiceRoomSlug,
  },
  ref
) {
  // ── Estado interno da bandeja ──────────────────────────────────────────────
  const [isDiceTray, setIsDiceTray] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [diceResult, setDiceResult] = useState<{
    label: string
    total: number
    rolls: number[]
  } | null>(null)
  const [weaponRollResult, setWeaponRollResult] = useState<{
    weapon: string
    attack: { total: number; rolls: number[]; label: string; skill: string }
    damage: { total: number; rolls: number[]; label: string }
  } | null>(null)
  const [diceHistory, setDiceHistory] = useState<Array<{ label: string; total: number }>>([])

  // ── Refs do dddice ─────────────────────────────────────────────────────────
  const diceCanvasRef = useRef<HTMLCanvasElement>(null)
  const dddiceRef = useRef<any>(null)
  const diceThemeRef = useRef<string | undefined>(undefined)

  // ── Cálculos derivados ─────────────────────────────────────────────────────
  const attrs = [strength, agility, intellect, vigor, presence]
  const zeroBonus = attrs.filter((v) => v === 0).length
  const totalPoints = baseAttrPoints + (isMundano ? 0 : attributeBonusFromNex) + zeroBonus
  const usedPoints = attrs.reduce((sum, v) => sum + (v - 1), 0)
  const availablePoints = totalPoints - usedPoints

  const hasChanges =
    strength !== initialAttrs.strength ||
    agility !== initialAttrs.agility ||
    intellect !== initialAttrs.intellect ||
    vigor !== initialAttrs.vigor ||
    presence !== initialAttrs.presence

  // ── Dados do radar ─────────────────────────────────────────────────────────
  const attributesData = [
    { subject: 'FOR', A: strength, fullMark: 10 },
    { subject: 'AGI', A: agility, fullMark: 10 },
    { subject: 'INT', A: intellect, fullMark: 10 },
    { subject: 'VIG', A: vigor, fullMark: 10 },
    { subject: 'PRE', A: presence, fullMark: 10 },
  ]

  const attributeInputs = [
    { label: 'FOR', val: strength, set: onStrengthChange, icon: Dumbbell, color: 'text-red-400' },
    { label: 'AGI', val: agility, set: onAgilityChange, icon: Wind, color: 'text-emerald-400' },
    { label: 'INT', val: intellect, set: onIntellectChange, icon: Brain, color: 'text-purple-400' },
    { label: 'VIG', val: vigor, set: onVigorChange, icon: Heart, color: 'text-rose-400' },
    { label: 'PRE', val: presence, set: onPresenceChange, icon: Ghost, color: 'text-cyan-400' },
  ]

  // ── Inicialização dddice ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isDiceTray || !dddiceApiKey) return
    let mounted = true
    let rafId: number

    const init = async (canvas: HTMLCanvasElement) => {
      const { ThreeDDice } = await import('dddice-js')
      if (!mounted) return

      const instance = new ThreeDDice(canvas, dddiceApiKey, { autoClear: 2000 })
      await instance.initialize()

      // Aproxima câmera para dados maiores
      try {
        const cam = (instance as any).camera
        if (cam?.position) cam.position.z *= 0.2
      } catch (_) {}

      if (!mounted) return

      if (dddiceRoomSlug) {
        try {
          await (instance as any).connect(dddiceRoomSlug)
        } catch (_) {}
      }

      if (mounted) {
        dddiceRef.current = instance
        // Pré-carrega tema para eliminar delay na primeira rolagem
        if (!diceThemeRef.current) {
          try {
            const res = await fetch('https://dddice.com/api/1.0/dice-box', {
              headers: { Authorization: `Bearer ${dddiceApiKey}` },
            })
            const data = await res.json()
            diceThemeRef.current = data?.data?.[0]?.id
          } catch (_) {}
        }
      }
    }

    const tryInit = () => {
      if (diceCanvasRef.current) {
        init(diceCanvasRef.current).catch(console.error)
      } else {
        rafId = requestAnimationFrame(tryInit)
      }
    }
    rafId = requestAnimationFrame(tryInit)

    return () => {
      mounted = false
      cancelAnimationFrame(rafId)
      dddiceRef.current = null
    }
  }, [isDiceTray, dddiceApiKey, dddiceRoomSlug])

  // ── Helper: aguarda dddice ficar pronto ────────────────────────────────────
  const waitForDddice = useCallback(
    () =>
      new Promise<void>((resolve) => {
        if (dddiceRef.current) { resolve(); return }
        const start = Date.now()
        const check = () => {
          if (dddiceRef.current || Date.now() - start > 3000) resolve()
          else setTimeout(check, 50)
        }
        check()
      }),
    []
  )

  // ── rollDice ───────────────────────────────────────────────────────────────
  const rollDice = useCallback(
    async (
      sides: number,
      count = 1,
      label?: string,
      mode: 'sum' | 'highest' = 'sum',
      bonus = 0
    ) => {
      const diceLabel =
        label || `${count}d${sides}${bonus !== 0 ? (bonus > 0 ? `+${bonus}` : bonus) : ''}`

      setIsRolling(true)
      setDiceResult(null)

      const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides))
      const baseValue = mode === 'highest' ? Math.max(...rolls) : rolls.reduce((a, b) => a + b, 0)
      const total = baseValue + bonus

      const result = { label: diceLabel, total, rolls }
      setWeaponRollResult(null)
      setDiceResult(result)
      setDiceHistory((prev) => [{ label: diceLabel, total }, ...prev].slice(0, 8))
      setIsRolling(false)

      // Animação 3D em paralelo (fire-and-forget)
      if (dddiceApiKey) {
        ;(async () => {
          await waitForDddice()
          if (!dddiceRef.current) return
          try {
            const diceType = `d${sides}`
            const themeSlug = diceThemeRef.current
            const diceArr = rolls.map((v) =>
              themeSlug ? { type: diceType, theme: themeSlug, value: v } : { type: diceType, value: v }
            )
            await (dddiceRef.current as any).roll(diceArr)
          } catch (_) {}
        })()
      }
    },
    [dddiceApiKey, waitForDddice]
  )

  // ── rollWeapon ─────────────────────────────────────────────────────────────
  const rollWeapon = useCallback(
    async (
      weapon: { name: string; range: string; damage: string },
      str: number,
      agi: number,
      characterSkills: any[] = []
    ) => {
      setIsRolling(true)
      setDiceResult(null)
      setWeaponRollResult(null)

      const isMelee = weapon.range === 'Corpo a corpo'
      const skill = isMelee ? 'Luta' : 'Pontaria'
      const attrVal = Math.max(1, isMelee ? str : agi)
      const skillEntry = characterSkills.find((cs: any) => cs.skill?.name === skill)
      const degree = skillEntry?.trainingDegree ?? 0
      const trainingBonus = degree >= 15 ? 15 : degree >= 10 ? 10 : degree >= 5 ? 5 : 0

      const attackRolls = Array.from({ length: attrVal }, () => Math.ceil(Math.random() * 20))
      const attackBase = Math.max(...attackRolls)
      const attackTotal = attackBase + trainingBonus

      const damageMatch = weapon.damage.match(/^(\d+)d(\d+)$/i)
      const dmgCount = damageMatch ? parseInt(damageMatch[1]) : 1
      const dmgSides = damageMatch ? parseInt(damageMatch[2]) : 6
      const damageRolls = Array.from({ length: dmgCount }, () => Math.ceil(Math.random() * dmgSides))
      const damageTotal = damageRolls.reduce((a, b) => a + b, 0)

      const attackLabel = `${skill} (${attrVal}d20${trainingBonus > 0 ? `+${trainingBonus}` : ''})`

      setWeaponRollResult({
        weapon: weapon.name,
        attack: { total: attackTotal, rolls: attackRolls, label: attackLabel, skill },
        damage: { total: damageTotal, rolls: damageRolls, label: weapon.damage },
      })
      setDiceHistory((prev) =>
        [
          { label: `${weapon.name} Ataque`, total: attackTotal },
          { label: `${weapon.name} Dano`, total: damageTotal },
          ...prev,
        ].slice(0, 8)
      )
      setIsRolling(false)

      // Animação 3D em paralelo
      if (dddiceApiKey) {
        ;(async () => {
          await waitForDddice()
          if (!dddiceRef.current) return
          try {
            const theme = diceThemeRef.current
            const allDice = [
              ...attackRolls.map((v) =>
                theme ? { type: 'd20', theme, value: v } : { type: 'd20', value: v }
              ),
              ...damageRolls.map((v) =>
                theme
                  ? { type: `d${dmgSides}`, theme, value: v }
                  : { type: `d${dmgSides}`, value: v }
              ),
            ]
            await (dddiceRef.current as any).roll(allDice)
          } catch (_) {}
        })()
      }
    },
    [dddiceApiKey, waitForDddice]
  )

  // ── Expõe API ao pai ───────────────────────────────────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      rollDice,
      rollWeapon,
      openDiceTray: () => setIsDiceTray(true),
    }),
    [rollDice, rollWeapon]
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Card
      className={`border shadow-none transition-colors duration-300 rounded-xl ${
        isDiceTray ? 'bg-zinc-900 border-amber-500/30' : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      {/* Header */}
      <CardHeader className="pb-2 flex justify-between items-center border-b border-zinc-800/50">
        <div
          className={`text-lg font-bold transition-colors ${
            isDiceTray ? 'text-amber-400' : 'text-zinc-100'
          }`}
        >
          {isDiceTray ? '🎲 Bandeja de Dados' : 'Atributos'}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle modo atributos / bandeja */}
          <button
            onClick={() => {
              if (isDiceTray) diceThemeRef.current = undefined
              setIsDiceTray((prev) => !prev)
              setDiceResult(null)
            }}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
              isDiceTray ? 'bg-amber-500' : 'bg-zinc-700'
            }`}
            title={isDiceTray ? 'Voltar para Atributos' : 'Abrir Bandeja de Dados'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isDiceTray ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
          <Dices size={16} className={isDiceTray ? 'text-amber-400' : 'text-zinc-600'} />

          {/* Controles de pontos (somente modo atributos) */}
          {!isDiceTray && (
            <>
              <Chip
                size="sm"
                className={`border ${
                  availablePoints > 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : availablePoints < 0
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}
              >
                {availablePoints} pts
              </Chip>
              {hasChanges && (
                <Button
                  size="sm"
                  color="primary"
                  isLoading={isSaving}
                  onPress={() =>
                    onSaveAttributes({ strength, agility, intellect, vigor, presence })
                  }
                  isDisabled={availablePoints < 0}
                  className="font-bold"
                >
                  <Save size={14} className="mr-1" />
                  Salvar
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {!isDiceTray ? (
          /* ── Modo Atributos ─────────────────────────────────────────────── */
          <>
            {/* Barra informativa de pontos */}
            <div className="text-xs text-zinc-500 mb-3 bg-zinc-950/50 p-2 rounded border border-zinc-800">
              <span className="text-zinc-400">{baseAttrPoints} pontos base</span>
              {!isMundano && attributeBonusFromNex > 0 && (
                <span className="text-blue-400"> +{attributeBonusFromNex} (NEX)</span>
              )}
              {attrs.filter((v) => v === 0).length > 0 && (
                <span className="text-emerald-400">
                  {' '}+{attrs.filter((v) => v === 0).length} (atributos em 0)
                </span>
              )}
              <span className="text-zinc-600"> | Usado: {usedPoints}</span>
            </div>

            {/* Radar + inputs lado a lado */}
            <div className="flex items-center justify-between">
              {/* Radar */}
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width={180} height={180}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={attributesData}>
                    <PolarGrid stroke="#3f3f46" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <Radar
                      name="Atributos"
                      dataKey="A"
                      stroke="#f97316"
                      strokeWidth={2}
                      fill="#f97316"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Inputs de atributo */}
              <div className="space-y-3 min-w-[120px]">
                {attributeInputs.map((attr) => (
                  <div key={attr.label} className="flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-zinc-950 ${attr.color}`}>
                      <attr.icon size={12} />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 w-8 whitespace-nowrap">
                      {attr.label}
                    </span>
                    <div className="flex items-center bg-zinc-950 rounded border border-zinc-800">
                      <button
                        onClick={() => attr.set(Math.max(0, attr.val - 1))}
                        className="px-1.5 py-0.5 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-l transition-colors"
                      >
                        -
                      </button>
                      <span
                        className={`text-xs w-5 text-center font-mono ${
                          attr.val === 0 ? 'text-emerald-400' : ''
                        }`}
                      >
                        {attr.val}
                      </span>
                      <button
                        onClick={() => attr.set(Math.min(maxAttrValue, attr.val + 1))}
                        disabled={availablePoints <= 0 || attr.val >= maxAttrValue}
                        className={`px-1.5 py-0.5 rounded-r transition-colors ${
                          availablePoints <= 0 || attr.val >= maxAttrValue
                            ? 'text-zinc-700 cursor-not-allowed'
                            : 'text-zinc-600 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ── Modo Bandeja de Dados ──────────────────────────────────────── */
          <div className="space-y-3">
            {/* Canvas do dddice */}
            <div
              className="relative rounded-xl overflow-hidden bg-black"
              style={{ height: '300px' }}
            >
              <canvas ref={diceCanvasRef} className="absolute inset-0 w-full h-full" />
              {!diceResult && !isRolling && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-zinc-800">
                    <Dices size={40} className="mx-auto mb-2 opacity-30" />
                    <span className="text-xs">Aguardando rolagem</span>
                  </div>
                </div>
              )}
            </div>

            {/* Resultado */}
            {(diceResult || weaponRollResult || isRolling) && (
              <div className="px-1">
                {isRolling ? (
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      ⟳
                    </motion.span>
                    Rolando...
                  </div>
                ) : weaponRollResult ? (
                  /* Resultado de arma: ataque + dano */
                  <motion.div
                    key={weaponRollResult.weapon + weaponRollResult.attack.total}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-1"
                  >
                    <div className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider truncate">
                      {weaponRollResult.weapon}
                    </div>
                    <div className="flex items-stretch gap-3">
                      {/* Ataque */}
                      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                        <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
                          Ataque · {weaponRollResult.attack.skill}
                        </div>
                        <div className="text-3xl font-black text-amber-400 leading-none">
                          {weaponRollResult.attack.total}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          {weaponRollResult.attack.label} → [{weaponRollResult.attack.rolls.join(', ')}]
                        </div>
                      </div>
                      {/* Dano */}
                      <div className="flex-1 bg-zinc-950 border border-red-900/30 rounded-lg px-3 py-2">
                        <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">
                          Dano · {weaponRollResult.damage.label}
                        </div>
                        <div className="text-3xl font-black text-red-400 leading-none">
                          {weaponRollResult.damage.total}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          [{weaponRollResult.damage.rolls.join(', ')}]
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : diceResult ? (
                  /* Resultado de perícia simples */
                  <motion.div
                    key={diceResult.total + diceResult.label}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="text-4xl font-black text-amber-400">{diceResult.total}</span>
                    <span className="text-xs text-zinc-500">
                      {diceResult.label} → [{diceResult.rolls.join(', ')}]
                    </span>
                  </motion.div>
                ) : null}
              </div>
            )}

            {/* Histórico compacto */}
            <AnimatePresence>
              {diceHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {diceHistory.map((h, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] font-bold text-zinc-400"
                      >
                        {h.label}: <span className="text-amber-400">{h.total}</span>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setDiceHistory([])}
                    className="text-[10px] text-zinc-700 hover:text-zinc-400 shrink-0 ml-2"
                  >
                    limpar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardBody>
    </Card>
  )
})

export default AttributesDiceTrayCard
