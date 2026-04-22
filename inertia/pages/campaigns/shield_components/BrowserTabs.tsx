import { Monitor, Swords, Dices, X, Users, FileText, Settings, LucideIcon, Ghost } from 'lucide-react'
import { motion } from 'framer-motion'

interface BrowserTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSettings?: () => void
}

export default function BrowserTabs({ activeTab, setActiveTab, onOpenSettings }: BrowserTabsProps) {
  const tabs = [
    { id: 'missoes', label: 'Missões', icon: Monitor },
    { id: 'combates', label: 'Combates', icon: Swords },
    { id: 'bestiario', label: 'Bestiário', icon: Ghost },
    { id: 'dados', label: 'Dados', icon: Dices },
    { id: 'jogadores', label: 'Grupo', icon: Users },
    { id: 'anotacoes', label: 'Anotações', icon: FileText },
  ]

  return (
    <div className="flex bg-[#09090B] px-2 pt-2 border-b border-[#27272A] gap-1 select-none">
      {tabs.map((tab) => {
        const Icon: LucideIcon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-semibold transition-all relative min-w-[140px] max-w-[200px] border-x border-t
              ${isActive 
                ? 'bg-[#18181B] text-white border-[#27272A] border-b-[#18181B] z-10' 
                : 'bg-[#101012] text-[#A1A1AA] border-transparent hover:bg-[#1C1C1E] border-b-[#27272A]'
              }`}
            style={{ marginBottom: isActive ? '-1px' : '0' }}
          >
            {isActive && (
              <motion.div
                layoutId="top-tab-indicator"
                className="absolute top-0 left-0 right-0 h-0.5 bg-[#F97316] rounded-t-lg"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon size={14} className={isActive ? 'text-[#F97316]' : 'text-[#A1A1AA]'} />
            <span className="flex-1 text-left truncate">{tab.label}</span>
            <div className={`p-0.5 rounded-md hover:bg-[#27272A] transition-colors ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <X size={12} />
            </div>
          </button>
        )
      })}
      
      <button className="flex items-center justify-center w-8 h-8 mt-1 ml-1 rounded-md text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-white transition-colors">
        <span className="text-xl leading-none">+</span>
      </button>

      {onOpenSettings && (
        <div className="ml-auto flex items-center pr-4">
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center w-8 h-8 rounded-md text-[#A1A1AA] hover:bg-[#1C1C1E] hover:text-[#F97316] transition-colors"
            title="Configurações da Campanha"
          >
            <Settings size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
