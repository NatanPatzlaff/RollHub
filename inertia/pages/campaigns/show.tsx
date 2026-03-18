import { useState, useEffect } from 'react'
import axios from 'axios'
import CampaignNotes from './components/CampaignNotes'
import GroupOverview from './components/GroupOverview'

interface GameMasterDashboardProps {
  campaign: any
}

export default function GameMasterDashboard({ campaign }: GameMasterDashboardProps) {
  const [activeTab, setActiveTab] = useState('jogadores')
  const [showStats, setShowStats] = useState<boolean>(Boolean(campaign.showPlayerStats ?? false))
  
  const characters = campaign.characters || []

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
    checkSettings()
    const interval = setInterval(() => {
      checkSettings()
    }, 10000)
    return () => clearInterval(interval)
  }, [campaign?.id])

  return (
    <div className="h-screen w-full bg-[#09090B] text-white font-sans flex flex-col overflow-hidden selection:bg-[#F97316]/30">
      {/* Header com abas simples */}
      <div className="border-b border-[#27272A] px-6 py-3 flex gap-4">
        <button 
          onClick={() => setActiveTab('jogadores')} 
          className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'jogadores' ? 'border-[#7C3AED] text-white' : 'border-transparent text-[#A1A1AA]'}`}
        >
          Grupo
        </button>
        <button 
          onClick={() => setActiveTab('anotacoes')} 
          className={`text-sm font-bold pb-1 border-b-2 transition-colors ${activeTab === 'anotacoes' ? 'border-[#7C3AED] text-white' : 'border-transparent text-[#A1A1AA]'}`}
        >
          Anotações
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'jogadores' && <GroupOverview players={characters} showStats={showStats} />}
        {activeTab === 'anotacoes' && <CampaignNotes campaignId={campaign.id} />}
      </div>
    </div>
  )
}
