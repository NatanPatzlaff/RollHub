import { useMemo } from 'react'

interface Ritual {
  id: number
  name: string
  element: string | null
  circle: number
  range?: string | null
}

interface RitualCalculationsConfig {
  nex: number
  presence: number
  intellect: number
  hasRitualPredileto: boolean
  ritualPrediletoConfig: string | null
  hasTatuagemRitualistica: boolean
  hasMestreEmElemento: boolean
  mestreElementoConfig: string | null
  hasCamuflarOcultismo: boolean
  usarCamuflar: boolean
  hasRitualPotente: boolean
  itemDtBonus?: number
}

export interface PeInfo {
  base: number
  ajustado: number
  reducoes: string[]
}

export function useRitualCalculations(config: RitualCalculationsConfig) {
  const resistDt = useMemo(() => {
    return 10 + Math.floor(config.nex / 5) + config.presence
  }, [config.nex, config.presence])

  const calcPeAjustado = useMemo(() => {
    return (ritual: Ritual | undefined, extraPe: number = 0): PeInfo => {
      if (!ritual) return { base: 0, ajustado: 0, reducoes: [] }

      const circlePeCost: Record<number, number> = { 1: 1, 2: 3, 3: 6, 4: 10 }
      const base = circlePeCost[ritual.circle] ?? ritual.circle * 2
      let ajustado = base
      const reducoes: string[] = []

      if (config.hasRitualPredileto && config.ritualPrediletoConfig &&
          ritual.name.toLowerCase() === config.ritualPrediletoConfig.toLowerCase()) {
        ajustado -= 1
        reducoes.push('Ritual Predileto –1')
      }
      if (config.hasTatuagemRitualistica && ritual.range?.toLowerCase().includes('pessoal')) {
        ajustado -= 1
        reducoes.push('Tatuagem Ritualística –1')
      }
      if (config.hasMestreEmElemento && config.mestreElementoConfig &&
          ritual.element?.toLowerCase() === config.mestreElementoConfig.toLowerCase()) {
        ajustado -= 1
        reducoes.push('Mestre em Elemento –1')
      }
      if (config.hasCamuflarOcultismo && config.usarCamuflar) {
        ajustado += 2
        reducoes.push('Camuflar Ocultismo +2')
      }

      return { base, ajustado: Math.max(1, ajustado), reducoes }
    }
  }, [config])

  const calcConjurationDt = useMemo(() => {
    return (ritual: Ritual | undefined, extraPe: number = 0): number => {
      if (!ritual) return 20
      const peInfo = calcPeAjustado(ritual, extraPe)
      const totalPe = peInfo.ajustado + extraPe
      return 20 + totalPe + (config.itemDtBonus || 0)
    }
  }, [calcPeAjustado, config.itemDtBonus])

  const calcDamageBonus = useMemo(() => {
    return (baseValue: number): number => {
      if (!config.hasRitualPotente) return 0
      return config.intellect
    }
  }, [config.hasRitualPotente, config.intellect])

  return { resistDt, calcPeAjustado, calcConjurationDt, calcDamageBonus }
}
