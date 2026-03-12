import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardBody, Chip, Button, Switch } from '@heroui/react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import { Dices, Save, Dumbbell, Wind, Brain, Heart, Ghost } from 'lucide-react'

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

  // Nome do jogador para as rolagens
  playerName?: string

  /** Callback quando uma rolagem acontece (local ou remota) */
  onNewRoll?: (roll: RollEntry) => void
}

/** Interface da rolagem para o histórico */
export interface RollEntry {
  id: string | number
  player: string
  action: string
  roll: string
  result: number
  time: string
  isCritical?: boolean
  isFail?: boolean
  isGM?: boolean
}

/** Métodos expostos ao componente pai via ref */
export interface AttributesDiceTrayCardHandle {
  /** Rola N dados de `sides` faces e exibe o resultado na bandeja */
  rollDice: (
    sides: number,
    count?: number,
    label?: string,
    mode?: 'sum' | 'highest',
    bonus?: number,
    extraDice?: string[]
  ) => void
  /** Rola ataque + dano de uma arma e exibe na bandeja */
  rollWeapon: (
    weapon: { name: string; range: string; damage: string; critical?: string; criticalMultiplier?: string; extraAttackBonus?: number; extraDamageBonus?: number; extraCritBonus?: number; extraDamageDice?: string[] },
    str: number,
    agi: number,
    characterSkills?: any[]
  ) => void
  /** Rola o teste de Ocultismo de um ritual e exibe na bandeja */
  rollRitual: (params: {
    name: string
    version: 'base' | 'discente' | 'verdadeiro'
    diceCount: number
    trainingBonus: number
    dt: number
    totalPe: number
    damageDice: string | undefined
    onResult: (r: {
      rolls: number[]
      best: number
      total: number
      damageResult: number | undefined
      damageRolls: number[] | undefined
    }) => void
  }) => void
  /** Abre o modo bandeja de dados */
  openDiceTray: () => void
}

// ─── Componente ───────────────────────────────────────────────────────────────

const AttributesDiceTrayCard = forwardRef<AttributesDiceTrayCardHandle, AttributesDiceTrayCardProps>((props, ref) => {
  const {
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
    playerName = 'Jogador',
    onNewRoll,
  } = props
  // ── Estado interno da bandeja ──────────────────────────────────────────────
  const [isDiceTray, setIsDiceTray] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [diceResult, setDiceResult] = useState<{
    label: string
    total: number
    rolls: number[]
    extraRolls?: number[]
    bonus?: number
  } | null>(null)
  const [weaponRollResult, setWeaponRollResult] = useState<{
    weapon: string
    attack: { total: number; rolls: number[]; label: string; skill: string; isCritical?: boolean; critThreshold?: number }
    damage: { total: number; rolls: number[]; label: string; isCritical?: boolean; critMultiplier?: number; baseDamage?: number }
  } | null>(null)
  const [ritualRollResult, setRitualRollResult] = useState<{
    name: string
    version: string
    rolls: number[]
    best: number
    trainingBonus: number
    total: number
    dt: number
    totalPe: number
    success: boolean
    diceCount: number
    damageDice: string | undefined
    damageTotal: number | undefined
    damageRolls: number[] | undefined
  } | null>(null)
  const [diceHistory, setDiceHistory] = useState<Array<{ label: string; total: number }>>([])

  // ── Refs do dddice ─────────────────────────────────────────────────────────
  const diceCanvasRef = useRef<HTMLCanvasElement>(null)
  const dddiceRef = useRef<any>(null)
  const diceThemeRef = useRef<string | undefined>(undefined)

  // Cache de pré-carregamento (sobrevive a re-renders, compartilhado entre effects)
  const preloadRef = useRef<{
    modulePromise?: Promise<any>
    themePromise?: Promise<{ id: string; data: any } | null>
  }>({})

  // ── Sync ID / Result Waiter / Diagnóstico ──────────────────────────────────
  // Mapa de IDs de correlação para resolvers de Promessas
  const pendingSyncRolls = useRef<Map<string, (dice: any[]) => void>>(new Map())

  // ── Cálculos derivados ─────────────────────────────────────────────────────
  const attrs = [strength, agility, intellect, vigor, presence]
  const zeroBonus = attrs.filter((v) => v === 0).length
  const totalPoints = baseAttrPoints + (isMundano ? 0 : attributeBonusFromNex) + zeroBonus
  // Each attribute starts at 1, so usedPoints = sum of (value - 1), clamped to 0 to avoid
  // counting zero-value attributes as negative (which would otherwise double-grant the zero bonus)
  const usedPoints = attrs.reduce((sum, v) => sum + Math.max(0, v - 1), 0)
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

  // ── Helper: aguarda dddice ficar pronto (sem polling) ───────────────────
  const dddiceReadyResolvers = useRef<Array<() => void>>([])

  const notifyDddiceReady = useCallback(() => {
    for (const resolve of dddiceReadyResolvers.current) resolve()
    dddiceReadyResolvers.current = []
  }, [])

  const waitForDddice = useCallback(
    () =>
      new Promise<void>((resolve) => {
        if (dddiceRef.current) {
          resolve()
          return
        }
        dddiceReadyResolvers.current.push(resolve)
        setTimeout(() => {
          const idx = dddiceReadyResolvers.current.indexOf(resolve)
          if (idx >= 0) dddiceReadyResolvers.current.splice(idx, 1)
          resolve()
        }, 5000)
      }),
    []
  )



  // ── Helper: aguarda resultado físico do motor dddice por Sync ID (sid) ──
  const waitDiceResult = useCallback((sid: string, timeout = 7000) => {
    return new Promise<any[]>((resolve, reject) => {
      console.log(`[DICE-DEBUG] Aguardando resultados para SID: ${sid} (timeout ${timeout}ms)`)
      pendingSyncRolls.current.set(sid, resolve)
      setTimeout(() => {
        if (pendingSyncRolls.current.has(sid)) {
          pendingSyncRolls.current.delete(sid)
          reject(new Error(`Timeout do motor físico (DICE-SYNC-ERROR). O dddice não respondeu em ${timeout}ms para o SID: ${sid}`))
        }
      }, timeout)
    })
  }, [])

  // ── Pré-carregamento: módulo dddice + tema (roda no mount, ANTES do toggle) ──
  useEffect(() => {
    // Inicia import do bundle dddice-js em background (~1.2MB)
    if (!preloadRef.current.modulePromise) {
      preloadRef.current.modulePromise = import('dddice-js')
    }
    // Busca tema em paralelo (duas APIs em sequência, mas inicia imediatamente)
    if (!preloadRef.current.themePromise && dddiceApiKey) {
      preloadRef.current.themePromise = (async () => {
        try {
          const headers = { Authorization: `Bearer ${dddiceApiKey}` }
          const boxRes = await fetch('https://dddice.com/api/1.0/dice-box', { headers })
          const boxData = await boxRes.json()
          const themeId = boxData?.data?.[0]?.id ?? 'dddice-standard'
          diceThemeRef.current = themeId
          const themeRes = await fetch(`https://dddice.com/api/1.0/theme/${themeId}`, { headers })
          const themeData = await themeRes.json()
          return themeData?.data ? { id: themeId, data: themeData.data } : null
        } catch (_) {
          diceThemeRef.current = 'dddice-standard'
          return null
        }
      })()
    } else if (!dddiceApiKey && !diceThemeRef.current) {
      diceThemeRef.current = 'dddice-standard'
    }
  }, [dddiceApiKey])

  // ── Inicialização dddice (quando bandeja abre, usa cache do preload) ───────
  useEffect(() => {
    if (!isDiceTray) return
    let mounted = true

    const init = async (canvas: HTMLCanvasElement) => {
      // Usa módulo pré-carregado (já deve estar pronto ou quase)
      const mod = preloadRef.current.modulePromise || import('dddice-js')
      const { ThreeDDice } = await mod
      if (!mounted) return

      // Dimensiona canvas com pixels reais do container
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
      }

      const instance = new ThreeDDice(canvas, dddiceApiKey || undefined, { autoClear: 2000 })
      instance.initialize()
      instance.start()

      if (rect) {
        instance.resize(rect.width, rect.height)
      }

      if (!mounted) return

      // Conecta sala multiplayer (não-bloqueante, em paralelo com tema)
      const connectPromise =
        dddiceRoomSlug && dddiceApiKey
          ? (instance as any).connect(dddiceRoomSlug).catch(() => {})
          : Promise.resolve()

      // Usa tema pré-carregado (já deve estar em cache)
      const themeResult = preloadRef.current.themePromise
        ? await preloadRef.current.themePromise
        : null

      if (!mounted) return

      if (themeResult) {
        await instance.loadTheme(themeResult.data, true)
        await instance.loadThemeResources(themeResult.id)
      } else if (!diceThemeRef.current) {
        diceThemeRef.current = 'dddice-standard'
      }

      await connectPromise

      if (mounted) {
        dddiceRef.current = instance
        
        // Listen for new rolls (including from other players)
        instance.on('roll:finished', (event: any) => {
          const roll = event.roll
          const isLocal = event.isLocal
          
          if (roll?.dice && Array.isArray(roll.dice)) {
            // Verifica se algum dado tem um Sync ID (sid) nos metadados (busca profunda)
            const sid = roll.dice.find((d: any) => d.metadata?.sid)?.metadata?.sid
            
            if (sid && pendingSyncRolls.current.has(sid)) {
              console.log(`[DICE-DEBUG] Sincronização detectada para SID: ${sid}`)
              const resolver = pendingSyncRolls.current.get(sid)
              if (resolver) {
                resolver(roll.dice)
                pendingSyncRolls.current.delete(sid)
              }
            } else if (sid) {
              console.log(`[DICE-DEBUG] SID ${sid} recebido, mas nenhum resolver pendente (Pode ser evento duplicado).`)
            } else if (isLocal) {
              console.log('[DICE-DEBUG] Rolagem local sem SID detectada.', roll.dice)
            }
          }

          if (!onNewRoll) return
          
          // Se for de outro player (não local), adiciona ao histórico
          if (!isLocal && roll) {
            onNewRoll({
              id: roll.uuid,
              player: roll.user?.username || roll.user?.name || 'Outro Jogador',
              action: 'Rolagem dddice',
              roll: roll.equation,
              result: roll.total_value,
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            })
          }
        })

        notifyDddiceReady()
      }
    }

    // Canvas já deve existir no primeiro frame (isDiceTray ativa o JSX)
    if (diceCanvasRef.current) {
      init(diceCanvasRef.current).catch(console.error)
    } else {
      // Fallback: espera 1 frame para o React renderizar o canvas
      const rafId = requestAnimationFrame(() => {
        if (diceCanvasRef.current && mounted) {
          init(diceCanvasRef.current).catch(console.error)
        }
      })
      return () => {
        mounted = false
        cancelAnimationFrame(rafId)
      }
    }

    return () => {
      mounted = false
      if (dddiceRef.current) {
        try { dddiceRef.current.disconnect?.() } catch (_) {}
        try { dddiceRef.current.stop() } catch (_) {}
      }
      dddiceRef.current = null
    }
  }, [isDiceTray, dddiceApiKey, dddiceRoomSlug, notifyDddiceReady])

  // ── rollDice ───────────────────────────────────────────────────────────────
  const rollDice = useCallback(
    async (
      sides: number,
      count = 1,
      label?: string,
      mode: 'sum' | 'highest' = 'sum',
      bonus = 0,
      extraDice: string[] = []
    ) => {
      const diceLabel =
        label || `${count}d${sides}${bonus !== 0 ? (bonus > 0 ? `+${bonus}` : bonus) : ''}`

      setIsRolling(true)
      setDiceResult(null)
      setWeaponRollResult(null) // Limpa outros resultados

      let rolls: number[] = []
      let extraRolls: number[] = []
      let total = 0

      // Se a bandeja estiver ativa e o plugin carregado, usamos o motor dddice como fonte da verdade
      if (isDiceTray && dddiceRef.current) {
        const sid = `sid_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        try {
          await waitForDddice()
          const themeSlug = diceThemeRef.current || 'dddice-standard'
          
          // Preparamos a lista de dados para o motor de física jogar
          const diceToRoll = [
            ...Array.from({ length: count }, () => ({
              type: `d${sides}`,
              theme: themeSlug,
              metadata: { isMain: true, sid }
            })),
            ...extraDice.flatMap(diceStr => {
              const match = diceStr.match(/^(\d+)d(\d+)$/i)
              if (match) {
                const c = parseInt(match[1])
                const s = parseInt(match[2])
                return Array.from({ length: c }, () => ({
                  type: `d${s}`,
                  theme: themeSlug,
                  metadata: { isExtra: true, sid }
                }))
              }
              return []
            })
          ]


          // Disparamos a rolagem LOCAL
          console.log(`[DICE-DEBUG] Disparando rolagem reativa (SID: ${sid})`)
          
          // CRIAMOS a promessa ANTES do disparo para evitar race condition
          const resultPromise = waitDiceResult(sid)
          
          // Disparo assíncrono
          await (dddiceRef.current as any).rollLocal(diceToRoll, {}, { uuid: 'local-user' })
          
          // AGUARDAMOS o evento físico de conclusão (onde o dado parou na tela)
          const diceResults = await resultPromise
          console.log(`[DICE-DEBUG] Resultados físicos recebidos para SID: ${sid}`, diceResults)

          // Extraímos os valores decididos pelo motor
          rolls = diceResults.filter((d: any) => d.metadata?.isMain).map((d: any) => d.value)
          extraRolls = diceResults.filter((d: any) => d.metadata?.isExtra).map((d: any) => d.value)
        } catch (e) {
          console.warn('[DICE-DEBUG] Erro na sincronização reativa, usando fallback local:', e)
          // Fallback se o motor ou o waiter falhar (ID sumiu do mapa no catch)
          rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides))
          extraRolls = extraDice.flatMap(diceStr => {
            const match = diceStr.match(/^(\d+)d(\d+)$/i)
            if (match) {
              const c = parseInt(match[1])
              const s = parseInt(match[2])
              return Array.from({ length: c }, () => Math.ceil(Math.random() * s))
            }
            return []
          })
        }
      } else {
        // Fallback: Rolagem puramente lógica (bandeja fechada)
        rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides))
        extraRolls = extraDice.flatMap(diceStr => {
          const match = diceStr.match(/^(\d+)d(\d+)$/i)
          if (match) {
            const c = parseInt(match[1])
            const s = parseInt(match[2])
            return Array.from({ length: c }, () => Math.ceil(Math.random() * s))
          }
          return []
        })
      }

      // Cálculos finais (idêntico à lógica anterior, mas com valores garantidos)
      const baseValue = mode === 'highest' ? Math.max(...rolls) : rolls.reduce((a, b) => a + b, 0)
      const extraDiceTotal = extraRolls.reduce((a, b) => a + b, 0)
      total = baseValue + bonus + extraDiceTotal

      const result = { label: diceLabel, total, rolls, extraRolls, bonus }
      setDiceResult(result)
      setDiceHistory((prev) => [{ label: diceLabel, total }, ...prev].slice(0, 8))

      onNewRoll?.({
        id: Date.now(),
        player: playerName,
        action: diceLabel,
        roll: `${count}d${sides}${bonus !== 0 ? (bonus > 0 ? `+${bonus}` : bonus) : ''}${extraDice.length > 0 ? ` +${extraDice.join('+')}` : ''}`,
        result: total,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      })

      setIsRolling(false)
    },
    [waitForDddice, playerName, onNewRoll, isDiceTray]
  )

  // ── rollWeapon ─────────────────────────────────────────────────────────────
  const rollWeapon = useCallback(
    async (
      weapon: { name: string; range: string; damage: string; critical?: string; criticalMultiplier?: string; extraAttackBonus?: number; extraDamageBonus?: number; extraCritBonus?: number; extraDamageDice?: string[] },
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

      const extraAtk = weapon.extraAttackBonus ?? 0
      const extraDmg = weapon.extraDamageBonus ?? 0
      const extraCrit = weapon.extraCritBonus ?? 0

      const baseCritThreshold = parseInt(weapon.critical || '20', 10)
      const critThreshold = Math.max(1, baseCritThreshold - extraCrit)
      const critMultiplier = parseInt((weapon.criticalMultiplier || 'x2').replace(/[^0-9]/g, '') || '2', 10)

      const damageMatch = weapon.damage.match(/^(\d+)d(\d+)$/i)
      const dmgCount = damageMatch ? parseInt(damageMatch[1]) : 1
      const dmgSides = damageMatch ? parseInt(damageMatch[2]) : 6

      let attackRolls: number[] = []
      let damageRolls: number[] = []
      let extraDiceRolls: { dice: string; rolls: number[]; flat: number }[] = []

      // Se a bandeja estiver ativa, usamos o dddice como fonte da verdade
      if (isDiceTray && dddiceRef.current) {
        const sid = `sid_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        try {
          await waitForDddice()
          const themeSlug = diceThemeRef.current || 'dddice-standard'
          
          const diceToRoll: any[] = [
            ...Array.from({ length: attrVal }, () => ({
              type: 'd20',
              theme: themeSlug,
              metadata: { group: 'attack', sid }
            })),
            ...Array.from({ length: dmgCount }, () => ({
              type: `d${dmgSides}`,
              theme: themeSlug,
              metadata: { group: 'damage', sid }
            }))
          ]

          if (weapon.extraDamageDice) {
            weapon.extraDamageDice.forEach((diceStr) => {
              const match = diceStr.match(/^(\d+)d(\d+)(?:\+(\d+))?$/i)
              if (match) {
                const count = parseInt(match[1])
                const sides = parseInt(match[2])
                const flat = match[3] ? parseInt(match[3]) : 0
                for (let i = 0; i < count; i++) {
                  diceToRoll.push({
                    type: `d${sides}`,
                    theme: themeSlug,
                    metadata: { group: 'extraDamage', diceStr, flat, sid }
                  })
                }
              }
            })
          }


          console.log(`[DICE-DEBUG] Disparando rolagem de arma reativa (SID: ${sid})`)
          
          // PROMESSA ANTES DO DISPARO
          const resultPromise = waitDiceResult(sid)
          
          await (dddiceRef.current as any).rollLocal(diceToRoll, {}, { uuid: 'local-user' })
          
          const diceResults = await resultPromise
          console.log(`[DICE-DEBUG] Resultados físicos da arma recebidos para SID: ${sid}`)
          
          attackRolls = diceResults.filter((d: any) => d.metadata?.group === 'attack').map((d: any) => d.value)
          damageRolls = diceResults.filter((d: any) => d.metadata?.group === 'damage').map((d: any) => d.value)
          
          const extraDiceMap = new Map<string, { rolls: number[], flat: number }>()
          diceResults.filter((d: any) => d.metadata?.group === 'extraDamage').forEach((d: any) => {
            const key = d.metadata.diceStr
            if (!extraDiceMap.has(key)) extraDiceMap.set(key, { rolls: [], flat: d.metadata.flat })
            extraDiceMap.get(key)!.rolls.push(d.value)
          })
          extraDiceRolls = Array.from(extraDiceMap.entries()).map(([dice, data]) => ({
            dice,
            rolls: data.rolls,
            flat: data.flat
          }))
        } catch (e) {
          console.warn('[DICE-DEBUG] Erro na sincronização reativa de arma, usando fallback local:', e)
          attackRolls = Array.from({ length: attrVal }, () => Math.ceil(Math.random() * 20))
          damageRolls = Array.from({ length: dmgCount }, () => Math.ceil(Math.random() * dmgSides))
          if (weapon.extraDamageDice) {
            for (const diceStr of weapon.extraDamageDice) {
              const match = diceStr.match(/^(\d+)d(\d+)(?:\+(\d+))?$/i)
              if (match) {
                const count = parseInt(match[1])
                const sides = parseInt(match[2])
                const flat = match[3] ? parseInt(match[3]) : 0
                const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides))
                extraDiceRolls.push({ dice: diceStr, rolls, flat })
              }
            }
          }
        }
      } else {
        // Fallback: Bandeja fechada
        attackRolls = Array.from({ length: attrVal }, () => Math.ceil(Math.random() * 20))
        damageRolls = Array.from({ length: dmgCount }, () => Math.ceil(Math.random() * dmgSides))
        if (weapon.extraDamageDice) {
          for (const diceStr of weapon.extraDamageDice) {
            const match = diceStr.match(/^(\d+)d(\d+)(?:\+(\d+))?$/i)
            if (match) {
              const count = parseInt(match[1])
              const sides = parseInt(match[2])
              const flat = match[3] ? parseInt(match[3]) : 0
              const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides))
              extraDiceRolls.push({ dice: diceStr, rolls, flat })
            }
          }
        }
      }

      const attackBase = Math.max(...attackRolls)
      const attackTotal = attackBase + trainingBonus + extraAtk
      const isCritical = attackRolls.some((r) => r >= critThreshold)

      let extraDiceTotal = 0
      extraDiceRolls.forEach(e => {
        extraDiceTotal += e.rolls.reduce((a, b) => a + b, 0) + e.flat
      })

      const baseDamage = damageRolls.reduce((a, b) => a + b, 0) + extraDmg + extraDiceTotal
      const damageTotal = isCritical ? baseDamage * critMultiplier : baseDamage

      const atkBonusStr = (trainingBonus + extraAtk) > 0 ? `+${trainingBonus + extraAtk}` : ''
      const critInfo = extraCrit > 0 ? ` [crit ${critThreshold}+]` : ''
      const attackLabel = `${skill} (${attrVal}d20${atkBonusStr})${
        extraAtk > 0 ? ` [+${extraAtk} hab.]` : ''
      }${critInfo}`

      const extraDiceLabel = extraDiceRolls.map((e) => `+${e.dice}`).join('')
      const critLabel = isCritical ? ` CRÍTICO ${weapon.criticalMultiplier || 'x2'}!` : ''
      const damageLabel = `${weapon.damage}${extraDmg > 0 ? `+${extraDmg}` : ''}${extraDiceLabel}${critLabel}`

      setWeaponRollResult({
        weapon: weapon.name,
        attack: { total: attackTotal, rolls: attackRolls, label: attackLabel, skill, isCritical, critThreshold },
        damage: {
          total: damageTotal,
          rolls: [...damageRolls, ...extraDiceRolls.flatMap((e) => e.rolls)],
          label: damageLabel,
          isCritical,
          critMultiplier: isCritical ? critMultiplier : undefined,
          baseDamage: isCritical ? baseDamage : undefined,
        },
      })
      setDiceHistory((prev) =>
        [
          { label: `${weapon.name} Ataque${isCritical ? ' 💥' : ''}`, total: attackTotal },
          { label: `${weapon.name} Dano${isCritical ? ` x${critMultiplier}` : ''}`, total: damageTotal },
          ...prev,
        ].slice(0, 8)
      )

      onNewRoll?.({
        id: Date.now() + '-atk',
        player: playerName,
        action: `${weapon.name} (Ataque)`,
        roll: attackLabel,
        result: attackTotal,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isCritical,
      })
      
      onNewRoll?.({
        id: Date.now() + '-dmg',
        player: playerName,
        action: `${weapon.name} (Dano)`,
        roll: damageLabel,
        result: damageTotal,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isCritical,
      })

      setIsRolling(false)
    },
    [waitForDddice, playerName, onNewRoll, isDiceTray]
  )

  // ── rollRitual ─────────────────────────────────────────────────────────────
  const rollRitual = useCallback(
    async (params: {
      name: string
      version: 'base' | 'discente' | 'verdadeiro'
      diceCount: number
      trainingBonus: number
      dt: number
      totalPe: number
      damageDice: string | undefined
      onResult: (r: {
        rolls: number[]
        best: number
        total: number
        damageResult: number | undefined
        damageRolls: number[] | undefined
      }) => void
    }) => {
      const { name, version, diceCount, trainingBonus, dt, totalPe, damageDice, onResult } = params

      setIsRolling(true)
      setDiceResult(null)
      setWeaponRollResult(null)
      setRitualRollResult(null)

      let rollArr: number[] = []
      let damageRolls: number[] = []
      let damageMod = 0

      // Se a bandeja estiver ativa, usamos o dddice como fonte da verdade
      if (isDiceTray && dddiceRef.current) {
        const sid = `sid_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        try {
          await waitForDddice()
          const themeSlug = diceThemeRef.current || 'dddice-standard'
          
          const diceToRoll: any[] = Array.from({ length: Math.max(1, diceCount) }, () => ({
            type: 'd20',
            theme: themeSlug,
            metadata: { group: 'atk', sid }
          }))

          if (damageDice) {
            const m = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i.exec(damageDice)
            if (m) {
              const cnt = Number.parseInt(m[1])
              const sides = Number.parseInt(m[2])
              damageMod = m[3] ? (m[3] === '+' ? Number.parseInt(m[4]) : -Number.parseInt(m[4])) : 0
              for (let i = 0; i < cnt; i++) {
                diceToRoll.push({
                  type: `d${sides}`,
                  theme: themeSlug,
                  metadata: { group: 'dmg', sid }
                })
              }
            }
          }


          console.log(`[DICE-DEBUG] Disparando rolagem de ritual reativa (SID: ${sid})`)
          
          // PROMESSA ANTES DO DISPARO
          const resultPromise = waitDiceResult(sid)
          
          await (dddiceRef.current as any).rollLocal(diceToRoll, {}, { uuid: 'local-user' })
          
          const diceResults = await resultPromise
          console.log(`[DICE-DEBUG] Resultados físicos do ritual recebidos para SID: ${sid}`)
          
          rollArr = diceResults.filter((d: any) => d.metadata?.group === 'atk').map((d: any) => d.value)
          damageRolls = diceResults.filter((d: any) => d.metadata?.group === 'dmg').map((d: any) => d.value)
        } catch (e) {
          console.warn('[DICE-DEBUG] Erro na sincronização reativa de ritual, usando fallback local:', e)
          rollArr = Array.from({ length: Math.max(1, diceCount) }, () => Math.ceil(Math.random() * 20))
          if (damageDice) {
            const m = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i.exec(damageDice)
            if (m) {
              const cnt = Number.parseInt(m[1]); const sides = Number.parseInt(m[2]);
              damageMod = m[3] ? (m[3] === '+' ? Number.parseInt(m[4]) : -Number.parseInt(m[4])) : 0
              damageRolls = Array.from({ length: cnt }, () => Math.ceil(Math.random() * sides))
            }
          }
        }
      } else {
        // Fallback: Bandeja fechada
        rollArr = Array.from({ length: Math.max(1, diceCount) }, () => Math.ceil(Math.random() * 20))
        if (damageDice) {
          const m = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i.exec(damageDice)
          if (m) {
            const cnt = Number.parseInt(m[1])
            const sides = Number.parseInt(m[2])
            damageMod = m[3] ? (m[3] === '+' ? Number.parseInt(m[4]) : -Number.parseInt(m[4])) : 0
            damageRolls = Array.from({ length: cnt }, () => Math.ceil(Math.random() * sides))
          }
        }
      }

      const best = Math.max(...rollArr)
      const total = best + trainingBonus
      const success = total >= dt
      const damageResult = damageRolls.length > 0 ? (damageRolls.reduce((a, b) => a + b, 0) + damageMod) : undefined

      const versionLabel =
        version === 'discente' ? 'Discente' : version === 'verdadeiro' ? 'Verdadeiro' : 'Base'

      setRitualRollResult({
        name,
        version: versionLabel,
        diceCount,
        rolls: rollArr,
        best,
        trainingBonus,
        total,
        dt,
        totalPe,
        success,
        damageDice,
        damageTotal: damageResult,
        damageRolls: damageRolls.length > 0 ? damageRolls : undefined,
      })
      setDiceHistory((prev) => {
        const entries: Array<{ label: string; total: number }> = [
          { label: `${name} (${versionLabel})`, total },
        ]
        if (damageResult !== undefined) entries.push({ label: `${name} Dano`, total: damageResult })
        return [...entries, ...prev].slice(0, 8)
      })

      onNewRoll?.({
        id: Date.now() + '-rit-atk',
        player: playerName,
        action: `${name} (${versionLabel})`,
        roll: `Ocultismo (${diceCount}d20+${trainingBonus})`,
        result: total,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isFail: !success,
      })

      if (damageResult !== undefined) {
        onNewRoll?.({
          id: Date.now() + '-rit-dmg',
          player: playerName,
          action: `${name} (Dano)`,
          roll: damageDice || '',
          result: damageResult,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        })
      }

      setIsRolling(false)

      // Callback with final results
      onResult({ rolls: rollArr, best, total, damageResult, damageRolls: damageRolls.length > 0 ? damageRolls : undefined })
    },
    [waitForDddice, playerName, onNewRoll, isDiceTray]
  )

  // ── Expõe API ao pai ───────────────────────────────────────────────────────
  useImperativeHandle(
    ref,
    () => ({
      rollDice,
      rollWeapon,
      rollRitual,
      openDiceTray: () => setIsDiceTray(true),
    }),
    [rollDice, rollWeapon, rollRitual]
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
          <Switch
            isSelected={isDiceTray}
            onValueChange={(isSelected) => {
              setIsDiceTray(isSelected)
              setDiceResult(null)
              setRitualRollResult(null)
            }}
            size="sm"
            color="warning"
            classNames={{ wrapper: 'bg-zinc-700 group-data-[selected=true]:bg-amber-500' }}
            title={isDiceTray ? 'Voltar para Atributos' : 'Abrir Bandeja de Dados'}
          />
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
                  {' '}
                  +{attrs.filter((v) => v === 0).length} (atributos em 0)
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
            </div>

            {/* Resultado */}
            {(diceResult || weaponRollResult || ritualRollResult || isRolling) && (
              <div className="px-1">
                {isRolling ? (
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                    <m.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      ⟳
                    </m.span>
                    Rolando...
                  </div>
                ) : weaponRollResult ? (
                  /* Resultado de arma: ataque + dano */
                  <m.div
                    key={weaponRollResult.weapon + weaponRollResult.attack.total}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-1"
                  >
                    <div className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider truncate">
                      {weaponRollResult.weapon}
                      {weaponRollResult.attack.isCritical && (
                        <span className="ml-2 text-yellow-400 animate-pulse">💥 CRÍTICO!</span>
                      )}
                    </div>
                    <div className="flex items-stretch gap-3">
                      {/* Ataque */}
                      <div className={`flex-1 rounded-lg px-3 py-2 ${
                        weaponRollResult.attack.isCritical
                          ? 'bg-yellow-950/40 border border-yellow-500/40'
                          : 'bg-zinc-950 border border-zinc-800'
                      }`}>
                        <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
                          Ataque · {weaponRollResult.attack.skill}
                          {weaponRollResult.attack.critThreshold && weaponRollResult.attack.critThreshold < 20 && (
                            <span className="text-yellow-500/60 ml-1">(crit {weaponRollResult.attack.critThreshold}+)</span>
                          )}
                        </div>
                        <div className={`text-3xl font-black leading-none ${
                          weaponRollResult.attack.isCritical ? 'text-yellow-400' : 'text-amber-400'
                        }`}>
                          {weaponRollResult.attack.total}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          {weaponRollResult.attack.label} → ({weaponRollResult.attack.rolls.join(', ')})
                        </div>
                      </div>
                      {/* Dano */}
                      <div className={`flex-1 rounded-lg px-3 py-2 ${
                        weaponRollResult.damage.isCritical
                          ? 'bg-red-950/50 border border-red-500/40'
                          : 'bg-zinc-950 border border-red-900/30'
                      }`}>
                        <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">
                          Dano · {weaponRollResult.damage.label}
                        </div>
                        <div className={`text-3xl font-black leading-none ${
                          weaponRollResult.damage.isCritical ? 'text-red-300' : 'text-red-400'
                        }`}>
                          {weaponRollResult.damage.total}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          [{weaponRollResult.damage.rolls.join(', ')}]
                          {weaponRollResult.damage.isCritical && weaponRollResult.damage.baseDamage && (
                            <span className="text-yellow-500 ml-1">
                              ({weaponRollResult.damage.baseDamage} ×{weaponRollResult.damage.critMultiplier})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </m.div>
                ) : ritualRollResult ? (
                  /* Resultado de ritual — mesmo layout visual de armas */
                  <m.div
                    key={ritualRollResult.name + ritualRollResult.total}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-1"
                  >
                    {/* Header: nome do ritual (igual ao nome da arma) */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider truncate">
                        {ritualRollResult.name}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${ritualRollResult.success ? 'text-emerald-400' : 'text-red-400'}`}
                      >
                        {ritualRollResult.success ? '✓ Sucesso' : '✗ Falhou'}
                      </span>
                    </div>
                    <div className="flex items-stretch gap-3">
                      {/* Ataque · Ocultismo (mesmo estilo que Ataque · Luta/Pontaria) */}
                      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                        <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
                          Ataque · Ocultismo
                        </div>
                        <div
                          className={`text-3xl font-black leading-none ${ritualRollResult.success ? 'text-amber-400' : 'text-red-400'}`}
                        >
                          {ritualRollResult.total}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          Ocultismo ({ritualRollResult.rolls.join(', ')})
                          {ritualRollResult.trainingBonus !== 0 && (
                            <span className="ml-1 text-zinc-500">
                              {ritualRollResult.trainingBonus > 0 ? `+${ritualRollResult.trainingBonus}` : ritualRollResult.trainingBonus}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Dano (se houver e sucesso) — mesmo estilo que Dano de arma */}
                      {ritualRollResult.success && ritualRollResult.damageTotal !== undefined ? (
                        <div className="flex-1 bg-zinc-950 border border-red-900/30 rounded-lg px-3 py-2">
                          <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">
                            Dano · {ritualRollResult.damageDice}
                          </div>
                          <div className="text-3xl font-black text-red-400 leading-none">
                            {ritualRollResult.damageTotal}
                          </div>
                          {ritualRollResult.damageRolls && (
                            <div className="text-[10px] text-zinc-600 mt-0.5">
                              [{ritualRollResult.damageRolls.join(', ')}]
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Sem dano: mostra card de info (DT + PE) */
                        <div className="flex-1 bg-zinc-950 border border-amber-900/30 rounded-lg px-3 py-2">
                          <div className="text-[9px] uppercase font-bold text-amber-900/80 tracking-wider mb-0.5">
                            DT {ritualRollResult.dt} · {ritualRollResult.version}
                          </div>
                          <div className="text-3xl font-black text-amber-400 leading-none">
                            −{ritualRollResult.totalPe} PE
                          </div>
                          <div className="text-[10px] text-zinc-600 mt-0.5">
                            {!ritualRollResult.success &&
                            ritualRollResult.total < ritualRollResult.dt
                              ? `Faltou ${ritualRollResult.dt - ritualRollResult.total} · −${ritualRollResult.totalPe} SAN`
                              : `Custo de PE`}
                          </div>
                        </div>
                      )}
                    </div>
                  </m.div>
                ) : diceResult ? (
                  /* Resultado de perícia simples */
                  <m.div
                    key={diceResult.total + diceResult.label}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-amber-400">{diceResult.total}</span>
                      <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider">
                        {diceResult.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                      {/* Dados d20 base */}
                      <span className="text-zinc-400">({diceResult.rolls.join(', ')})</span>
                      
                      {/* Dados extras (Perito, etc) */}
                      {diceResult.extraRolls && diceResult.extraRolls.length > 0 && (
                        <span className="text-amber-500/80">({diceResult.extraRolls.join(', ')})</span>
                      )}

                      {/* Bônus fixo */}
                      {diceResult.bonus !== undefined && diceResult.bonus !== 0 && (
                        <span className="text-zinc-500">
                          {diceResult.bonus > 0 ? `+${diceResult.bonus}` : diceResult.bonus}
                        </span>
                      )}
                    </div>
                  </m.div>
                ) : null}
              </div>
            )}

            {/* Histórico compacto */}
            <AnimatePresence>
              {diceHistory.length > 0 && (
                <m.div
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
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardBody>
    </Card>
  )
})

export default AttributesDiceTrayCard
