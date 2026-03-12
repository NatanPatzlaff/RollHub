import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { usePage } from '@inertiajs/react'
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
  const pageProps = usePage().props as any

  // ── Estado interno da bandeja ──────────────────────────────────────────────
  const [isDiceTray, setIsDiceTray] = useState(false)
  const [isPreparing, setIsPreparing] = useState(false)
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

  // ── Refs para Sincronização SDK-First (Síncrono para Event Listeners) ──────
  const isWaitingForRollRef = useRef<boolean>(false)
  const dddiceUserUuidRef = useRef<string | null>(null)
  const pendingBonusRef = useRef<number>(0)
  const pendingRollTypeRef = useRef<'attribute' | 'weapon' | 'ritual' | null>(null)
  const pendingRollParamsRef = useRef<any>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Refs do dddice ─────────────────────────────────────────────────────────
  const diceCanvasRef = useRef<HTMLCanvasElement>(null)
  const dddiceRef = useRef<any>(null)
  const diceThemeRef = useRef<string | undefined>(undefined)
  const pusherChannelRef = useRef<any>(null)

  // ── Refs espelho para estabilidade do Listener ──────────────────────
  const playerNameRef = useRef(playerName)
  const onNewRollRef = useRef(onNewRoll)
  const pagePropsUserRef = useRef(pageProps.user)

  useEffect(() => { playerNameRef.current = playerName }, [playerName])
  useEffect(() => { onNewRollRef.current = onNewRoll }, [onNewRoll])
  useEffect(() => { pagePropsUserRef.current = pageProps.user }, [pageProps.user])

  // Cache de pré-carregamento (sobrevive a re-renders, compartilhado entre effects)
  const preloadRef = useRef<{
    modulePromise?: Promise<any>
    themePromise?: Promise<{ id: string; data: any } | null>
  }>({})

  // ── Cálculos derivados ─────────────────────────────────────────────────────
  const attrs = [strength, agility, intellect, vigor, presence]
  const zeroBonus = attrs.filter((v) => v === 0).length
  const totalPoints = baseAttrPoints + (isMundano ? 0 : attributeBonusFromNex) + zeroBonus
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
        }, 15000)
      }),
    []
  )

  // ── Helpers de Timeout de Rolagem ───────────────────────────────────────
  const clearRollTimeout = useCallback(() => {
    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current)
      rollTimeoutRef.current = null
    }
  }, [])

  const startRollTimeout = useCallback(() => {
    clearRollTimeout()
    rollTimeoutRef.current = setTimeout(() => {
      setIsRolling(false)
      isWaitingForRollRef.current = false
      rollTimeoutRef.current = null
      console.warn('[RollHub] Timeout: evento dddice não recebido em 20s')
    }, 20000)
  }, [clearRollTimeout])

  // ── Helper: aguarda subscrição do Pusher ──────────────────────────────
  const waitForSubscription = useCallback((channel: any): Promise<void> => {
    return new Promise((resolve) => {
      if (channel?.subscribed) {
        resolve()
        return
      }
      const interval = setInterval(() => {
        if (channel?.subscribed) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
      // Timeout de segurança: resolve após 5s mesmo sem confirmar
      setTimeout(() => {
        clearInterval(interval)
        resolve()
      }, 5000)
    })
  }, [])

  // ── Pré-carregamento: módulo dddice + tema (roda no mount, ANTES do toggle) ──
  useEffect(() => {
    if (!preloadRef.current.modulePromise) {
      preloadRef.current.modulePromise = import('dddice-js')
    }
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

  // ── Listener do Pusher (Extraído para estabilidade) ──────────────────
  const handleRollCreate = useCallback((event: any) => {
    const roll = event.data
    console.log('[USER DEBUG] pageProps.user:', pagePropsUserRef.current)
    console.log('[USER DEBUG] roll.user:', roll?.user)
    console.log('[PUSHER] Evento recebido:', roll?.uuid, 'isWaiting:', isWaitingForRollRef.current)
    
    if (!roll) return
    const isOwnRoll = dddiceUserUuidRef.current
      ? roll.user?.uuid === dddiceUserUuidRef.current
      : true // fallback

    // 1. Rolagem LOCAL que estamos aguardando
    if (isWaitingForRollRef.current && isOwnRoll) {
      isWaitingForRollRef.current = false
      const rollType = pendingRollTypeRef.current
      const rollParams = pendingRollParamsRef.current
      const bonus = pendingBonusRef.current

      if (rollType === 'attribute') {
        const mainDice = roll.values
          .filter((v: any) => v.type === 'd20' && !v.is_dropped)
          .map((v: any) => v.value)
        const extraDice = roll.values
          .filter((v: any) => v.type !== 'd20' && !v.is_dropped)
          .map((v: any) => v.value)
        const isHighest = rollParams?.mode === 'highest'
        const baseValue = isHighest ? Math.max(...mainDice) : mainDice.reduce((acc: number, v: number) => acc + v, 0)
        const extraValue = extraDice.reduce((acc: number, v: number) => acc + v, 0)
        const total = baseValue + bonus + extraValue

        setDiceResult({
          label: rollParams?.label || 'Atributo',
          total,
          rolls: mainDice,
          extraRolls: extraDice,
          bonus,
        })
        setDiceHistory((prev) => [{ label: rollParams?.label || 'Atributo', total }, ...prev].slice(0, 8))
        onNewRollRef.current?.({
          id: roll.uuid,
          player: playerNameRef.current,
          action: rollParams?.label || 'Atributo',
          roll: roll.equation + (bonus !== 0 ? (bonus > 0 ? `+${bonus}` : bonus) : ''),
          result: total,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        })
      } else if (rollType === 'weapon') {
        const weapon = rollParams?.weapon
        const atkDice = roll.values
          .filter((v: any) => v.type === 'd20' && !v.is_dropped)
          .map((v: any) => v.value)
        const dmgDice = roll.values
          .filter((v: any) => v.type !== 'd20' && !v.is_dropped)
          .map((v: any) => v.value)
        const atkBonus = rollParams?.atkBonus || 0
        const dmgBonus = rollParams?.dmgBonus || 0
        const atkTotal = Math.max(...atkDice) + atkBonus
        const baseDmgTotal = dmgDice.reduce((acc: number, val: number) => acc + val, 0) + dmgBonus
        const isCritical = atkDice.some((val: number) => val >= (rollParams?.critThreshold || 20))
        const finalDmg = isCritical ? baseDmgTotal * (rollParams?.critMultiplier || 2) : baseDmgTotal

        setWeaponRollResult({
          weapon: weapon.name,
          attack: {
            total: atkTotal,
            rolls: atkDice,
            label: rollParams?.atkLabel,
            skill: rollParams?.skill,
            isCritical,
            critThreshold: rollParams?.critThreshold,
          },
          damage: {
            total: finalDmg,
            rolls: dmgDice,
            label: rollParams?.dmgLabel,
            isCritical,
            critMultiplier: isCritical ? rollParams?.critMultiplier : undefined,
            baseDamage: isCritical ? baseDmgTotal : undefined,
          },
        })
        setDiceHistory((prev) => [
          { label: `${weapon.name} Ataque`, total: atkTotal },
          { label: `${weapon.name} Dano`, total: finalDmg },
          ...prev,
        ].slice(0, 8))
        onNewRollRef.current?.({
          id: roll.uuid + '-atk',
          player: playerNameRef.current,
          action: `${weapon.name} (Ataque)`,
          roll: rollParams?.atkLabel,
          result: atkTotal,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isCritical,
        })
        onNewRollRef.current?.({
          id: roll.uuid + '-dmg',
          player: playerNameRef.current,
          action: `${weapon.name} (Dano)`,
          roll: rollParams?.dmgLabel,
          result: finalDmg,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isCritical,
        })
      } else if (rollType === 'ritual') {
        const ritualName = rollParams?.name
        const atkDice = roll.values
          .filter((v: any) => v.type === 'd20' && !v.is_dropped)
          .map((v: any) => v.value)
        const dmgDice = roll.values
          .filter((v: any) => v.type !== 'd20' && !v.is_dropped)
          .map((v: any) => v.value)
        const bestAtk = Math.max(...atkDice)
        const totalAtk = bestAtk + (rollParams?.trainingBonus || 0)
        const success = totalAtk >= (rollParams?.dt || 0)
        const dmgTotal = dmgDice.length > 0
          ? dmgDice.reduce((acc: number, val: number) => acc + val, 0) + (rollParams?.dmgMod || 0)
          : undefined

        setRitualRollResult({
          ...rollParams,
          rolls: atkDice,
          best: bestAtk,
          total: totalAtk,
          success,
          damageTotal: dmgTotal,
          damageRolls: dmgDice.length > 0 ? dmgDice : undefined,
        })
        setDiceHistory((prev) => {
          const entries = [{ label: `${ritualName}`, total: totalAtk }]
          if (dmgTotal !== undefined) entries.push({ label: `${ritualName} Dano`, total: dmgTotal })
          return [...entries, ...prev].slice(0, 8)
        })
        onNewRollRef.current?.({
          id: roll.uuid + '-rit-atk',
          player: playerNameRef.current,
          action: `${ritualName}`,
          roll: `Ocultismo (${atkDice.length}d20+${rollParams?.trainingBonus})`,
          result: totalAtk,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isFail: !success,
        })
        if (dmgTotal !== undefined) {
          onNewRollRef.current?.({
            id: roll.uuid + '-rit-dmg',
            player: playerNameRef.current,
            action: `${ritualName} (Dano)`,
            roll: rollParams?.damageDice || '',
            result: dmgTotal,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          })
        }
        rollParams?.onResult?.({
          rolls: atkDice,
          best: bestAtk,
          total: totalAtk,
          damageResult: dmgTotal,
          damageRolls: dmgDice.length > 0 ? dmgDice : undefined,
        })
      }

      setIsRolling(false)
      clearRollTimeout()
      return
    }

    // 2. Rolagem de OUTROS jogadores
    if (!isOwnRoll && onNewRollRef.current) {
      onNewRollRef.current({
        id: roll.uuid,
        player: roll.user?.username || roll.user?.name || 'Outro Jogador',
        action: 'Rolagem dddice',
        roll: roll.equation,
        result: Number(roll.total_value),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      })
    }
  }, [clearRollTimeout])

  // ── Registro Independente do Listener Pusher ────────────────────────
  useEffect(() => {
    if (!isConnected || !dddiceRef.current) return
    const channel = (dddiceRef.current.api as any)?.roomConnection?.subscription
    if (!channel) return

    console.log('[PUSHER] Ativando listener RollCreateEvent')
    pusherChannelRef.current = channel
    channel.bind('App\\Events\\RollCreateEvent', handleRollCreate)

    return () => {
      console.log('[PUSHER] Desativando listener RollCreateEvent')
      try { channel.unbind('App\\Events\\RollCreateEvent', handleRollCreate) } catch (_) {}
      pusherChannelRef.current = null
    }
  }, [isConnected, handleRollCreate])

  // ── Inicialização dddice (quando bandeja abre, usa cache do preload) ───────
  useEffect(() => {
    if (!isDiceTray) return
    let mounted = true

    const init = async (canvas: HTMLCanvasElement) => {
      const mod = preloadRef.current.modulePromise || import('dddice-js')
      const { ThreeDDice } = await mod
      if (!mounted) return

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

      if (dddiceRoomSlug && dddiceApiKey) {
        try {
          instance.connect(dddiceRoomSlug)
          const channel = (instance.api as any)?.roomConnection?.subscription
          await waitForSubscription(channel)
          console.log('[PUSHER] channel subscribed:', channel?.subscribed)

          // Busca o UUID real do usuário logado no dddice usando a API Key
          fetch('https://dddice.com/api/1.0/user', {
            headers: { Authorization: `Bearer ${dddiceApiKey}` },
          })
            .then((res) => res.json())
            .then((userData) => {
              if (userData?.data?.uuid) {
                dddiceUserUuidRef.current = userData.data.uuid
                console.log('[DICE-DEBUG] dddice user uuid:', dddiceUserUuidRef.current)
              }
            })
            .catch((err) => {
              console.warn('[DICE-DEBUG] Erro ao buscar UUID do dddice:', err)
              dddiceUserUuidRef.current = null
            })
        } catch (e) {
          // Conexão silenciosa
        }
      }

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

      if (mounted) {
        dddiceRef.current = instance
        ;(window as any).__dddice = instance
        setIsConnected(true)
        notifyDddiceReady()
      }
    }

    if (diceCanvasRef.current) {
      init(diceCanvasRef.current).catch(console.error)
    } else {
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
      setIsConnected(false)
      clearRollTimeout()
    }
  }, [isDiceTray, dddiceApiKey, dddiceRoomSlug, notifyDddiceReady, clearRollTimeout])


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
      if (!dddiceRoomSlug) {
        console.warn('[DICE] abortou: sem roomSlug')
        return
      }

      console.log('[DICE] iniciando, isDiceTray:', isDiceTray)
      setIsPreparing(true)
      await waitForDddice()
      setIsPreparing(false)
      console.log('[DICE] waitForDddice concluído, dddiceRef:', !!dddiceRef.current)

      if (!dddiceRef.current) {
        console.warn('[DICE] abortou: ref null após wait')
        return
      }

      console.log('[DICE] chegou no setIsRolling')
      const diceLabel = label || `${count}d${sides}${bonus !== 0 ? (bonus > 0 ? `+${bonus}` : bonus) : ''}`

      setIsRolling(true)
      setDiceResult(null)
      setWeaponRollResult(null)
      setRitualRollResult(null)

      try {
        const themeSlug = diceThemeRef.current || 'dddice-standard'

          const diceToRoll = [
            ...Array.from({ length: count }, () => ({
              type: `d${sides}`,
              theme: themeSlug,
              metadata: { group: 'main' },
            })),
            ...extraDice.flatMap((diceStr) => {
              const match = diceStr.match(/^(\d+)d(\d+)$/i)
              if (match) {
                const c = parseInt(match[1])
                const s = parseInt(match[2])
                return Array.from({ length: c }, () => ({
                  type: `d${s}`,
                  theme: themeSlug,
                  metadata: { group: 'extra' },
                }))
              }
              return []
            }),
          ]

          isWaitingForRollRef.current = true
          startRollTimeout()
          pendingBonusRef.current = bonus
          pendingRollTypeRef.current = 'attribute'
          pendingRollParamsRef.current = { label: diceLabel, mode }

        console.log('[DICE] chamando dddice.roll()')
        await dddiceRef.current.roll(diceToRoll, undefined, { room: dddiceRoomSlug })
      } catch (e) {
        console.error(`[DICE-ERROR] Erro ao iniciar rolagem dddice:`, e)
        setIsRolling(false)
      }
    },
    [waitForDddice, isDiceTray, dddiceRoomSlug, isConnected]
  )

  // ── rollWeapon ─────────────────────────────────────────────────────────────
  const rollWeapon = useCallback(
    async (
      weapon: { name: string; range: string; damage: string; critical?: string; criticalMultiplier?: string; extraAttackBonus?: number; extraDamageBonus?: number; extraCritBonus?: number; extraDamageDice?: string[] },
      str: number,
      agi: number,
      characterSkills: any[] = []
    ) => {
      if (!dddiceRoomSlug) return

      setIsPreparing(true)
      await waitForDddice()
      setIsPreparing(false)

      if (!dddiceRef.current) return

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

      try {
        const themeSlug = diceThemeRef.current || 'dddice-standard'

          const diceToRoll: any[] = [
            ...Array.from({ length: attrVal }, () => ({
              type: 'd20', theme: themeSlug, metadata: { group: 'attack' },
            })),
            ...Array.from({ length: dmgCount }, () => ({
              type: `d${dmgSides}`, theme: themeSlug, metadata: { group: 'damage' },
            })),
          ]

          weapon.extraDamageDice?.forEach((diceStr) => {
            const match = diceStr.match(/^(\d+)d(\d+)/i)
            if (match) {
              const c = parseInt(match[1])
              const s = parseInt(match[2])
              for (let i = 0; i < c; i++) {
                diceToRoll.push({ type: `d${s}`, theme: themeSlug, metadata: { group: 'damage' } })
              }
            }
          })

          const atkBonusStr = (trainingBonus + extraAtk) > 0 ? `+${trainingBonus + extraAtk}` : ''
          const atkLabel = `${skill} (${attrVal}d20${atkBonusStr})`
          const dmgLabel = `${weapon.damage}${extraDmg > 0 ? `+${extraDmg}` : ''}`

          isWaitingForRollRef.current = true
          startRollTimeout()
          pendingRollTypeRef.current = 'weapon'
          pendingRollParamsRef.current = {
            weapon,
            atkBonus: trainingBonus + extraAtk,
            dmgBonus: extraDmg,
            critThreshold,
            critMultiplier,
            atkLabel,
            dmgLabel,
            skill,
          }

        await dddiceRef.current.roll(diceToRoll, undefined, { room: dddiceRoomSlug })
      } catch (e) {
        console.error(`[DICE-ERROR] Erro dddice arma:`, e)
        setIsRolling(false)
      }
    },
    [waitForDddice, playerName, onNewRoll, isDiceTray, dddiceRoomSlug, isConnected]
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
      if (!dddiceRoomSlug) return

      setIsPreparing(true)
      await waitForDddice()
      setIsPreparing(false)

      if (!dddiceRef.current) return

      setIsRolling(true)
      setDiceResult(null)
      setWeaponRollResult(null)
      setRitualRollResult(null)

      const { diceCount, damageDice } = params

      try {
        const themeSlug = diceThemeRef.current || 'dddice-standard'

          const diceToRoll: any[] = [
            ...Array.from({ length: Math.max(1, diceCount) }, () => ({
              type: 'd20', theme: themeSlug, metadata: { group: 'atk' },
            })),
          ]

          let dmgMod = 0
          if (damageDice) {
            const m = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i.exec(damageDice)
            if (m) {
              const cnt = Number.parseInt(m[1])
              const sides = Number.parseInt(m[2])
              dmgMod = m[3] ? (m[3] === '+' ? Number.parseInt(m[4]) : -Number.parseInt(m[4])) : 0
              for (let i = 0; i < cnt; i++) {
                diceToRoll.push({ type: `d${sides}`, theme: themeSlug, metadata: { group: 'dmg' } })
              }
            }
          }

          isWaitingForRollRef.current = true
          startRollTimeout()
          pendingRollTypeRef.current = 'ritual'
          pendingRollParamsRef.current = { ...params, dmgMod }

        await dddiceRef.current.roll(diceToRoll, undefined, { room: dddiceRoomSlug })
      } catch (e) {
        console.error(`[DICE-ERROR] Erro dddice ritual:`, e)
        setIsRolling(false)
      }
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
          <>
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

            <div className="flex items-center justify-between">
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
                {!isConnected && isDiceTray && (
                  <div className="text-[10px] text-red-500/80 animate-pulse font-bold flex items-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Sala dddice offline
                  </div>
                )}
                {isConnected && isDiceTray && (
                  <div className="text-[10px] text-emerald-500/80 font-bold flex items-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Conectado ao dddice
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div
              className="relative rounded-xl overflow-hidden bg-black"
              style={{ height: '300px' }}
            >
              <canvas ref={diceCanvasRef} className="absolute inset-0 w-full h-full" />
            </div>

            {(diceResult || weaponRollResult || ritualRollResult || isRolling || isPreparing) && (
              <div className="px-1">
                {isPreparing ? (
                  <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold animate-pulse">
                    <m.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      ⟳
                    </m.span>
                    Abrindo bandeja...
                  </div>
                ) : isRolling ? (
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
                  <m.div
                    key={ritualRollResult.name + ritualRollResult.total}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-1"
                  >
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
                      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2">
                        <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
                          Ataque · Ocultismo
                        </div>
                        <div className={`text-3xl font-black leading-none ${ritualRollResult.success ? 'text-amber-400' : 'text-red-400'}`}>
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
                        <div className="flex-1 bg-zinc-950 border border-amber-900/30 rounded-lg px-3 py-2">
                          <div className="text-[9px] uppercase font-bold text-amber-900/80 tracking-wider mb-0.5">
                            DT {ritualRollResult.dt} · {ritualRollResult.version}
                          </div>
                          <div className="text-3xl font-black text-amber-400 leading-none">
                            −{ritualRollResult.totalPe} PE
                          </div>
                          <div className="text-[10px] text-zinc-600 mt-0.5">
                            {!ritualRollResult.success && ritualRollResult.total < ritualRollResult.dt
                              ? `Faltou ${ritualRollResult.dt - ritualRollResult.total} · −${ritualRollResult.totalPe} SAN`
                              : `Custo de PE`}
                          </div>
                        </div>
                      )}
                    </div>
                  </m.div>
                ) : diceResult ? (
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
                      <span className="text-zinc-400">({diceResult.rolls.join(', ')})</span>
                      {diceResult.extraRolls && diceResult.extraRolls.length > 0 && (
                        <span className="text-amber-500/80">({diceResult.extraRolls.join(', ')})</span>
                      )}
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