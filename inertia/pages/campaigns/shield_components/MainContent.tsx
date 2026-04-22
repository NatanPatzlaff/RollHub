import { motion, AnimatePresence } from 'framer-motion'
import { Dices } from 'lucide-react'
import GroupOverview from '../components/GroupOverview'
import CampaignNotes from '../components/CampaignNotes'
import MissionsTab from './MissionsTab'
import CombatTab from './CombatTab'
import MonsterList from './MonsterList'

interface MainContentProps {
  activeTab: string
  campaign: any
  showStats: boolean
  isOwner?: boolean
  onEndScene: () => void
  homebrewItems: any[]
  activeCombat: any
  campaignMonsters: any[]
  setActiveTab: (tab: string) => void
}

export default function MainContent({ 
  activeTab, 
  campaign, 
  showStats, 
  isOwner = false, 
  onEndScene, 
  homebrewItems,
  activeCombat,
  campaignMonsters,
  setActiveTab
}: MainContentProps) {
  return (
    <div className="flex-1 bg-[#09090B] p-6 overflow-y-auto relative custom-scrollbar">
      <AnimatePresence mode="wait">
        
        {activeTab === 'missoes' && (
          <MissionsTab 
            campaignId={campaign.id} 
            campaignCharacters={campaign.characters || []}
            onEndScene={onEndScene}
            homebrewItems={homebrewItems}
            campaignMonsters={campaignMonsters}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'combates' && (
          <motion.div key="combates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-3 overflow-hidden flex flex-col">
                <CombatTab 
                  campaignId={campaign.id}
                  activeCombat={activeCombat}
                  monsters={campaignMonsters}
                  characters={campaign.characters || []}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bestiario' && (
          <motion.div key="bestiario" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
             <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 h-full overflow-hidden flex flex-col">
                <MonsterList 
                  monsters={campaignMonsters}
                  campaignId={campaign.id}
                />
              </div>
          </motion.div>
        )}

        {activeTab === 'dados' && (
          <motion.div key="dados" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-[#18181B] border border-[#27272A] rounded-xl p-6 text-center">
              <div className="w-20 h-20 bg-[#101012] border-2 border-[#7C3AED] rounded-2xl mx-auto flex items-center justify-center mb-4 transform rotate-12 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                <Dices size={40} className="text-[#7C3AED]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Mesa de Dados Virtual</h2>
              <p className="text-sm text-[#A1A1AA] mb-6">Selecione o tipo de dado para lançar na mesa (visível para todos os jogadores).</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map(dice => (
                  <button key={dice} className="bg-[#101012] border border-[#27272A] hover:border-[#06B6D4] hover:text-[#06B6D4] text-white px-4 py-2 rounded-lg font-bold font-mono transition-colors">
                    {dice}
                  </button>
                ))}
              </div>
            </div>
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
            <GroupOverview players={campaign.characters || []} showStats={showStats} isOwner={isOwner} />
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
      </AnimatePresence>
    </div>
  )
}
