import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import { Check } from 'lucide-react'
import BaseModal from './BaseModal'

interface AffinityModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  onConfirm: (affinity: string) => void
}

const ELEMENTS = ['Sangue', 'Morte', 'Conhecimento', 'Energia'] as const

type Element = (typeof ELEMENTS)[number]

const elementStyles: Record<
  Element,
  { text: string; border: string; bg: string; shadow: string; check: string; description: string }
> = {
  Sangue: {
    text: 'text-red-500',
    border: 'border-red-500',
    bg: 'bg-red-500/10',
    shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.08)]',
    check: 'bg-red-500',
    description:
      'Vitalidade, sacrifício e poder vital. Agentes de Sangue manipulam a força que flui em todo ser vivo.',
  },
  Morte: {
    text: 'text-zinc-300',
    border: 'border-zinc-300',
    bg: 'bg-zinc-300/10',
    shadow: 'shadow-[0_0_20px_rgba(212,212,216,0.08)]',
    check: 'bg-zinc-300',
    description:
      'O limiar entre a vida e o além. Agentes de Morte compreendem a transição e o que existe do outro lado.',
  },
  Conhecimento: {
    text: 'text-amber-500',
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
    shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]',
    check: 'bg-amber-500',
    description:
      'Sabedoria proibida e segredos ocultos. Agentes de Conhecimento buscam entender o inexplicável.',
  },
  Energia: {
    text: 'text-purple-500',
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]',
    check: 'bg-purple-500',
    description:
      'Força bruta do outro lado manifestada. Agentes de Energia canalizam o poder puro do paranormal.',
  },
  Medo: {
    text: 'text-white',
    border: 'border-white/60',
    bg: 'bg-white/5',
    shadow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
    check: 'bg-white',
    description:
      'O terror primordial que permeia o outro lado. Agentes de Medo empunham o desespero como arma.',
  },
}

export default function AffinityModal({
  isOpen,
  onClose,
  isLoading = false,
  onConfirm,
}: AffinityModalProps) {
  const [selected, setSelected] = useState<Element | null>(null)

  useEffect(() => {
    if (!isOpen) setSelected(null)
  }, [isOpen])

  const handleConfirm = () => {
    if (selected && !isLoading) {
      onConfirm(selected)
    }
  }

  const style = selected ? elementStyles[selected] : null

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
        disabled={!selected || isLoading}
        className={`rounded-lg px-6 py-2 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 ${
          style ? `${style.bg} border ${style.border} ${style.text} hover:opacity-90` : ''
        }`}
      >
        {isLoading
          ? 'Vinculando...'
          : selected
            ? `Vincular com ${selected}`
            : 'Escolha um elemento'}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      title="Escolher Afinidade"
      description={
        <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">
          NEX 50% — Vínculo permanente com o outro lado
        </span>
      }
      footer={footer}
    >
      <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400/80">
        Atenção: a afinidade é uma escolha permanente e não pode ser alterada depois.
      </div>

      <div className="flex flex-col gap-3">
        {ELEMENTS.map((element) => {
          const s = elementStyles[element]
          const isSelected = selected === element

          return (
            <m.button
              key={element}
              whileHover={{ scale: isSelected ? 1 : 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(element)}
              className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
                isSelected
                  ? `${s.border} ${s.bg} ${s.shadow}`
                  : 'border-zinc-800/80 bg-[#18181b] hover:border-zinc-700 hover:bg-zinc-900/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-base font-bold uppercase tracking-widest ${isSelected ? s.text : 'text-zinc-300 group-hover:text-white'}`}
                >
                  {element}
                </span>

                {isSelected && (
                  <m.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${s.check}`}
                  >
                    <Check size={12} className="text-black font-bold" />
                  </m.span>
                )}
              </div>

              <p
                className={`mt-1 text-xs leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}`}
              >
                {s.description}
              </p>
            </m.button>
          )
        })}
      </div>
    </BaseModal>
  )
}
