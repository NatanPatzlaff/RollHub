import { useState, useRef, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  Crosshair,
  Users,
  Sword,
  ShieldAlert,
  Sparkles,
  Eye,
  Brain,
  Zap,
  Wind,
  Ghost,
  Flame,
  Target,
  Skull,
  Star,
  BookOpen,
  Dumbbell,
  Shield,
  Heart,
  ActivitySquare,
  Check,
} from 'lucide-react'
import BaseModal from './BaseModal'

/** Representação de uma trilha de classe */
interface Trail {
  id: number
  name: string
  description: string | null
  classId: number
  progression?: Array<{
    id: number
    trailId: number
    nex: number
    title: string
    description: string | null
    type: string
  }>
}

/** Props do componente TrailSelectModal */
export interface TrailSelectModalProps {
  isOpen: boolean
  trails: Trail[]
  onClose: () => void
  onConfirm: (trailId: number) => void
}

/** Mapeamento de nome de trilha → ícone lucide-react */
function getTrailIcon(name: string) {
  const n = name.toLowerCase()
  if (n.includes('aniquilador') || n.includes('atirador')) return Crosshair
  if (n.includes('comandante') || n.includes('campo')) return Users
  if (n.includes('guerreiro') || n.includes('combate')) return Sword
  if (n.includes('tropa') || n.includes('choque') || n.includes('tanque')) return ShieldAlert
  if (n.includes('ocultista') || n.includes('ritual')) return Sparkles
  if (n.includes('executor') || n.includes('agente')) return Target
  if (n.includes('investigador') || n.includes('detetive')) return Eye
  if (n.includes('médico') || n.includes('medico')) return Heart
  if (n.includes('hacker') || n.includes('tech') || n.includes('engenheiro')) return Zap
  if (n.includes('furtivo') || n.includes('sombra') || n.includes('infiltrador')) return Ghost
  if (n.includes('psíquico') || n.includes('psiquico') || n.includes('mental')) return Brain
  if (n.includes('fogo') || n.includes('elemento')) return Flame
  if (n.includes('morte') || n.includes('necro')) return Skull
  if (n.includes('proteção') || n.includes('defesa')) return Shield
  if (n.includes('estudioso') || n.includes('acadêmico')) return BookOpen
  if (n.includes('atleta') || n.includes('força')) return Dumbbell
  if (n.includes('vento') || n.includes('ar')) return Wind
  if (n.includes('vitalidade')) return ActivitySquare
  return Star
}

export default function TrailSelectModal({
  isOpen,
  trails,
  onClose,
  onConfirm,
}: TrailSelectModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({})

  // Scroll suave para o card selecionado
  useEffect(() => {
    if (selectedId === null) return
    const timer = setTimeout(() => {
      cardRefs.current[selectedId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 60)
    return () => clearTimeout(timer)
  }, [selectedId])

  // Resetar seleção ao fechar
  useEffect(() => {
    if (!isOpen) setSelectedId(null)
  }, [isOpen])

  const handleConfirm = () => {
    if (selectedId !== null) {
      onConfirm(selectedId)
      onClose()
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
        disabled={selectedId === null}
        className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-bold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        Confirmar Trilha
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title="Escolher Trilha"
      description="Selecione a trilha que seu personagem seguirá"
      footer={footer}
    >
      {trails.length > 0 ? (
        <div className="flex flex-col gap-4">
          {trails.map((trail) => {
            const isSelected = selectedId === trail.id
            const Icon = getTrailIcon(trail.name)
            const progression = trail.progression || []

            return (
              <m.div
                key={trail.id}
                ref={(el) => {
                  cardRefs.current[trail.id] = el
                }}
                layout
                style={{ originY: 0 }}
                whileHover={{ scale: isSelected ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedId(isSelected ? null : trail.id)}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
                    : 'border-zinc-800 bg-[#18181b] hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
              >
                {/* Cabeçalho */}
                <m.div layout="position" className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-zinc-800 text-zinc-400 group-hover:text-amber-500/70'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3
                      className={`text-lg font-bold transition-colors ${
                        isSelected ? 'text-amber-500' : 'text-amber-500/90'
                      }`}
                    >
                      {trail.name}
                    </h3>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <m.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="rounded-full bg-amber-500 p-1 text-black shadow-lg"
                      >
                        <Check size={16} strokeWidth={3} />
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>

                {/* Descrição */}
                {trail.description && (
                  <m.p
                    layout="position"
                    className={`mb-4 text-sm leading-relaxed text-zinc-400 ${isSelected ? '' : 'line-clamp-2'}`}
                  >
                    {trail.description}
                  </m.p>
                )}

                {/* Badges de NEX */}
                {progression.length > 0 && (
                  <m.div layout="position" className="flex flex-wrap gap-2">
                    {progression.map((p) => (
                      <span
                        key={p.id}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20'
                            : 'bg-zinc-800/50 text-zinc-400 ring-1 ring-inset ring-zinc-700/50 group-hover:bg-zinc-800 group-hover:text-zinc-300'
                        }`}
                      >
                        NEX {p.nex}% — {p.title}
                      </span>
                    ))}
                  </m.div>
                )}

                {/* Detalhes expandidos */}
                <AnimatePresence>
                  {isSelected && progression.length > 0 && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 flex flex-col gap-3 border-t border-amber-500/20 pt-4">
                        {progression.map((p) => (
                          <div
                            key={p.id}
                            className="flex flex-col gap-1 rounded-lg bg-black/20 p-3"
                          >
                            <span className="text-xs font-bold text-amber-500">NEX {p.nex}%</span>
                            <h4 className="text-sm font-bold text-zinc-200">{p.title}</h4>
                            {p.description && (
                              <p className="text-xs text-zinc-400">{p.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            )
          })}
        </div>
      ) : (
        <div className="p-6 text-center text-zinc-400">
          <p className="text-sm">Nenhuma trilha disponível para esta classe</p>
        </div>
      )}
    </BaseModal>
  )
}
