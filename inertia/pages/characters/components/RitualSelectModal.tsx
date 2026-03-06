import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Filter, Sparkles, CircleDot, Check } from 'lucide-react'
import BaseModal from './BaseModal'
import { canUseRitualUpgrade } from '../../../utils/ritualReqs'

/** Representação de um ritual do catálogo */
export interface CatalogRitual {
  id: number
  name: string
  circle: number
  element: string
  execution: string
  range: string
  duration: string
  description: string | null
  discente: string | null
  verdadeiro: string | null
  resistance?: string | null
}

/** Props do RitualSelectModal */
export interface RitualSelectModalProps {
  isOpen: boolean
  onClose: () => void
  /** Lista de rituais do catálogo (já filtrados externamente ou completos) */
  rituals: CatalogRitual[]
  /** IDs dos rituais já aprendidos pelo personagem */
  acquiredRitualIds?: number[]
  /** Círculo máximo permitido para o personagem */
  circuloMaximo: number
  /** Créditos disponíveis */
  creditosRestantes: number
  /** Total de créditos ganhos */
  creditosGanhos: number
  /** Indica se uma requisição está em andamento */
  /** Afinidade do personagem (elemento em caixa alta ou null) */
  characterAffinity?: string | null
  isLoading?: boolean
  /** Chamada ao confirmar a seleção de um ritual */
  onConfirm: (ritualId: number) => void
}

/** Mapeamento de elemento → cor de texto */
const elementColors: Record<string, string> = {
  CONHECIMENTO: 'text-amber-500',
  ENERGIA: 'text-purple-500',
  MORTE: 'text-zinc-300',
  SANGUE: 'text-red-500',
  MEDO: 'text-white',
}

/**
 * Modal animado para seleção e aprendizado de rituais.
 * Expande o card selecionado com descrição completa e botão de confirmação no rodapé.
 */
export default function RitualSelectModal({
  isOpen,
  onClose,
  rituals,
  acquiredRitualIds = [],
  circuloMaximo,
  creditosRestantes,
  creditosGanhos,
  isLoading = false,
  characterAffinity,
  onConfirm,
}: RitualSelectModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [elementFilter, setElementFilter] = useState('Todos')
  const [circleFilter, setCircleFilter] = useState('Todos')

  // Rola suavemente até o card selecionado
  useEffect(() => {
    if (selectedId === null) return
    const timer = setTimeout(() => {
      const container = document.getElementById('ritual-modal-scroll')
      const card = document.getElementById(`ritual-card-${selectedId}`)
      if (container && card) {
        container.scrollTo({ top: card.offsetTop - 24, behavior: 'smooth' })
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [selectedId])

  // Limpa seleção ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null)
      setSearch('')
      setElementFilter('Todos')
      setCircleFilter('Todos')
    }
  }, [isOpen])

  const filtered = rituals.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchesElement =
      elementFilter === 'Todos' || r.element.toUpperCase().includes(elementFilter.toUpperCase())
    const matchesCircle = circleFilter === 'Todos' || r.circle.toString() === circleFilter
    return matchesSearch && matchesElement && matchesCircle
  })

  const handleConfirm = () => {
    if (selectedId !== null && !isLoading) {
      onConfirm(selectedId)
    }
  }

  /** Rodapé com botões Cancelar / Aprender Ritual */
  const footer = (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        disabled={isLoading}
        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        onClick={handleConfirm}
        disabled={selectedId === null || isLoading}
        className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-bold text-black transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {isLoading ? 'Aprendendo…' : 'Aprender Ritual'}
      </button>
    </div>
  )

  /** Cabeçalho com créditos e círculo máximo */
  const titleNode = (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-xl font-bold text-white">Aprender Ritual</h2>
      <p className="text-sm text-zinc-400">Desvende os segredos do ocultismo</p>
      <div className="flex items-center gap-3 mt-1">
        <div className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-400">
          <Sparkles size={16} />
          <span>
            Créditos: <strong className="text-indigo-300">{creditosRestantes}</strong> /{' '}
            {creditosGanhos}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400">
          <CircleDot size={16} />
          <span>
            Círculo máx: <strong className="text-red-300">{circuloMaximo}º</strong>
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={titleNode}
      footer={footer}
      maxWidth="max-w-2xl"
      height="h-[90vh]"
      bodyClassName="!p-0"
    >
      {/* Área de busca e filtros — fixa no topo da área de scroll */}
      <div className="sticky top-0 z-20 bg-zinc-900 px-4 pt-4 pb-2">
        <div className="flex flex-col gap-3">
          {/* Campo de busca */}
          <div className="flex items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 border border-zinc-800 focus-within:border-amber-500/50 transition-colors">
            <Filter size={18} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Buscar ritual pelo nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Filtros de elemento e círculo */}
          <div className="flex gap-2">
            <select
              value={elementFilter}
              onChange={(e) => setElementFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="Todos">Todos Elementos</option>
              <option value="CONHECIMENTO">Conhecimento</option>
              <option value="ENERGIA">Energia</option>
              <option value="MORTE">Morte</option>
              <option value="SANGUE">Sangue</option>
              <option value="MEDO">Medo</option>
            </select>
            <select
              value={circleFilter}
              onChange={(e) => setCircleFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="Todos">Todos Círculos</option>
              <option value="1">1º Círculo</option>
              <option value="2">2º Círculo</option>
              <option value="3">3º Círculo</option>
              <option value="4">4º Círculo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de rituais */}
      <div id="ritual-modal-scroll" className="flex flex-col gap-4 px-4 pt-2 pb-4">
        {filtered.length > 0 ? (
          filtered.map((ritual) => {
            const isAcquired = acquiredRitualIds.includes(ritual.id)
            const isBlocked = ritual.circle > circuloMaximo
            const isSelected = selectedId === ritual.id
            const isDisabled = isAcquired || isBlocked

            const elementColor = elementColors[ritual.element?.toUpperCase()] ?? 'text-zinc-400'

            return (
              <m.div
                id={`ritual-card-${ritual.id}`}
                key={ritual.id}
                layout
                style={{ originY: 0 }}
                whileHover={{ scale: isSelected || isDisabled ? 1 : 1.01 }}
                whileTap={{ scale: isDisabled ? 1 : 0.99 }}
                onClick={() => !isDisabled && setSelectedId(isSelected ? null : ritual.id)}
                className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-40 grayscale border-zinc-800 bg-zinc-900'
                    : isSelected
                      ? 'cursor-pointer border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
                      : 'cursor-pointer border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
              >
                {/* Nome + círculo + badges de estado */}
                <m.div
                  layout="position"
                  className="mb-1 flex items-center gap-3 pr-8 flex-wrap"
                >
                  <h3
                    className={`text-xl font-bold transition-colors ${isSelected ? 'text-white' : 'text-zinc-100'}`}
                  >
                    {ritual.name}
                  </h3>
                  <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                    {ritual.circle}º Círculo
                  </span>
                  {isAcquired && (
                    <span className="rounded-full bg-green-900/60 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-700/30">
                      Aprendido
                    </span>
                  )}
                  {isBlocked && !isAcquired && (
                    <span className="rounded-full bg-red-950/60 px-2.5 py-0.5 text-xs font-medium text-red-400 border border-red-900/30">
                      🔒 NEX insuficiente
                    </span>
                  )}
                </m.div>

                {/* Elemento */}
                <m.div
                  layout="position"
                  className={`mb-3 text-sm font-bold tracking-wider ${elementColor}`}
                >
                  {ritual.element}
                </m.div>

                {/* Stats: execução, alcance, duração */}
                <m.div
                  layout="position"
                  className="mb-4 grid grid-cols-2 gap-y-2 text-xs text-zinc-400"
                >
                  <div>
                    <span className="font-bold text-zinc-500 uppercase tracking-wider mr-1">
                      Execução:
                    </span>
                    {ritual.execution}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-500 uppercase tracking-wider mr-1">
                      Alcance:
                    </span>
                    {ritual.range}
                  </div>
                  <div className={ritual.resistance ? '' : 'col-span-2'}>
                    <span className="font-bold text-zinc-500 uppercase tracking-wider mr-1">
                      Duração:
                    </span>
                    {ritual.duration}
                  </div>
                  {ritual.resistance && (
                    <div>
                      <span className="font-bold text-zinc-500 uppercase tracking-wider mr-1">
                        Resistência:
                      </span>
                      {ritual.resistance}
                    </div>
                  )}
                </m.div>

                {/* Descrição completa — expandida ao selecionar */}
                <AnimatePresence>
                  {isSelected && ritual.description && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                        {ritual.description}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Upgrades Discente / Verdadeiro */}
                {(ritual.discente || ritual.verdadeiro) && (
                  <m.div
                    layout="position"
                    className="flex flex-col gap-1.5 border-t border-zinc-800/50 pt-3"
                  >
                    {ritual.discente && canUseRitualUpgrade(ritual.discente, ritual.element ?? '', circuloMaximo, characterAffinity) && (
                      <p
                        className={`text-sm text-zinc-400 leading-relaxed ${isSelected ? '' : 'line-clamp-1'}`}
                      >
                        <span className="font-bold text-blue-400 mr-1">DISCENTE:</span>
                        {ritual.discente}
                      </p>
                    )}
                    {ritual.verdadeiro && canUseRitualUpgrade(ritual.verdadeiro, ritual.element ?? '', circuloMaximo, characterAffinity) && (
                      <p
                        className={`text-sm text-zinc-400 leading-relaxed ${isSelected ? '' : 'line-clamp-1'}`}
                      >
                        <span className="font-bold text-purple-400 mr-1">VERDADEIRO:</span>
                        {ritual.verdadeiro}
                      </p>
                    )}
                  </m.div>
                )}

                {/* Check animado ao selecionar */}
                <AnimatePresence>
                  {isSelected && (
                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-4 rounded-full bg-amber-500 p-1 text-black shadow-lg"
                    >
                      <Check size={16} strokeWidth={3} />
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            )
          })
        ) : (
          /* Estado vazio */
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-12 text-center">
            <p className="text-zinc-500">Nenhum ritual encontrado com esses filtros.</p>
            <button
              onClick={() => {
                setSearch('')
                setElementFilter('Todos')
                setCircleFilter('Todos')
              }}
              className="text-xs font-bold uppercase text-amber-500 hover:text-amber-400"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
