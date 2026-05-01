import { useState } from 'react'
import BaseModal from './BaseModal'
import type { RitualBuffEffect } from '../../../utils/ritualBuffs'
import { getAttributeBonus } from '../../../utils/ritualBuffs'
import { User, Users, Sword, Wind, Brain, Ghost, LucideIcon } from 'lucide-react'

/**
 * Tipos de atributo com seus rótulos e ícones para exibição.
 */
const ATTR_MAP: Record<string, { label: string; color: string; icon: LucideIcon }> = {
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

const ELEMENT_STYLES: Record<string, { color: string; bg: string }> = {
  Sangue: { color: 'text-red-400', bg: 'bg-red-500/20 border-red-500' },
  Morte: { color: 'text-zinc-400', bg: 'bg-zinc-500/20 border-zinc-500' },
  Energia: { color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500' },
  Conhecimento: { color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500' },
}

const ELEMENTS = ['Sangue', 'Morte', 'Energia', 'Conhecimento']

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
  onApplyToSelf: (buff: RitualBuffEffect, chosenAttr?: string, chosenWeapon?: string, chosenElement?: string) => void
  /** Callback quando o jogador escolhe aplicar em aliado (efeito não aplicado automaticamente) */
  onApplyToAlly: () => void
  /** Lista de armas do personagem para escolha de alvo */
  weapons?: { id: string; name: string; range: string }[]
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
  weapons = [],
}: RitualBuffModalProps) {
  const [chosenAttr, setChosenAttr] = useState<string | null>(null)
  const [chosenWeapon, setChosenWeapon] = useState<string | null>(null)
  const [chosenElement, setChosenElement] = useState<string | null>(null)

  const hasAttrChoice = buff.attributeChoice && buff.attributeChoice.length > 0
  const hasWeaponChoice = !!(
    buff.weaponAttackBonus ||
    buff.weaponDamageBonus ||
    buff.weaponExtraDamageDice ||
    buff.weaponThreatRangeBonus ||
    buff.weaponCritMultiplierBonus ||
    buff.elementChoice ||
    buff.tempModification
  )

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
    if (hasWeaponChoice && weapons.length > 0 && !chosenWeapon) return // precisa escolher arma
    if (buff.elementChoice && !chosenElement) return // precisa escolher elemento
    onApplyToSelf(buff, chosenAttr ?? undefined, chosenWeapon?.toString() ?? undefined, chosenElement ?? undefined)
    setChosenAttr(null)
    setChosenWeapon(null)
    setChosenElement(null)
    onClose()
  }

  const handleApplyToAlly = () => {
    onApplyToAlly()
    setChosenAttr(null)
    setChosenWeapon(null)
    setChosenElement(null)
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        setChosenAttr(null)
        setChosenWeapon(null)
        setChosenElement(null)
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
                const Icon: LucideIcon = info.icon
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

        {/* Escolha de arma, se aplicável e houver armas */}
        {hasWeaponChoice && weapons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-300 font-bold">
              Escolha a arma que receberá o buff:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {weapons.map((w) => {
                const isSelected = chosenWeapon === w.id
                return (
                  <button
                    key={w.id}
                    onClick={() => setChosenWeapon(w.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all font-bold text-sm ${
                      isSelected
                        ? `text-purple-400 border-purple-500 bg-purple-500/10 ring-2 ring-offset-1 ring-offset-zinc-900`
                        : `text-zinc-400 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sword size={16} className={isSelected ? 'text-purple-400' : 'text-zinc-500'} />
                      <span>{w.name}</span>
                    </div>
                    <span className="text-[10px] uppercase opacity-50">{w.range}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Escolha de elemento (Amaldiçoar Arma) */}
        {buff.elementChoice && chosenWeapon && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-300 font-bold">
              Escolha o elemento do dano extra:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ELEMENTS.map((el) => {
                const style = ELEMENT_STYLES[el] || { color: 'text-zinc-400', bg: 'bg-zinc-800' }
                const isSelected = chosenElement === el
                return (
                  <button
                    key={el}
                    onClick={() => setChosenElement(el)}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                      isSelected
                        ? `${style.bg} ${style.color} border-${style.color.replace('text-', '')}/50 ring-2 ring-offset-1 ring-offset-zinc-900`
                        : `${style.bg} ${style.color} opacity-50 hover:opacity-100`
                    }`}
                  >
                    {el}
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
            disabled={(hasAttrChoice && !chosenAttr) || (hasWeaponChoice && weapons.length > 0 && !chosenWeapon) || (buff.elementChoice && !chosenElement)}
            className="h-16 text-lg font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <User size={20} />
            Aplicar em mim
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleApplyToSelf}
              disabled={(hasAttrChoice && !chosenAttr) || (hasWeaponChoice && weapons.length > 0 && !chosenWeapon) || (buff.elementChoice && !chosenElement)}
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
