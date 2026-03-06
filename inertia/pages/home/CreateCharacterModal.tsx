import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { router } from '@inertiajs/react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { getOriginIcon } from '../../utils/originIcons'
import { getClassStyle } from '../../utils/classStyles'

// ── tipos ──────────────────────────────────────────────────────────────────
interface Origin {
  id: number
  name: string
  description: string
  trainedSkills: string[] | string | null
  abilityName: string | null
  abilityDescription: string | null
}

interface RpgClass {
  id: number
  name: string
  description?: string
}

interface Props {
  classes: RpgClass[]
  origins: Origin[]
  onClose: () => void
  /** Modo de edição — quando presente, faz PUT ao invés de POST */
  editData?: {
    characterId: number
    initialNex: number
    initialClassId: number | null
    initialOriginId: number | null
    initialName: string
    /** Step inicial (1-4) — permite abrir direto no passo desejado */
    initialStep?: number
  }
}

// ── helpers ─────────────────────────────────────────────────────────────────
// NEX 0 = Mundano obrigatório; 5-99 = classes normais
const NEX_VALUES = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99,
]

function parseSkills(skills: string[] | string | null): string {
  if (!skills) return ''
  if (typeof skills === 'string') {
    try {
      return JSON.parse(skills).join(', ')
    } catch {
      return skills
    }
  }
  return skills.join(', ')
}

// ── animação ────────────────────────────────────────────────────────────────
const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 40 : -40, opacity: 0 }),
}

// ── componente ───────────────────────────────────────────────────────────────
export default function CreateCharacterModal({ classes, origins, onClose, editData }: Props) {
  const isEditMode = !!editData

  const [step, setStep] = useState(editData?.initialStep ?? 1)
  const [direction, setDirection] = useState(1)
  const [nexIndex, setNexIndex] = useState(() => {
    if (editData) {
      const idx = NEX_VALUES.indexOf(editData.initialNex)
      return idx >= 0 ? idx : 1
    }
    return 1
  })
  const [selectedOrigin, setSelectedOrigin] = useState<number | null>(
    editData?.initialOriginId ?? null
  )
  const [expandedOrigin, setExpandedOrigin] = useState<number | null>(null)
  const [selectedClass, setSelectedClass] = useState<number | null>(
    editData?.initialClassId ?? null
  )
  const [characterName, setCharacterName] = useState(editData?.initialName ?? '')
  const [originSearch, setOriginSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nex = NEX_VALUES[nexIndex]
  const isMundano = nex === 0

  // Classe Mundano — obtida da lista de classes recebida pelo backend
  const mundanoClass = classes.find((c) => c.name === 'Mundano') ?? null

  // Quando nexIndex muda: auto-seleciona Mundano (NEX 0) ou limpa seleção
  const handleNexChange = (idx: number) => {
    setNexIndex(idx)
    const isNex0 = NEX_VALUES[idx] === 0
    if (isNex0 && mundanoClass) {
      setSelectedClass(mundanoClass.id)
    } else if (!isNex0 && selectedClass === mundanoClass?.id) {
      setSelectedClass(null) // limpa se estava no Mundano
    }
  }

  // Total de passos: Mundano tem 3 (NEX → Origem → Nome), outros 4
  const totalSteps = isMundano ? 3 : 4

  // Mapeamento de passos visuais para passos reais (mundano pula o step 3)
  // step visual: 1=NEX, 2=Origem, 3=Nome(mundano) ou 3=Classe, 4=Nome
  const goNext = () => {
    setDirection(1)
    if (isMundano && step === 2) {
      setStep(4) // pula seleção de classe
    } else if (step < 4) {
      setStep((s) => s + 1)
    }
  }

  const goPrev = () => {
    setDirection(-1)
    if (isMundano && step === 4) {
      setStep(2) // volta direto para Origem
    } else if (step > 1) {
      setStep((s) => s - 1)
    }
  }

  // Número do passo exibido ao usuário (para Mundano, step 4 → exibe "3")
  const displayStep = isMundano && step === 4 ? 3 : step

  const isNextDisabled = () => {
    if (step === 2 && selectedOrigin === null) return true
    if (step === 3 && selectedClass === null) return true
    if (step === 4 && characterName.trim().length < 2) return true
    return false
  }

  const handleFinish = () => {
    if (isNextDisabled() || isSubmitting) return

    // Validação Mundano → classe ao editar
    if (isEditMode && !isMundano && (selectedClass === mundanoClass?.id || !selectedClass)) {
      setStep(3)
      return
    }

    setIsSubmitting(true)

    if (isEditMode && editData) {
      router.put(
        `/characters/${editData.characterId}`,
        { nex, classId: selectedClass, originId: selectedOrigin, name: characterName.trim() },
        {
          onSuccess: () => onClose(),
          onError: (e) => {
            console.error('Edição falhou:', e)
            setIsSubmitting(false)
          },
        }
      )
    } else {
      router.post(
        '/characters',
        { nex, classId: selectedClass, originId: selectedOrigin, name: characterName.trim() },
        {
          onSuccess: () => onClose(),
          onError: (e) => {
            console.error('Criação falhou:', e)
            setIsSubmitting(false)
          },
        }
      )
    }
  }

  const originName = origins.find((o) => o.id === selectedOrigin)?.name ?? '-'
  const className = classes.find((c) => c.id === selectedClass)?.name ?? '-'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* container do modal — largura máxima e altura auto para caber sem comprimir */}
      <m.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: 'min(700px, 85vh)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── CABEÇALHO ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {isEditMode ? 'Editar Personagem' : 'Criar Novo Personagem'}
            </h2>
            <p className="text-xs text-zinc-400">
              Passo {displayStep} de {totalSteps}
            </p>
          </div>

          {/* barrinhas de progresso — clicáveis no modo edição */}
          <div className="flex gap-1.5 mx-auto">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => {
              // Mapeia step visual → step real (Mundano: visual 3 = step 4)
              const realStep = isMundano && s === 3 ? 4 : s
              return (
                <div
                  key={s}
                  onClick={() => {
                    if (isEditMode) {
                      setDirection(realStep > step ? 1 : -1)
                      setStep(realStep)
                    }
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    isEditMode ? 'cursor-pointer hover:opacity-80' : ''
                  } ${
                    s === displayStep
                      ? 'w-8 bg-indigo-500'
                      : s < displayStep
                        ? 'w-8 bg-indigo-500/40'
                        : 'w-8 bg-zinc-700'
                  }`}
                />
              )
            })}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── CONTEÚDO ANIMADO ────────────────────────────────────────────── */}
        <div className="relative overflow-hidden flex-1 min-h-0">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <m.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 },
              }}
              className="h-full px-5 py-4 overflow-y-auto custom-scrollbar"
            >
              {/* ── PASSO 1: NEX ─────────────────────────────────────────── */}
              {step === 1 && (
                <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Nível de Exposição Paranormal
                    </h3>
                    <p className="text-sm text-zinc-400">
                      O NEX define o poder geral do seu personagem e o quanto a realidade dele já
                      foi afetada pelo paranormal.
                    </p>
                  </div>

                  <m.div
                    key={nex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`text-6xl font-black tracking-tighter ${
                      isMundano ? 'text-amber-400' : 'text-indigo-500'
                    }`}
                  >
                    {nex}%
                  </m.div>

                  <div className="w-full px-1">
                    <input
                      type="range"
                      min={0}
                      max={NEX_VALUES.length - 1}
                      value={nexIndex}
                      onChange={(e) => handleNexChange(parseInt(e.target.value))}
                      className={`w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer focus:outline-none ${
                        isMundano ? 'accent-amber-400' : 'accent-indigo-500'
                      }`}
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-2">
                      <span>0% (Mundano)</span>
                      <span>50% (Agente Especial)</span>
                      <span>99% (Lenda)</span>
                    </div>
                  </div>

                  {/* banner informativo quando NEX = 0 */}
                  {isMundano && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full rounded-xl bg-amber-500/10 border border-amber-500/30 text-left overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-amber-500/20">
                        <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          ⚠ Modo Mundano — NEX 0% — Classe auto-selecionada
                        </p>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-amber-500/20">
                        {/* Atributos */}
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-amber-300 mb-1.5">🎯 Atributos</p>
                          <p className="text-xs text-amber-200/70 leading-relaxed">
                            Todos começam em <strong>1</strong>. Apenas <strong>3 pontos</strong>{' '}
                            para distribuir (máx. 3 por atributo).
                          </p>
                        </div>
                        {/* Origens */}
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-amber-300 mb-1.5">🚫 Origens</p>
                          <p className="text-xs text-amber-200/70 leading-relaxed">
                            Origens paranormais indisponíveis. Apenas origens mundanas como
                            Policial, Chef, etc.
                          </p>
                        </div>
                        {/* Inventário */}
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-amber-300 mb-1.5">🎒 Inventário</p>
                          <p className="text-xs text-amber-200/70 leading-relaxed">
                            Sem arsenal da Ordem. Apenas <strong>1 item Cat. I</strong> + itens Cat.
                            0 coerentes com a origem.
                          </p>
                        </div>
                      </div>
                    </m.div>
                  )}
                </div>
              )}

              {step === 2 &&
                (() => {
                  // Distribui origens em 3 colunas independentes (masonry)
                  const MUNDANO_BLOCKED = [
                    'Chef do Outro Lado',
                    'Cultista Arrependido',
                    'Inventor Paranormal',
                    'Vítima',
                    'Fanático por Criaturas',
                  ]
                  const visibleOrigins = (
                    isMundano ? origins.filter((o) => !MUNDANO_BLOCKED.includes(o.name)) : origins
                  ).filter((o) => o.name.toLowerCase().includes(originSearch.toLowerCase()))
                  const cols: Origin[][] = [[], [], []]
                  visibleOrigins.forEach((o, i) => cols[i % 3].push(o))

                  const OriginCard = ({ origin }: { origin: Origin }) => {
                    const Icon = getOriginIcon(origin.name)
                    const isSelected = selectedOrigin === origin.id
                    const isExpanded = expandedOrigin === origin.id

                    return (
                      <m.div
                        key={origin.id}
                        layout
                        onClick={() => setExpandedOrigin(isExpanded ? null : origin.id)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/5'
                            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4
                              className={`font-semibold text-sm leading-tight ${isSelected ? 'text-white' : 'text-zinc-200'}`}
                            >
                              {origin.name}
                            </h4>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrigin(origin.id)
                            }}
                            className={`shrink-0 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            {isSelected ? '✓' : 'Escolher'}
                          </button>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <m.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="text-xs text-zinc-400 space-y-2 overflow-hidden"
                            >
                              <p className="leading-relaxed">{origin.description}</p>
                              {parseSkills(origin.trainedSkills) && (
                                <p>
                                  <span className="font-semibold text-zinc-300">Perícias:</span>{' '}
                                  {parseSkills(origin.trainedSkills)}
                                </p>
                              )}
                              {origin.abilityName && (
                                <div className="bg-zinc-950/60 p-2 rounded border border-zinc-800">
                                  <span className="font-semibold text-indigo-400 block mb-0.5">
                                    {origin.abilityName}
                                  </span>
                                  <p className="leading-relaxed">{origin.abilityDescription}</p>
                                </div>
                              )}
                            </m.div>
                          )}
                        </AnimatePresence>
                      </m.div>
                    )
                  }

                  return (
                    <div className="flex flex-col gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-0.5">Origem</h3>
                        <p className="text-sm text-zinc-400">
                          O que você fazia antes de se envolver com o paranormal?
                        </p>
                      </div>

                      {/* barra de pesquisa */}
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          value={originSearch}
                          onChange={(e) => setOriginSearch(e.target.value)}
                          placeholder="Buscar origem..."
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        {originSearch && (
                          <button
                            onClick={() => setOriginSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* 3 colunas flex independentes — expansão isolada por coluna */}
                      {visibleOrigins.length === 0 ? (
                        <p className="text-center text-zinc-500 text-sm py-6">
                          Nenhuma origem encontrada.
                        </p>
                      ) : (
                        <div className="flex gap-3">
                          {cols.map((col, ci) => (
                            <div key={ci} className="flex flex-col gap-3 flex-1 min-w-0">
                              {col.map((origin) => (
                                <OriginCard key={origin.id} origin={origin} />
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

              {/* ── PASSO 3: CLASSE ──────────────────────────────────────── */}
              {step === 3 && (
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-0.5">Classe</h3>
                    <p className="text-sm text-zinc-400">
                      A classe define o papel primário do seu personagem em missões e combates.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {classes
                      .filter((c) => c.name !== 'Mundano')
                      .map((cls) => {
                        const { color, bg, border, Icon } = getClassStyle(cls.name)
                        const isSelected = selectedClass === cls.id

                        return (
                          <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls.id)}
                            className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 flex flex-col items-center text-center ${
                              isSelected
                                ? `${border} ${bg}`
                                : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-800/60'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-indigo-500 rounded-full p-0.5">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <div
                              className={`p-3 rounded-full mb-3 ${isSelected ? 'bg-zinc-950/50' : 'bg-zinc-800'}`}
                            >
                              <Icon className={`w-8 h-8 ${isSelected ? color : 'text-zinc-400'}`} />
                            </div>
                            <h4
                              className={`text-lg font-bold mb-1.5 ${isSelected ? 'text-white' : 'text-zinc-300'}`}
                            >
                              {cls.name}
                            </h4>
                            <p
                              className={`text-xs leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}
                            >
                              {cls.description ?? ''}
                            </p>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* ── PASSO 4: NOME ────────────────────────────────────────── */}
              {step === 4 && (
                <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto gap-5">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">Identidade</h3>
                    <p className="text-sm text-zinc-400">
                      {isEditMode
                        ? 'Edite o nome do seu agente.'
                        : 'Por fim, dê um nome ao seu novo agente.'}
                    </p>
                  </div>

                  <div className="w-full space-y-1">
                    <label
                      htmlFor="charName"
                      className="block text-xs font-medium text-zinc-300 ml-0.5"
                    >
                      Nome do Personagem
                    </label>
                    <input
                      id="charName"
                      type="text"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isNextDisabled() && handleFinish()}
                      placeholder="Ex: Arthur Cervero"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      autoFocus
                    />
                  </div>

                  {/* resumo */}
                  <div className="w-full p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                      {isEditMode ? 'Alterações' : 'Resumo do Agente'}
                    </h4>
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex justify-between">
                        <span className="text-zinc-500">NEX</span>
                        <span className="text-white font-medium">{nex}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-zinc-500">Origem</span>
                        <span className="text-white font-medium">{originName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-zinc-500">Classe</span>
                        <span className="text-white font-medium">{className}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* ── RODAPÉ ──────────────────────────────────────────────────────── */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between shrink-0">
          <button
            onClick={goPrev}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              step === 1 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="flex items-center gap-2">
            {/* Botão "Salvar" disponível em qualquer step no modo edição */}
            {isEditMode && step !== 4 && (
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isSubmitting
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                }`}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                <Check className="w-4 h-4" />
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={goNext}
                disabled={isNextDisabled()}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  isNextDisabled()
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                }`}
              >
                Avançar
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isNextDisabled() || isSubmitting}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  isNextDisabled() || isSubmitting
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                }`}
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Salvando...'
                    : 'Criando...'
                  : isEditMode
                    ? 'Salvar Alterações'
                    : 'Criar Personagem'}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </m.div>
    </div>
  )
}
