import { useState } from 'react'
import BaseModal from './BaseModal'
import type { RitualBuffEffect } from '../../../utils/ritualBuffs'
import { getAttributeBonus } from '../../../utils/ritualBuffs'
import { User, Users, Sword, Wind, Brain, Ghost } from 'lucide-react'

/**
 * Tipos de atributo com seus rótulos e ícones para exibição.
 */
const ATTR_MAP: Record<string, { label: string; color: string; icon: typeof Sword }> = {
  str: {
    label: 'Força',
    color: 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20',
    icon: Sword,
  },
  agi: {
    label: 'Agilidade',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20',
    icon: Wind,
  },
  int: {
    label: 'Intelecto',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20',
    icon: Brain,
  },
  pre: {
    label: 'Presença',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20',
    icon: Ghost,
  },
}

export interface RitualBuffModalProps {
  isOpen: boolean
  onClose: () => void
  /** Nome do ritual que foi conjurado */
  ritualName: string
  /** Versão usada */
  version: 'base' | 'discente' | 'verdadeiro'
  /** Efeito do buff */
  buff: RitualBuffEffect
  /** Callback quando o jogador confirma a aplicação em si mesmo */
  onApplyToSelf: (buff: RitualBuffEffect, chosenAttr?: string) => void
  /** Callback quando o jogador escolhe aplicar em aliado (efeito não aplicado automaticamente) */
  onApplyToAlly: () => void
}

/**
 * Modal que aparece após um ritual de buff ser conjurado com sucesso.
 * Permite escolher se aplica em si mesmo ou em um aliado.
 * Para rituais com escolha de atributo (Aprimorar Físico/Mente), mostra as opções.
 */
export default function RitualBuffModal({
  isOpen,
  onClose,
  ritualName,
  version,
  buff,
  onApplyToSelf,
  onApplyToAlly,
}: RitualBuffModalProps) {
  const [chosenAttr, setChosenAttr] = useState<string | null>(null)
  const hasAttrChoice = buff.attributeChoice && buff.attributeChoice.length > 0
  const attrBonus = getAttributeBonus(version)

  const versionLabel =
    version === 'discente' ? 'Discente' : version === 'verdadeiro' ? 'Verdadeiro' : 'Base'

  /** Resumo textual do buff */
  const effectSummary = () => {
    const parts: string[] = []
    if (buff.defenseBonus) parts.push(`+${buff.defenseBonus} Defesa`)
    if (buff.dodgeBonus) parts.push(`+${buff.dodgeBonus} Esquiva`)
    if (buff.tempHp) parts.push(`${buff.tempHp} PV Temporários`)
    if (buff.tempHpFlat) parts.push(`${buff.tempHpFlat} PV Temporários`)
    if (buff.healDice) parts.push(`Cura ${buff.healDice} PV`)
    if (hasAttrChoice) parts.push(`+${attrBonus} em atributo à escolha`)
    return parts.join(', ') || 'Efeito aplicado'
  }

  const handleApplyToSelf = () => {
    if (hasAttrChoice && !chosenAttr) return // precisa escolher atributo
    onApplyToSelf(buff, chosenAttr ?? undefined)
    setChosenAttr(null)
    onClose()
  }

  const handleApplyToAlly = () => {
    onApplyToAlly()
    setChosenAttr(null)
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        setChosenAttr(null)
        onClose()
      }}
      maxWidth="max-w-md"
      title={
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-white">{ritualName}</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            {versionLabel} · Sucesso!
          </span>
        </div>
      }
      description={effectSummary()}
    >
      <div className="flex flex-col gap-4">
        {/* Escolha de atributo, se aplicável */}
        {hasAttrChoice && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-300 font-bold">
              Escolha o atributo que receberá +{attrBonus}:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {buff.attributeChoice!.map((attr) => {
                const info = ATTR_MAP[attr]
                if (!info) return null
                const Icon = info.icon
                const isSelected = chosenAttr === attr
                return (
                  <button
                    key={attr}
                    onClick={() => setChosenAttr(attr)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all font-bold text-sm ${
                      isSelected
                        ? `${info.color} ring-2 ring-offset-1 ring-offset-zinc-900`
                        : `${info.color} opacity-60 hover:opacity-100`
                    }`}
                  >
                    <Icon size={16} />
                    {info.label} +{attrBonus}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Botões de escolha de alvo */}
        {buff.selfOnly ? (
          <button
            onClick={handleApplyToSelf}
            disabled={hasAttrChoice && !chosenAttr}
            className="h-16 text-lg font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <User size={20} />
            Aplicar em mim
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleApplyToSelf}
              disabled={hasAttrChoice && !chosenAttr}
              className="h-16 text-lg font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <User size={20} />
              Aplicar em mim
            </button>
            <button
              onClick={handleApplyToAlly}
              className="h-16 text-lg font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              <Users size={20} />
              Aplicar em um aliado
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
