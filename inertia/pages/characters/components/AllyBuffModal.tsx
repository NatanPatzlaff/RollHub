import React, { useState } from 'react'
import BaseModal from './BaseModal'
import { User, Sword, Check } from 'lucide-react'

interface AllyBuffModalProps {
  open: boolean
  allies: Array<{ id: number; name: string; weapons: any[] }>
  buff: any
  casterName: string
  onConfirm: (allyId: number, chosenWeaponId?: string, chosenElement?: string) => void
  onClose: () => void
}

const ELEMENTS = [
  { name: 'Sangue', color: 'bg-red-500/20 text-red-500 border-red-500/50' },
  { name: 'Morte', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  { name: 'Conhecimento', color: 'bg-amber-500/20 text-amber-500 border-amber-500/50' },
  { name: 'Energia', color: 'bg-blue-500/20 text-blue-500 border-blue-500/50' },
]

export default function AllyBuffModal({ open, onClose, allies, buff, onConfirm }: AllyBuffModalProps) {
  const [step, setStep] = useState(1)
  const [selectedAllyId, setSelectedAllyId] = useState<number | null>(null)
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  // LOGS DE DEBUG
  console.log('[ALLY-MODAL] render - buff:', JSON.stringify(buff))
  console.log('[ALLY-MODAL] render - needsWeapon:', !!(buff?.weaponExtraDamageDice || buff?.weaponAttackBonus || buff?.elementChoice))
  console.log('[ALLY-MODAL] render - allies:', allies.map(a => ({ id: a.id, name: a.name, weaponsCount: a.weapons?.length })))

  const selectedAlly = allies.find((a) => a.id === selectedAllyId)
  const needsWeapon = !!(buff?.weaponExtraDamageDice || buff?.weaponAttackBonus || buff?.elementChoice)
  const needsElement = !!buff?.elementChoice

  const handleAllySelect = (allyId: number) => {
    console.log('[ALLY-MODAL] handleAllySelect - allyId:', allyId)
    console.log('[ALLY-MODAL] handleAllySelect - needsWeapon:', needsWeapon)
    const ally = allies.find(a => a.id === allyId)
    console.log('[ALLY-MODAL] handleAllySelect - ally.weapons:', JSON.stringify(ally?.weapons))
    
    setSelectedAllyId(allyId)
    if (needsWeapon) {
      console.log('[ALLY-MODAL] handleAllySelect - avançando para step 2')
      setStep(2)
    } else {
      console.log('[ALLY-MODAL] handleAllySelect - sem necessidade de arma, permanecendo no step 1')
    }
  }

  const handleWeaponSelect = (weaponId: string) => {
    setSelectedWeaponId(weaponId)
    if (needsElement) {
      setStep(3)
    }
  }

  const handleConfirm = () => {
    console.log('[ALLY-MODAL] handleConfirm - selectedAllyId:', selectedAllyId)
    console.log('[ALLY-MODAL] handleConfirm - selectedWeaponId:', selectedWeaponId)
    console.log('[ALLY-MODAL] handleConfirm - selectedElement:', selectedElement)
    console.log('[ALLY-MODAL] handleConfirm - needsWeapon:', needsWeapon)
    
    if (selectedAllyId) {
      onConfirm(selectedAllyId, selectedWeaponId ?? undefined, selectedElement ?? undefined)
      handleClose()
    }
  }

  const handleClose = () => {
    setStep(1)
    setSelectedAllyId(null)
    setSelectedWeaponId(null)
    setSelectedElement(null)
    onClose()
  }

  return (
    <BaseModal
      isOpen={open}
      onClose={handleClose}
      title={
        step === 1 ? 'Escolha o Aliado' : 
        step === 2 ? `Escolha a Arma de ${selectedAlly?.name}` :
        'Escolha o Elemento'
      }
      description={
        step === 1 ? 'Selecione o aliado que receberá os efeitos do ritual.' :
        step === 2 ? 'Selecione em qual arma do aliado o efeito será aplicado.' :
        'Selecione o elemento que será imbuído na arma.'
      }
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        {step === 1 && (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {allies.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-sm italic">
                Nenhum aliado encontrado na campanha.
              </div>
            ) : (
              allies.map((ally) => (
                <button
                  key={ally.id}
                  onClick={() => handleAllySelect(ally.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedAllyId === ally.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <span className="font-bold">{ally.name}</span>
                </button>
              ))
            )}
          </div>
        )}

        {step === 2 && selectedAlly && (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {selectedAlly.weapons.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-sm italic">
                Este aliado não possui armas cadastradas.
              </div>
            ) : (
            selectedAlly.weapons.map((w: any) => {
                const weaponId = w.id.toString()
                return (
                  <button
                    key={weaponId}
                    onClick={() => handleWeaponSelect(weaponId)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedWeaponId === weaponId
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <Sword size={18} className="text-zinc-500" />
                    <div className="flex flex-col">
                      <span className="font-bold">{w.custom_name || w.name}</span>
                      <span className="text-[10px] text-zinc-400 uppercase opacity-50">{w.range}</span>
                    </div>
                  </button>
                )
              })
            )}
            <button
              onClick={() => setStep(1)}
              className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
            >
              Voltar para seleção de aliado
            </button>
        </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-2">
            {ELEMENTS.map((el) => (
              <button
                key={el.name}
                onClick={() => setSelectedElement(el.name)}
                className={`p-4 rounded-xl border font-bold transition-all ${
                  selectedElement === el.name
                    ? el.color
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400'
                }`}
              >
                {el.name}
              </button>
            ))}
            <button
              onClick={() => setStep(2)}
              className="col-span-2 mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
            >
              Voltar para seleção de arma
            </button>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={handleConfirm}
            disabled={
              !selectedAllyId || 
              (needsWeapon && !selectedWeaponId) || 
              (needsElement && !selectedElement)
            }
            className="w-full h-12 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            <Check size={18} />
            Confirmar Aplicação
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
