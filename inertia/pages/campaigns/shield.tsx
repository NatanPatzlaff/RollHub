import { useState } from 'react'
import { Head, usePage } from '@inertiajs/react'

import BrowserTabs from './shield_components/BrowserTabs'
import PlayersPanel from './shield_components/PlayersPanel'
import MainContent from './shield_components/MainContent'
import RollHistoryPanel from './shield_components/RollHistoryPanel'

// --- DADOS DE TESTE (MOCKS) ---
const mockEntities = [
  { id: 1, name: 'Arthur Cervero', class: 'Combatente', hp: 45, maxHp: 45, pe: 12, maxPe: 15, sanity: 30, maxSanity: 40, status: 'Saudável', initiative: 24, isMonster: false },
  { id: 'm1', name: 'Zumbi de Sangue (Alfa)', class: 'Criatura - Sangue', hp: 80, maxHp: 80, pe: 0, maxPe: 0, sanity: 0, maxSanity: 0, status: 'Machucado', initiative: 18, isMonster: true },
  { id: 2, name: 'Kaiser', class: 'Especialista', hp: 22, maxHp: 30, pe: 25, maxPe: 25, sanity: 15, maxSanity: 45, status: 'Machucado', initiative: 14, isMonster: false },
  { id: 3, name: 'Joui Jouki', class: 'Ocultista', hp: 15, maxHp: 20, pe: 35, maxPe: 35, sanity: 8, maxSanity: 50, status: 'Enlouquecendo', initiative: 8, isMonster: false },
]

const mockRolls = [
  { id: 1, player: 'Arthur Cervero', action: 'Ataque: Acha', roll: '1d20+10', result: 28, isCritical: true, time: '10:42' },
  { id: 2, player: 'Joui Jouki', action: 'Ocultismo', roll: '1d20+5', result: 14, isCritical: false, time: '10:38' },
  { id: 3, player: 'Kaiser', action: 'Furtividade', roll: '1d20+8', result: 9, isFail: true, time: '10:35' },
  { id: 4, player: 'Mestre', action: 'Ataque: Criatura', roll: '1d20+15', result: 22, isCritical: false, time: '10:30', isGM: true },
]

export default function ShieldDashboard() {
  const { campaign } = usePage().props as any
  const [activeTab, setActiveTab] = useState('combates')

  return (
    <>
      <Head title={`Escudo do Mestre - ${campaign?.name || 'Campanha'}`} />
      
      <div className="h-screen w-full bg-[#09090B] text-white font-sans flex flex-col overflow-hidden selection:bg-[#F97316]/30">
        
        {/* Topo: Abas do Navegador */}
        <BrowserTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Corpo: Layout Bento/VTT */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Painel Esquerdo: Jogadores */}
          <PlayersPanel entities={mockEntities} />
          
          {/* Área Central: Conteúdo das Abas */}
          <MainContent activeTab={activeTab} />
          
          {/* Painel Direito: Histórico de Rolagens */}
          <RollHistoryPanel rolls={mockRolls} />
          
        </div>
      </div>
    </>
  )
}
