import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import BaseModal from './BaseModal'

export interface CatalogParanormalPower {
  id: number
  name: string
  description: string | null
  element: string | null
  peCost: number | null
  requirements: string | null
  effects: any
  category: number
}

export interface ParanormalPowerModalProps {
  isOpen: boolean
  onClose: () => void
  powers: CatalogParanormalPower[]
  acquiredPowerIds?: number[]
  isLoading?: boolean
  onConfirm: (powerId: number) => void
}

const elementStyles: Record<
  string,
  { text: string; border: string; bg: string; shadow: string; check: string }
> = {
  Sangue: {
    text: 'text-red-500',
    border: 'border-red-500',
    bg: 'bg-red-500/10',
    shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.05)]',
    check: 'bg-red-500',
  },
  Morte: {
    text: 'text-zinc-300',
    border: 'border-zinc-300',
    bg: 'bg-zinc-300/10',
    shadow: 'shadow-[0_0_20px_rgba(212,212,216,0.05)]',
    check: 'bg-zinc-300',
  },
  Conhecimento: {
    text: 'text-amber-500',
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.05)]',
    check: 'bg-amber-500',
  },
  Energia: {
    text: 'text-purple-500',
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.05)]',
    check: 'bg-purple-500',
  },
  Medo: {
    text: 'text-white',
    border: 'border-white',
    bg: 'bg-white/10',
    shadow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
    check: 'bg-white',
  },
  Varia: {
    text: 'text-zinc-400',
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.05)]',
    check: 'bg-amber-500',
  },
}

const defaultStyle = {
  text: 'text-zinc-400',
  border: 'border-zinc-700',
  bg: 'bg-zinc-800/30',
  shadow: '',
  check: 'bg-amber-500',
}

function getStyle(element: string | null) {
  if (!element) return defaultStyle
  return elementStyles[element] ?? defaultStyle
}

export default function ParanormalPowerModal({
  isOpen,
  onClose,
  powers,
  acquiredPowerIds = [],
  isLoading = false,
  onConfirm,
}: ParanormalPowerModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Scroll suave para o card selecionado
  useEffect(() => {
    if (selectedId === null) return
    const timer = setTimeout(() => {
      document
        .getElementById(`ppower-card-${selectedId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
    return () => clearTimeout(timer)
  }, [selectedId])

  // Resetar seleção ao fechar
  useEffect(() => {
    if (!isOpen) setSelectedId(null)
  }, [isOpen])

  const handleConfirm = () => {
    if (selectedId !== null && !isLoading) {
      onConfirm(selectedId)
    }
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
      >
        Cancelar
      </button>
      <button
        onClick={handleConfirm}
        disabled={selectedId === null || isLoading}
        className="rounded-lg bg-amber-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-amber-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {isLoading ? 'Aprendendo...' : 'Aprender Poder'}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      title="Escolher Poder Paranormal"
      description={
        <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">
          Vínculo com o outro lado
        </span>
      }
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {powers.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">Nenhum poder encontrado</p>
        ) : (
          powers.map((power) => {
            const isAcquired = acquiredPowerIds.includes(power.id)
            const isSelected = selectedId === power.id
            const disabled = isAcquired || isLoading
            const style = getStyle(power.element)

            return (
              <m.div
                id={`ppower-card-${power.id}`}
                layout
                style={{ originY: 0 }}
                key={power.id}
                whileHover={{ scale: disabled || isSelected ? 1 : 1.01 }}
                whileTap={{ scale: disabled ? 1 : 0.99 }}
                onClick={() => !disabled && setSelectedId(power.id)}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                  disabled
                    ? 'cursor-not-allowed opacity-50 border-zinc-800 bg-zinc-900/50'
                    : isSelected
                      ? `${style.border} ${style.bg} ${style.shadow}`
                      : 'border-zinc-800/80 bg-[#18181b] hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
              >
                {/* Header */}
                <m.div layout="position" className="flex items-start justify-between pr-8">
                  <div className="flex flex-col gap-1">
                    <h3
                      className={`text-xl font-bold transition-colors ${
                        isSelected ? 'text-white' : 'text-zinc-100 group-hover:text-white'
                      }`}
                    >
                      {power.name}
                    </h3>
                    {power.element && (
                      <span className={`text-sm font-black tracking-wider uppercase ${style.text}`}>
                        {power.element}
                      </span>
                    )}
                    {isAcquired && (
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                        Adquirido
                      </span>
                    )}
                  </div>
                </m.div>

                {/* Requisito */}
                {power.requirements && (
                  <m.div layout="position" className="mt-2 mb-3">
                    <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                      Requisito: {power.requirements}
                    </span>
                  </m.div>
                )}

                {/* Descrição */}
                {power.description && (
                  <m.p
                    layout="position"
                    className={`text-[15px] italic leading-relaxed transition-colors ${
                      isSelected ? 'text-zinc-300' : 'text-zinc-400'
                    }`}
                  >
                    {power.description}
                  </m.p>
                )}

                {/* Check animado ao selecionar */}
                <AnimatePresence>
                  {isSelected && (
                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute right-5 top-5 rounded-full p-1 text-[#141417] shadow-lg ${style.check}`}
                    >
                      <Check size={16} strokeWidth={3} />
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            )
          })
        )}
      </div>
    </BaseModal>
  )
}
