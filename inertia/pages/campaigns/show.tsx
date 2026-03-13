import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Swords, Dices, FileText
} from 'lucide-react'
import axios from 'axios'

import VTTTabs from './components/vtt/VTTTabs'
import PlayersSidebar from './components/vtt/PlayersSidebar'
import RollHistorySidebar from './components/vtt/RollHistorySidebar'
import CampaignNotes from './components/CampaignNotes'
import GroupOverview from './components/GroupOverview'

interface GameMasterDashboardProps {
  campaign: any
  auth: any
}

export default function GameMasterDashboard({ campaign, auth }: GameMasterDashboardProps) {
  const [activeTab, setActiveTab] = useState('combates')
  const [campaignRolls, setCampaignRolls] = useState<any[]>([])
  const [showStats, setShowStats] = useState<boolean>(Boolean(campaign.showPlayerStats ?? false))
  
  const characters = campaign.characters || []

  const loadRolls = async () => {
    if (!campaign?.id) return
    try {
      const response = await axios.get(`/api/campaigns/${campaign.id}/rolls`)
      const formattedRolls = (response.data.rolls || []).map((r: any) => ({
        id: r.id,
        player: r.playerName || r.player_name,
        action: r.action,
        roll: r.rollExpression || r.roll_expression,
        result: r.result,
        time: new Date(r.rolledAt || r.rolled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isCritical: !!r.isCritical || !!r.is_critical,
        isFail: !!r.isFail || !!r.is_fail,
        isGM: !!r.isGm || !!r.is_gm,
        diceValues: r.diceValues
      }))
      setCampaignRolls(formattedRolls)
    } catch (e) {
      console.error('Erro ao buscar rolagens:', e)
    }
  }

  const handleClearHistory = async () => {
    if (!campaign?.id) return
    
    // Encontrar o personagem do usuário logado (Mestre ou Jogador) na campanha
    const userCharacter = campaign.characters?.find((c: any) => c.userId === auth.user.id)
    if (!userCharacter) return

    try {
      await axios.post(`/api/characters/${userCharacter.id}/rolls/clear`)
      setCampaignRolls([])
    } catch (error) {
      console.error('Erro ao limpar histórico:', error)
    }
  }

  const handleClearAll = async () => {
    if (!campaign?.id) return
    if (!confirm('Isso irá deletar TODAS as rolagens da campanha para todos os jogadores. Confirmar?')) return
    
    try {
      await axios.delete(`/api/campaigns/${campaign.id}/rolls`)
      setCampaignRolls([])
    } catch (e) {
      console.error('Erro ao limpar todas as rolagens:', e)
    }
  }

  const checkSettings = async () => {
    try {
      const res = await axios.get(`/campaigns/${campaign.id}/settings`)
      const newValue = Boolean(res.data.showPlayerStats ?? false)
      setShowStats(prev => prev !== newValue ? newValue : prev)
    } catch (e) {
      console.error('Erro ao buscar configurações:', e)
    }
  }

  useEffect(() => {
    loadRolls()
    checkSettings()
    const interval = setInterval(() => {
      loadRolls()
      checkSettings()
    }, 10000)
    return () => clearInterval(interval)
  }, [campaign?.id])

  const tabs = [
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
        <PlayersSidebar characters={characters} showStats={showStats} />
        
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
                <GroupOverview players={characters} showStats={showStats} />
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
        <RollHistorySidebar 
          rolls={campaignRolls} 
          onClear={handleClearHistory} 
          onClearAll={handleClearAll}
        />
        
      </div>
    </div>
  )
}
