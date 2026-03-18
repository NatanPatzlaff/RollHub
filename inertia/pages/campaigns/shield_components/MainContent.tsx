import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Swords, Zap, Dices } from 'lucide-react'
import GroupOverview from '../components/GroupOverview'
import CampaignNotes from '../components/CampaignNotes'

interface MainContentProps {
  activeTab: string
  campaign: any
  showStats: boolean
  isOwner?: boolean
}

export default function MainContent({ activeTab, campaign, showStats, isOwner = false }: MainContentProps) {
  return (
    <div className="flex-1 bg-[#09090B] p-6 overflow-y-auto relative">
      <AnimatePresence mode="wait">
        
        {activeTab === 'salas' && (
          <motion.div key="salas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white mb-2">Gestor de Salas (Cenas)</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#18181B] border-2 border-[#F97316] rounded-xl p-4 cursor-pointer relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-[#F97316] text-[#09090B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Ativa</div>
                <h3 className="font-bold text-white mb-1">Mansão Abandonada</h3>
                <p className="text-xs text-[#A1A1AA]">Ambiente: Escuro • Investigação</p>
              </div>
              <div className="bg-[#101012] border border-[#27272A] hover:border-[#3F3F46] rounded-xl p-4 cursor-pointer">
                <h3 className="font-bold text-white mb-1">Esgotos da Cidade</h3>
                <p className="text-xs text-[#A1A1AA]">Ambiente: Húmido • Combate</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'combates' && (
          <motion.div key="combates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-white">Ficha de Criatura</h2>
              <button className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-3 py-1.5 rounded text-sm font-bold">Encerrar Combate</button>
            </div>
            
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-y-auto p-6 flex-1">
              <div className="flex justify-between items-start border-b border-[#27272A] pb-4 mb-4">
                <div>
                  <h3 className="text-3xl font-black text-[#EF4444] uppercase tracking-wider mb-1">Zumbi de Sangue (Alfa)</h3>
                  <p className="text-[#A1A1AA] font-bold text-sm">CRIATURA DE SANGUE • VD 40</p>
                </div>
                <div className="text-right">
                  <div className="bg-[#101012] border border-[#27272A] px-5 py-2 rounded-lg inline-block">
                    <span className="text-xs text-[#A1A1AA] font-bold block mb-1">DEFESA</span>
                    <span className="text-2xl font-black text-white">18</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-8">
                {['AGI', 'FOR', 'INT', 'PRE', 'VIG'].map((attr, idx) => {
                  const values = [2, 3, 1, 1, 3]
                  return (
                    <div key={attr} className="bg-[#101012] border border-[#27272A] rounded-lg p-3 text-center">
                      <span className="text-[10px] text-[#A1A1AA] font-bold block mb-1">{attr}</span>
                      <span className="text-lg font-black text-white">{values[idx]}</span>
                    </div>
                  )
                })}
              </div>

              <div className="bg-[#101012] border border-[#27272A] rounded-xl p-5 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-[#EF4444]" />
                    <h4 className="font-bold text-white text-lg">Pontos de Vida</h4>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] bg-[#F97316]/10 px-3 py-1 rounded-full">Machucado</span>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <span className="text-4xl font-black text-white w-24 text-right">80<span className="text-xl text-[#A1A1AA] font-normal">/80</span></span>
                  <div className="flex-1 h-4 bg-[#1C1C1E] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                    <div className="h-full bg-linear-to-r from-[#7F1D1D] to-[#EF4444] transition-all duration-500" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                  <div className="flex gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-[#09090B] border border-[#27272A] rounded-lg overflow-hidden focus-within:border-[#EF4444] transition-colors flex-1 lg:flex-none">
                      <span className="text-xs text-[#A1A1AA] font-bold px-3">DANO</span>
                      <input type="number" placeholder="0" className="bg-transparent w-full lg:w-16 py-2.5 text-white text-center focus:outline-none font-mono" />
                    </div>
                    <div className="flex items-center bg-[#09090B] border border-[#27272A] rounded-lg overflow-hidden focus-within:border-[#10B981] transition-colors flex-1 lg:flex-none">
                      <span className="text-xs text-[#A1A1AA] font-bold px-3">CURA</span>
                      <input type="number" placeholder="0" className="bg-transparent w-full lg:w-16 py-2.5 text-white text-center focus:outline-none font-mono" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none bg-[#18181B] border border-[#27272A] hover:border-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444] text-white lg:w-12 py-2.5 rounded-lg font-bold transition-colors">-5</button>
                    <button className="flex-1 lg:flex-none bg-[#18181B] border border-[#27272A] hover:border-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444] text-white lg:w-12 py-2.5 rounded-lg font-bold transition-colors">-1</button>
                    <button className="flex-1 lg:flex-none bg-[#18181B] border border-[#27272A] hover:border-[#10B981] hover:bg-[#10B981]/10 hover:text-[#10B981] text-white lg:w-12 py-2.5 rounded-lg font-bold transition-colors">+1</button>
                    <button className="flex-1 lg:flex-none bg-[#18181B] border border-[#27272A] hover:border-[#10B981] hover:bg-[#10B981]/10 hover:text-[#10B981] text-white lg:w-12 py-2.5 rounded-lg font-bold transition-colors">+5</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-[#F97316] mb-3 border-b border-[#27272A] pb-2 flex items-center gap-2">
                    <Swords size={16} /> ATAQUES
                  </h4>
                  <div className="bg-[#101012] border border-[#27272A] p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white text-base">Garras de Sangue <span className="text-xs text-[#A1A1AA] font-normal ml-1">(Corpo a Corpo)</span></span>
                      <button className="bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 px-3 py-1.5 rounded text-xs font-bold transition-colors">Rolar Dano</button>
                    </div>
                    <p className="text-sm text-[#D4D4D8]">Teste: <span className="font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-1 rounded">2d20+5</span> | Dano: <span className="font-mono text-[#EF4444] bg-[#EF4444]/10 px-1 rounded">1d8+3</span> Corte</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F97316] mb-3 border-b border-[#27272A] pb-2 flex items-center gap-2">
                    <Zap size={16} /> HABILIDADES
                  </h4>
                  <div className="bg-[#101012] border border-[#27272A] p-4 rounded-lg">
                    <span className="font-bold text-white text-base block mb-2">Frenesi Sangrento</span>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed">Quando o Zumbi de Sangue atinge metade da sua vida, ele ganha uma ação de movimento extra por turno e +2 em testes de ataque corpo a corpo. O seu dano crítico também aumenta em 1 multiplicador.</p>
                  </div>
                </div>
              </div>
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
