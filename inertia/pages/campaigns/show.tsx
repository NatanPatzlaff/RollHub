import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Swords, Dices, Monitor, Search, Heart, Zap, 
  Brain, FileText, Plus
} from 'lucide-react'

import VTTTabs from './components/vtt/VTTTabs'
import PlayersSidebar from './components/vtt/PlayersSidebar'
import RollHistorySidebar from './components/vtt/RollHistorySidebar'
import CampaignNotes from './components/CampaignNotes'
import GroupOverview from './components/GroupOverview'

interface GameMasterDashboardProps {
  campaign: any
  isGM?: boolean
}

export default function GameMasterDashboard({ campaign, isGM }: GameMasterDashboardProps) {
  const [activeTab, setActiveTab] = useState('combates')
  const characters = campaign.characters || []
  const rolls = campaign.rolls || [] // Assuming rolls might be passed in campaign props

  const { data, setData, put, processing, errors } = useForm({
    name: campaign.name || '',
    description: campaign.description || '',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/campaigns/${campaign.id}`, {
      preserveScroll: true,
    })
  }

  const tabs = [
    { id: 'salas', label: 'Salas', icon: Monitor },
    { id: 'combates', label: 'Combates', icon: Swords },
    { id: 'dados', label: 'Dados', icon: Dices },
    { id: 'jogadores', label: 'Grupo', icon: Users },
    { id: 'anotacoes', label: 'Anotações', icon: FileText },
  ]

  return (
    <div className="h-screen w-full bg-[#09090B] text-white font-sans flex flex-col overflow-hidden selection:bg-[#F97316]/30">
      
      {/* Topo: Abas do Navegador Style */}
      <VTTTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Corpo: Layout Bento/VTT */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Painel Esquerdo: Ordem de Turno / Personagens */}
        <PlayersSidebar characters={characters} />
        
        {/* Área Central: Conteúdo das Abas */}
        <div className="flex-1 bg-[#09090B] p-6 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            
            {activeTab === 'combates' && (
              <motion.div 
                key="combates" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="h-full flex flex-col gap-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-white">Painel de Combate</h2>
                  {isGM && (
                    <button className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-3 py-1.5 rounded text-sm font-bold hover:bg-[#EF4444]/20 transition-colors">
                      Encerrar Combate
                    </button>
                  )}
                </div>
                
                <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-10 flex flex-col items-center justify-center text-[#A1A1AA] flex-1">
                  <Swords size={64} className="mb-4 opacity-20" />
                  <p className="text-xl font-bold text-white mb-2">Inicie um Combate</p>
                  <p className="text-sm max-w-md text-center">
                    Selecione personagens na barra lateral ou adicione criaturas para começar a acompanhar a iniciativa e os rounds.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'anotacoes' && (
              <motion.div 
                key="anotacoes" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="h-full flex flex-col"
              >
                <CampaignNotes campaignId={campaign.id} />
              </motion.div>
            )}

            {activeTab === 'jogadores' && (
              <motion.div 
                key="jogadores" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="h-full"
              >
                <GroupOverview players={characters} />
              </motion.div>
            )}

            {activeTab === 'salas' && (
              <motion.div 
                key="salas" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="h-full flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-white mb-2">Gestor de Salas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-[#18181B] border-2 border-[#F97316] rounded-xl p-4 cursor-pointer relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-[#F97316] text-[#09090B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Ativa</div>
                    <h3 className="font-bold text-white mb-1">Cena Principal</h3>
                    <p className="text-xs text-[#A1A1AA]">Sincronizada com todos os jogadores.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'dados' && (
              <motion.div 
                key="dados" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                className="h-full flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-md bg-[#18181B] border border-[#27272A] rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-[#101012] border-2 border-[#7C3AED] rounded-2xl mx-auto flex items-center justify-center mb-6 transform rotate-12 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                    <Dices size={32} className="text-[#7C3AED]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Mesa de Dados</h2>
                  <p className="text-sm text-[#A1A1AA] mb-8">Role dados rapidamente para a mesa.</p>
                  
                  <div className="flex flex-wrap justify-center gap-3">
                    {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map(dice => (
                      <button key={dice} className="bg-[#101012] border border-[#27272A] hover:border-[#F97316] hover:text-[#F97316] text-white px-4 py-2.5 rounded-lg font-bold font-mono transition-all hover:scale-105 active:scale-95">
                        {dice}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        
        {/* Painel Direito: Histórico */}
        <RollHistorySidebar rolls={rolls} />
        
      </div>
    </div>
  )
}
